const { APP_URL, FROM_NAME } = require('../config');

/**
 * Render follow-up email template (sent after trial completion)
 * @param {Object} data - Template data
 * @param {string} data.studentName - Student's name
 * @returns {string} HTML email content
 */
function renderFollowUpEmail(data) {
  const { studentName } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for Trying ${FROM_NAME}!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">Thanks for Trying ${FROM_NAME}! 🙌</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.9;">Hope you had a great first class!</p>
    </div>

    <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
      <p style="font-size: 16px;">Hi <strong>${escapeHtml(studentName)}</strong>!</p>

      <p style="font-size: 16px;">Thanks for completing your free trial class. We hope you enjoyed learning to code with us!</p>

      <h3 style="color: #667eea; margin-top: 25px;">Ready to continue your coding journey?</h3>
      <p style="font-size: 16px;">Now that you've experienced our teaching style, here's what you can do next:</p>

      <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin: 25px 0; border: 2px solid #667eea; text-align: center;">
        <h2 style="color: #667eea; margin-top: 0;">Enroll in Regular Classes</h2>
        <p style="font-size: 16px;">Keep learning and building amazing projects!</p>

        <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 20px;">
            <strong style="font-size: 18px;">1-on-1 Lessons</strong><br>
            <span style="font-size: 28px; font-weight: bold; color: #667eea;">$10</span>
            <span style="color: #666;">/45-min session</span><br>
            <small style="color: #666;">Personalized attention, learn at your pace</small>
          </div>

          <div>
            <strong style="font-size: 18px;">Group Lessons</strong><br>
            <span style="font-size: 28px; font-weight: bold; color: #667eea;">$8</span>
            <span style="color: #666;">/45-min session</span><br>
            <small style="color: #666;">Learn with friends, max 4 students</small>
          </div>
        </div>

        <div style="margin: 30px 0;">
          <a href="${APP_URL}/book-lesson" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; margin: 5px;">Book Your Next Lesson</a>
          <br><br>
          <a href="${APP_URL}/lessons" style="color: #667eea; text-decoration: none; font-weight: 500;">View All Learning Paths →</a>
        </div>
      </div>

      <h3 style="color: #667eea;">Learning Paths Available:</h3>
      <ul style="line-height: 1.8;">
        <li>🐍 <strong>Python</strong> - Programming fundamentals and projects</li>
        <li>🌐 <strong>Web Development</strong> - Build websites and web apps</li>
        <li>📱 <strong>Mobile Development</strong> - Create mobile applications</li>
      </ul>

      <div style="background: #e8f5e9; color: #2e7d32; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #4caf50;">
        <strong>🎓 Why Continue with ${FROM_NAME}?</strong>
        <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
          <li>Award-winning instructor (top 10 nationally in web design)</li>
          <li>300+ hours of practical coding experience</li>
          <li>Build 30+ real projects and apps</li>
          <li>Personalized learning at your pace</li>
        </ul>
      </div>

      <p style="font-size: 16px;">Have questions about continuing? Reply to this email or call <strong>943-238-1652</strong>. We're happy to help!</p>
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

module.exports = { renderFollowUpEmail };
