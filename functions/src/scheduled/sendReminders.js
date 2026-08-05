const { onSchedule } = require('firebase-functions/v2/scheduler');
const { logger } = require('firebase-functions/v2');
const { getFirestore } = require('firebase-admin/firestore');
const { sendReminderEmail } = require('../emailService');

const db = getFirestore();

/**
 * Scheduled function: Send reminder emails for bookings in the next 24 hours
 * Runs every hour
 */
exports.sendReminders = onSchedule('every 60 minutes', async (event) => {
  logger.info('Running scheduled reminder check...');

  try {
    // Calculate the time window: now + 24 hours
    const now = new Date();
    const reminderWindowStart = new Date(now.getTime() + 23 * 60 * 60 * 1000); // 23 hours from now
    const reminderWindowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000); // 25 hours from now

    logger.info(`Checking for bookings between ${reminderWindowStart.toISOString()} and ${reminderWindowEnd.toISOString()}`);

    // Query for confirmed bookings in the reminder window
    const bookingsSnapshot = await db
      .collection('bookings')
      .where('status', '==', 'confirmed')
      .get();

    if (bookingsSnapshot.empty) {
      logger.info('No confirmed bookings found');
      return;
    }

    logger.info(`Found ${bookingsSnapshot.size} confirmed bookings`);

    let remindersSent = 0;
    const batch = db.batch();

    for (const doc of bookingsSnapshot.docs) {
      const booking = doc.data();
      const bookingId = doc.id;

      // Parse booking date/time
      const bookingDate = new Date(booking.date);
      const [hours, minutes] = booking.time.split(':');
      bookingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      // Check if booking is within the reminder window (23-25 hours from now)
      if (
        bookingDate >= reminderWindowStart &&
        bookingDate <= reminderWindowEnd
      ) {
        // Check if reminder was already sent
        if (booking.emailSent?.reminder) {
          logger.info(`Reminder already sent for booking ${bookingId}, skipping`);
          continue;
        }

        logger.info(`Sending reminder for booking ${bookingId}`);

        // Use the static meeting link or a booking-specific link if provided
        const { STATIC_MEETING_LINK } = require('../config');
        const meetingLink = booking.meeting_link || STATIC_MEETING_LINK || 'https://meet.google.com/';

        // Send reminder email
        try {
          const result = await sendReminderEmail({
            student_email: booking.student_email,
            student_name: booking.student_name,
            date: booking.date,
            time: booking.time,
            lesson_type: booking.lesson_type,
            is_paid_lesson: booking.is_paid_lesson,
            meeting_link: meetingLink,
          });

          if (result.success) {
            logger.info(`Reminder email sent to ${booking.student_email}`);
            remindersSent++;

            // Mark reminder as sent
            batch.update(doc.ref, {
              'emailSent.reminder': true,
              reminderSentAt: new Date().toISOString(),
            });

            // Log email delivery
            const logRef = doc.ref.collection('email_logs').doc();
            batch.set(logRef, {
              type: 'reminder',
              status: 'sent',
              timestamp: new Date(),
            });
          } else {
            logger.error(`Failed to send reminder: ${result.error}`);

            // Log failed attempt
            const logRef = doc.ref.collection('email_logs').doc();
            batch.set(logRef, {
              type: 'reminder',
              status: 'failed',
              error: result.error,
              timestamp: new Date(),
            });
          }
        } catch (error) {
          logger.error(`Error sending reminder for booking ${bookingId}:`, error);

          // Log error
          const logRef = doc.ref.collection('email_logs').doc();
          batch.set(logRef, {
            type: 'reminder',
            status: 'error',
            error: error.message,
            timestamp: new Date(),
          });
        }
      }
    }

    // Commit all updates
    await batch.commit();

    logger.info(`Scheduled reminder check completed. Sent ${remindersSent} reminders.`);
  } catch (error) {
    logger.error('Error in sendReminders scheduled function:', error);
  }
});
