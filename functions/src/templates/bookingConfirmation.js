const { FROM_NAME } = require('../config');

/**
 * Render booking confirmation email template
 * @param {Object} data - Template data
 * @param {string} data.studentName - Student's name
 * @param {string} data.date - Booking date (formatted)
 * @param {string} data.time - Booking time
 * @param {string} data.lessonType - Type of lesson (1-on-1, Group, Free Trial)
 * @param {string} data.price - Price or "Free"
 * @returns {string} HTML email content
 */
function renderBookingConfirmation(data) {
  const { studentName, date, time, lessonType, price } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - ${FROM_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your ${lessonType} lesson is scheduled</p>
    </div>

    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
      <div style="background: #d4edda; color: #155724; padding: 15px 20px; border-radius: 5px; margin: 20px 0;">
        <strong style="font-size: 18px;">✓ Booking Confirmed</strong><br>
        We've received your booking and you're all set!
      </div>

      <p style="font-size: 16px;">Hi <strong>${escapeHtml(studentName)}</strong>!</p>

      <p style="font-size: 16px;">Your <strong>${lessonType}</strong> lesson has been successfully booked. Here are the details:</p>

      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
        <h3 style="margin-top: 0; color: #667eea;">Lesson Details</h3>
        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #667eea;">📅 Date:</strong> ${escapeHtml(date)}
        </div>
        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #667eea;">⏰ Time:</strong> ${escapeHtml(time)}
        </div>
        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #667eea;">📚 Lesson Type:</strong> ${escapeHtml(lessonType)}
        </div>
        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #667eea;">👤 Student:</strong> ${escapeHtml(studentName)}
        </div>
        <div style="padding: 10px 0;">
          <strong style="color: #667eea;">💰 Price:</strong> ${escapeHtml(price)}
        </div>
      </div>

      <h3 style="color: #667eea;">What to expect:</h3>
      <ul style="line-height: 1.8;">
        <li>A fun, interactive 45-minute coding session</li>
        <li>Personalized instruction based on your skill level</li>
        <li>Hands-on coding practice with real projects</li>
        <li>Learn programming concepts you can apply immediately</li>
      </ul>

      <div style="background: #fff3cd; color: #856404; padding: 15px 20px; border-radius: 5px; margin: 25px 0; border-left: 4px solid #ffc107;">
        <strong>📧 Meeting Information:</strong><br>
        You'll receive a Google Meet link 24 hours before your class. Please check your email then!
      </div>

      <h3 style="color: #667eea;">How to join:</h3>
      <p style="font-size: 15px;">Make sure you have:</p>
      <ul style="line-height: 1.8;">
        <li>✅ A computer with internet connection</li>
        <li>✅ A Google account (for Google Meet)</li>
        <li>✅ Notebook and pen for taking notes</li>
        <li>✅ Any questions you'd like to ask!</li>
      </ul>

      <p style="font-size: 15px;"><strong>You'll receive a reminder email 24 hours before your lesson with the meeting link.</strong></p>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; font-size: 14px;">
        <strong>Need to reschedule?</strong><br>
        Please reply to this email or call <strong>943-238-1652</strong> at least 24 hours in advance.
      </div>
    </div>

    <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;">
      <p style="margin: 0 0 8px 0;">${FROM_NAME} | Teaching kids to code, one line at a time.</p>
      <p style="margin: 0;">Questions? 📧 vedanth.suresh039@gmail.com | 📞 943-238-1652</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Helper function to escape HTML and prevent XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

module.exports = { renderBookingConfirmation };
