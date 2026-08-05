const { FROM_NAME } = require('../config');

/**
 * Render booking cancellation email template
 * @param {Object} data - Template data
 * @param {string} data.studentName - Student's name
 * @param {string} data.date - Booking date (formatted)
 * @param {string} data.time - Booking time
 * @returns {string} HTML email content
 */
function renderCancellationEmail(data) {
  const { studentName, date, time } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled - ${FROM_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #f87171 0%, #ef4444 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">Booking Cancelled</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your lesson has been cancelled</p>
    </div>

    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
      <p style="font-size: 16px;">Hi <strong>${escapeHtml(studentName)}</strong>!</p>

      <p style="font-size: 16px;">Your booking has been successfully cancelled. Here are the details:</p>

      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
        <h3 style="margin-top: 0; color: #ef4444;">Cancelled Lesson</h3>
        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #ef4444;">📅 Date:</strong> ${escapeHtml(date)}
        </div>
        <div style="padding: 10px 0;">
          <strong style="color: #ef4444;">⏰ Time:</strong> ${escapeHtml(time)}
        </div>
      </div>

      <h3 style="color: #667eea;">What's Next?</h3>
      <p style="font-size: 15px; margin-bottom: 15px;">We understand plans change. Here's what you can do:</p>
      <ul style="line-height: 1.8;">
        <li>📅 Book a new trial class at a time that works for you</li>
        <li>📞 Contact us if you have any questions or need to reschedule</li>
        <li>🎓 We're here to help you learn coding whenever you're ready</li>
      </ul>

      <div style="background: #e8f5e9; color: #2e7d32; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4caf50;">
        <strong>💡 Remember:</strong><br>
        Your trial is still available! You can book another free trial class whenever you're ready.
      </div>

      <p style="font-size: 15px;">We hope to see you back in class soon!</p>
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

module.exports = { renderCancellationEmail };
