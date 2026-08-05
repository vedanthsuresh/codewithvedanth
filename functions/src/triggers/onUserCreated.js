const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions/v2');
const { sendWelcomeEmail } = require('../emailService');

/**
 * Firestore trigger: Send welcome email when a new user is created
 * Triggered on: users/{uid} creation
 */
exports.onUserCreated = onDocumentCreated('users/{uid}', async (event) => {
  const snapshot = event.data;
  const userData = snapshot.data();

  if (!userData) {
    logger.warn('No user data found in snapshot');
    return;
  }

  const uid = event.params.uid;
  const { email, displayName, phoneNumber, age } = userData;

  logger.info(`New user created: ${uid}, email: ${email}`);

  // Check if welcome email was already sent
  if (userData.emailSent?.welcome) {
    logger.info(`Welcome email already sent for user ${uid}, skipping`);
    return;
  }

  // Send welcome email
  try {
    const result = await sendWelcomeEmail({
      email,
      displayName,
      phoneNumber,
      age,
    });

    if (result.success) {
      logger.info(`Welcome email sent successfully to ${email}`);

      // Mark welcome email as sent
      await snapshot.ref.update({
        'emailSent.welcome': true,
      });

      // Log email delivery
      await snapshot.ref.collection('email_logs').add({
        type: 'welcome',
        status: 'sent',
        timestamp: new Date(),
      });
    } else {
      logger.error(`Failed to send welcome email: ${result.error}`);

      // Log failed attempt
      await snapshot.ref.collection('email_logs').add({
        type: 'welcome',
        status: 'failed',
        error: result.error,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    logger.error('Error in onUserCreated trigger:', error);

    // Don't throw - allow the main operation to succeed
    await snapshot.ref.collection('email_logs').add({
      type: 'welcome',
      status: 'error',
      error: error.message,
      timestamp: new Date(),
    });
  }
});
