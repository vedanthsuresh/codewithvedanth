const { FROM_NAME } = require('../config');

/**
 * Render instructor-initiated cancellation email template
 * Used when the instructor/admin cancels a class (not the student)
 * @param {Object} data - Template data
 * @param {string} data.studentName - Student's name
 * @param {string} data.date - Booking date (formatted)
 * @param {string} data.time - Booking time
 * @param {string} data.reason - Cancellation reason (optional)
 * @returns {string} HTML email content
 */
function renderInstructorCancellationEmail(data) {
  const { studentName, date, time, reason } = data;

  // Optional reason section
  const reasonSection = reason ? `
    <div style="background: #fff3cd; color: #856404; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
      <strong>📝 Reason:</strong><br>
      ${escapeHtml(reason)}
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Class Schedule Change - ${FROM_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">Schedule Change</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your class has been rescheduled</p>
    </div>

    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
      <p style="font-size: 16px;">Hi <strong>${escapeHtml(studentName)}</strong>!</p>

      <p style="font-size: 16px;">We sincerely apologize, but we need to reschedule your upcoming class. Sometimes unexpected circumstances arise that require us to adjust our schedule.</p>

      ${reasonSection}

      <div style="background: #fef3c7; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <h3 style="margin-top: 0; color: #92400e;">Affected Class</h3>
        <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #92400e;">📅 Date:</strong> ${escapeHtml(date)}
        </div>
        <div style="padding: 10px 0;">
          <strong style="color: #92400e;">⏰ Time:</strong> ${escapeHtml(time)}
        </div>
      </div>

      <h3 style="color: #667eea;">Reschedule Your Class</h3>
      <p style="font-size: 15px; margin-bottom: 15px;">We'd love to get you rescheduled at a time that works for you. Here's how:</p>
      <ul style="line-height: 1.8;">
        <li>📅 Visit our website to book a new time slot</li>
        <li>📞 Call or text us at <strong>943-238-1652</strong></li>
        <li>📧 Reply to this email with your preferred times</li>
      </ul>

      <div style="background: #e8f5e9; color: #2e7d32; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4caf50;">
        <strong>💡 Good News:</strong><br>
        Your free trial is still available! We'll make sure you get your class at a time that works perfectly for you.
      </div>

      <p style="font-size: 15px;">Again, we apologize for any inconvenience and appreciate your understanding. We're looking forward to teaching you!</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://codewithvedanth.com/book-trial" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Book New Time</a>
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

module.exports = { renderInstructorCancellationEmail };
