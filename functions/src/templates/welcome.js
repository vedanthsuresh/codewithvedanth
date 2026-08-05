const { APP_URL, FROM_NAME } = require('../config');

/**
 * Render welcome email template
 * @param {Object} data - Template data
 * @param {string} data.studentName - Student's display name
 * @param {string} data.email - Student's email
 * @param {string} data.phone - Student's phone (optional)
 * @param {string} data.age - Student's age (optional)
 * @returns {string} HTML email content
 */
function renderWelcomeEmail(data) {
  const { studentName, email, phone = 'Not provided', age = 'Not provided' } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${FROM_NAME}!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">Welcome to ${FROM_NAME}! 👋</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Your coding journey begins now</p>
    </div>

    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
      <p style="font-size: 16px;">Hi <strong>${escapeHtml(studentName)}</strong>!</p>

      <p style="font-size: 16px;">Welcome to <strong>${FROM_NAME}</strong>! We're thrilled to have you join our programming classes. You're about to embark on an exciting journey into the world of coding!</p>

      <h3 style="color: #667eea; margin-top: 25px;">What happens next?</h3>
      <ul style="line-height: 1.8;">
        <li>📅 Book your <strong>free trial class</strong> to experience our teaching style</li>
        <li>🐍 Explore <strong>Python</strong>, <strong>Web Development</strong>, or <strong>Mobile Development</strong></li>
        <li>💻 Learn to build real projects at your own pace</li>
        <li>🎓 Get personalized instruction from an award-winning instructor</li>
      </ul>

      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
        <h4 style="margin-top: 0; color: #667eea;">Your Account Details:</h4>
        <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
          <strong style="color: #667eea;">Email:</strong> ${escapeHtml(email)}
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${APP_URL}/book-trial" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Book Your Free Trial Class</a>
      </div>

      <p style="font-size: 14px; color: #666;">Questions? Just reply to this email or contact us at:</p>
      <p style="font-size: 14px; color: #666;">📧 vedanth.suresh039@gmail.com | 📞 943-238-1652</p>
    </div>

    <div style="background: #333; color: #ccc; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px;">
      <p style="margin: 0 0 8px 0;">${FROM_NAME} | Teaching kids to code, one line at a time.</p>
      <p style="margin: 0;">You're receiving this email because you signed up for an account.</p>
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

module.exports = { renderWelcomeEmail };
