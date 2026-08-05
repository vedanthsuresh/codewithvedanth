const { Resend } = require('resend');
const { logger } = require('firebase-functions/v2');

// Get environment variables with safe defaults
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const INSTRUCTOR_EMAIL = process.env.INSTRUCTOR_EMAIL || 'vedanth.suresh039@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const FROM_NAME = process.env.FROM_NAME || 'Code with Vedanth';
const STATIC_MEETING_LINK = process.env.STATIC_MEETING_LINK || 'https://meet.google.com/';

// Initialize Resend client (will be null if API key is missing during build)
let resend = null;

if (RESEND_API_KEY && RESEND_API_KEY.startsWith('re_')) {
  try {
    resend = new Resend(RESEND_API_KEY);
    logger.info('Resend client initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Resend client:', error);
  }
} else {
  logger.warn('RESEND_API_KEY not set or invalid. Email functionality will be disabled.');
}

/**
 * Send an email using Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string[]} options.cc - CC recipients (optional)
 * @returns {Promise<Object>} Result with success flag and data/error
 */
async function sendEmail({ to, subject, html, cc = [] }) {
  // Check if Resend is available
  if (!resend) {
    const error = 'Resend client not initialized. Check RESEND_API_KEY.';
    logger.error(error);
    return { success: false, error };
  }

  try {
    const recipients = Array.isArray(to) ? to : [to];

    const emailData = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipients,
      subject,
      html,
    };

    // Add CC if provided
    if (cc.length > 0) {
      emailData.cc = cc;
    }

    logger.info(`Sending email to: ${recipients.join(', ')}`);

    const result = await resend.emails.send(emailData);

    logger.info('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    logger.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email to new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User's email
 * @param {string} userData.displayName - User's display name
 * @param {string} userData.phoneNumber - User's phone (optional)
 * @param {string} userData.age - User's age (optional)
 * @returns {Promise<Object>} Result with success flag
 */
async function sendWelcomeEmail(userData) {
  const { renderWelcomeEmail } = require('./templates');

  const { email, displayName, phoneNumber, age } = userData;

  const html = renderWelcomeEmail({
    studentName: displayName || email?.split('@')[0] || 'Student',
    email,
    phone: phoneNumber || 'Not provided',
    age: age || 'Not provided',
  });

  return sendEmail({
    to: email,
    subject: `Welcome to ${FROM_NAME}! Let's Start Coding! 🚀`,
    html,
  });
}

/**
 * Send booking confirmation email
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.student_email - Student's email
 * @param {string} bookingData.student_name - Student's name
 * @param {string} bookingData.date - Booking date
 * @param {string} bookingData.time - Booking time
 * @param {string} bookingData.lesson_type - Type of lesson
 * @param {boolean} bookingData.is_paid_lesson - Is this a paid lesson?
 * @returns {Promise<Object>} Result with success flag
 */
async function sendBookingConfirmationEmail(bookingData) {
  const { renderBookingConfirmation } = require('./templates');

  const { student_email, student_name, date, time, lesson_type, is_paid_lesson } = bookingData;

  // Determine lesson type display name
  let lessonTypeDisplay = 'Free Trial';
  let priceDisplay = 'Free';

  if (is_paid_lesson) {
    if (lesson_type === '1-on-1') {
      lessonTypeDisplay = '1-on-1 Lesson';
      priceDisplay = '$10';
    } else if (lesson_type === 'group') {
      lessonTypeDisplay = 'Group Lesson';
      priceDisplay = '$8';
    } else {
      lessonTypeDisplay = 'Paid Lesson';
      priceDisplay = '$8-10';
    }
  }

  const html = renderBookingConfirmation({
    studentName: student_name,
    date: formatDate(date),
    time: formatTime(time),
    lessonType: lessonTypeDisplay,
    price: priceDisplay,
  });

  // CC the instructor on booking confirmations
  return sendEmail({
    to: student_email,
    subject: `Booking Confirmed: ${lessonTypeDisplay} on ${formatDate(date)}`,
    html,
    cc: [INSTRUCTOR_EMAIL],
  });
}

/**
 * Send reminder email (24 hours before lesson)
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.student_email - Student's email
 * @param {string} bookingData.student_name - Student's name
 * @param {string} bookingData.date - Booking date
 * @param {string} bookingData.time - Booking time
 * @param {string} bookingData.lesson_type - Type of lesson
 * @param {string} bookingData.meeting_link - Meeting link (optional)
 * @returns {Promise<Object>} Result with success flag
 */
async function sendReminderEmail(bookingData) {
  const { renderReminderEmail } = require('./templates');

  const {
    student_email,
    student_name,
    date,
    time,
    lesson_type,
    meeting_link,
    is_paid_lesson,
  } = bookingData;

  // Determine lesson type display name
  let lessonTypeDisplay = 'Free Trial';
  if (is_paid_lesson) {
    if (lesson_type === '1-on-1') {
      lessonTypeDisplay = '1-on-1 Lesson';
    } else if (lesson_type === 'group') {
      lessonTypeDisplay = 'Group Lesson';
    } else {
      lessonTypeDisplay = 'Lesson';
    }
  }

  // Use provided meeting link or the static link
  const meetingLink = meeting_link || STATIC_MEETING_LINK;

  const html = renderReminderEmail({
    studentName: student_name,
    date: formatDate(date),
    time: formatTime(time),
    lessonType: lessonTypeDisplay,
    meetingLink: meetingLink,
  });

  return sendEmail({
    to: student_email,
    subject: `⏰ Reminder: Your ${lessonTypeDisplay} is Tomorrow!`,
    html,
  });
}

/**
 * Send follow-up email after trial completion
 * @param {Object} userData - User data
 * @param {string} userData.email - User's email
 * @param {string} userData.displayName - User's display name
 * @returns {Promise<Object>} Result with success flag
 */
async function sendFollowUpEmail(userData) {
  const { renderFollowUpEmail } = require('./templates');
  const { APP_URL } = require('./config');

  const { email, displayName } = userData;

  const html = renderFollowUpEmail({
    studentName: displayName || email?.split('@')[0] || 'Student',
    appUrl: APP_URL,
  });

  return sendEmail({
    to: email,
    subject: `Thanks for trying ${FROM_NAME}! Ready to continue? 🚀`,
    html,
  });
}

/**
 * Send booking cancellation email
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.student_email - Student's email
 * @param {string} bookingData.student_name - Student's name
 * @param {string} bookingData.date - Booking date
 * @param {string} bookingData.time - Booking time
 * @returns {Promise<Object>} Result with success flag
 */
async function sendCancellationEmail(bookingData) {
  const { renderCancellationEmail } = require('./templates');

  const { student_email, student_name, date, time } = bookingData;

  const html = renderCancellationEmail({
    studentName: student_name,
    date: formatDate(date),
    time: formatTime(time),
  });

  // Also CC the instructor on cancellations
  return sendEmail({
    to: student_email,
    subject: `Booking Cancelled - ${formatDate(date)} at ${formatTime(time)}`,
    html,
    cc: [INSTRUCTOR_EMAIL],
  });
}

/**
 * Send instructor-initiated cancellation email
 * Used when the instructor/admin cancels a class (more apologetic tone)
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.student_email - Student's email
 * @param {string} bookingData.student_name - Student's name
 * @param {string} bookingData.date - Booking date
 * @param {string} bookingData.time - Booking time
 * @param {string} bookingData.reason - Cancellation reason (optional)
 * @returns {Promise<Object>} Result with success flag
 */
async function sendInstructorCancellationEmail(bookingData) {
  const { renderInstructorCancellationEmail } = require('./templates');

  const { student_email, student_name, date, time, reason } = bookingData;

  const html = renderInstructorCancellationEmail({
    studentName: student_name,
    date: formatDate(date),
    time: formatTime(time),
    reason: reason || null,
  });

  return sendEmail({
    to: student_email,
    subject: `Schedule Change: Your ${formatDate(date)} Class`,
    html,
    cc: [INSTRUCTOR_EMAIL],
  });
}

/**
 * Format date for display in emails
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  if (!date) return 'Date TBD';

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return date; // Return original if can't parse
  }

  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time for display in emails
 * @param {string} time - Time string (e.g., "14:00" or "2:00 PM")
 * @returns {string} Formatted time
 */
function formatTime(time) {
  if (!time) return 'Time TBD';

  // If already formatted (contains AM/PM), return as is
  if (time.includes('AM') || time.includes('PM') || time.includes('am') || time.includes('pm')) {
    return time;
  }

  // Try to parse and format
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    if (isNaN(hour) || isNaN(minute)) {
      return time;
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12
    return `${displayHour}:${minutes.padStart(2, '0')} ${period}`;
  } catch (error) {
    return time;
  }
}

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendReminderEmail,
  sendFollowUpEmail,
  sendCancellationEmail,
  sendInstructorCancellationEmail,
};
