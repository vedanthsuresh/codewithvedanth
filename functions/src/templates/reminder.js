const { FROM_NAME } = require('../config');

/**
 * Render reminder email template (24 hours before lesson)
 * @param {Object} data - Template data
 * @param {string} data.studentName - Student's name
 * @param {string} data.date - Booking date (formatted)
 * @param {string} data.time - Booking time
 * @param {string} data.lessonType - Type of lesson
 * @param {string} data.meetingLink - Google Meet link or meeting URL
 * @returns {string} HTML email content
 */
function renderReminderEmail(data) {
  const { studentName, date, time, lessonType, meetingLink } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder: Your Lesson is Tomorrow - ${FROM_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">Reminder: Your Lesson is Tomorrow! ⏰</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Get ready for your coding class</p>
    </div>

    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
      <div style="background: #fff3cd; color: #856404; padding: 15px 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <strong style="font-size: 18px;">🔔 Reminder</strong><br>
        Your ${lessonType} lesson starts in approximately 24 hours!
      </div>

      <p style="font-size: 16px;">Hi <strong>${escapeHtml(studentName)}</strong>!</p>

      <p style="font-size: 16px;">This is a friendly reminder that you have a lesson scheduled for tomorrow:</p>

      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0;">
        <h3 style="margin: 0 0 10px 0; font-size: 20px;">${escapeHtml(date)}</h3>
        <h2 style="margin: 0; font-size: 32px;">${escapeHtml(time)}</h2>
      </div>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
        <h3 style="margin-top: 0; color: #667eea;">Lesson Details:</h3>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li><strong>Type:</strong> ${escapeHtml(lessonType)}</li>
          <li><strong>Duration:</strong> 45 minutes</li>
          <li><strong>Instructor:</strong> Vedanth Suresh</li>
        </ul>
      </div>

      <h3 style="color: #667eea;">🎥 Meeting Link:</h3>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${escapeHtml(meetingLink)}" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Join Google Meet</a>
        <p style="margin-top: 10px; font-size: 13px; color: #666;">Click the button above or copy this link:<br>
        <span style="color: #667eea; word-break: break-all;">${escapeHtml(meetingLink)}</span></p>
      </div>

      <h3 style="color: #667eea;">✅ Before the class:</h3>
      <ul style="line-height: 1.8;">
        <li>Test your internet connection</li>
        <li>Have a notebook and pen ready</li>
        <li>Log in 5 minutes early to resolve any technical issues</li>
        <li>Bring any questions from previous sessions</li>
        <li>Find a quiet space where you can focus</li>
      </ul>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; font-size: 14px;">
        <strong>Can't make it?</strong><br>
        Please reply to this email ASAP to reschedule. Late cancellations may incur fees.
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

module.exports = { renderReminderEmail };
