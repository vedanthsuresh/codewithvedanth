const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions/v2');
const { getFirestore } = require('firebase-admin/firestore');
const { sendFollowUpEmail, sendCancellationEmail } = require('../emailService');

const db = getFirestore();

/**
 * Firestore trigger: Send emails when booking status changes
 * Triggered on: bookings/{bookingId} update
 * Handles: 'completed' (follow-up email) and 'cancelled' (cancellation email)
 */
exports.onBookingUpdated = onDocumentUpdated('bookings/{bookingId}', async (event) => {
  const snapshot = event.data;
  const bookingData = snapshot.after.data();

  if (!bookingData) {
    logger.warn('No booking data found in snapshot');
    return;
  }

  const bookingId = event.params.bookingId;

  // Get previous data to check what changed
  const previousData = snapshot.before.data();
  const previousStatus = previousData?.status;
  const newStatus = bookingData.status;

  logger.info(`Booking ${bookingId} updated, status: ${previousStatus} → ${newStatus}`);

  // Handle COMPLETED status - send follow-up email
  if (newStatus === 'completed' && previousStatus !== 'completed') {
    await handleCompletedBooking(bookingId, bookingData, previousData);
  }

  // Handle CANCELLED status - send cancellation email
  if (newStatus === 'cancelled' && previousStatus !== 'cancelled') {
    await handleCancelledBooking(bookingId, bookingData, previousData);
  }
});

/**
 * Handle booking completion - send follow-up email
 */
async function handleCompletedBooking(bookingId, bookingData, previousData) {
  // Check if follow-up email was already sent
  if (bookingData.emailSent?.followUp) {
    logger.info(`Follow-up email already sent for booking ${bookingId}, skipping`);
    return;
  }

  // Get user data for the follow-up email
  const userId = bookingData.user_id;
  if (!userId) {
    logger.warn(`No user_id found for booking ${bookingId}, cannot send follow-up email`);
    return;
  }

  try {
    // Fetch user data from Firestore
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      logger.warn(`User ${userId} not found, cannot send follow-up email`);
      return;
    }

    const userData = userDoc.data();
    const { email, displayName } = userData;

    logger.info(`Sending follow-up email to ${email} for completed booking ${bookingId}`);

    // Send follow-up email
    const result = await sendFollowUpEmail({
      email,
      displayName,
    });

    if (result.success) {
      logger.info(`Follow-up email sent successfully to ${email}`);

      // Mark follow-up email as sent
      await db.collection('bookings').doc(bookingId).update({
        'emailSent.followUp': true,
      });

      // Update user's trial status
      await userDoc.ref.update({
        hasTakenTrial: true,
        trialCompletedAt: new Date().toISOString(),
      });

      // Log email delivery
      await db.collection('bookings').doc(bookingId).collection('email_logs').add({
        type: 'follow_up',
        status: 'sent',
        timestamp: new Date(),
      });
    } else {
      logger.error(`Failed to send follow-up email: ${result.error}`);

      // Log failed attempt
      await db.collection('bookings').doc(bookingId).collection('email_logs').add({
        type: 'follow_up',
        status: 'failed',
        error: result.error,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    logger.error('Error sending follow-up email:', error);

    // Don't throw - allow the main operation to succeed
    await db.collection('bookings').doc(bookingId).collection('email_logs').add({
      type: 'follow_up',
      status: 'error',
      error: error.message,
      timestamp: new Date(),
    });
  }
}

/**
 * Handle booking cancellation - send cancellation email
 */
async function handleCancelledBooking(bookingId, bookingData, previousData) {
  // Check if cancellation email was already sent
  if (bookingData.emailSent?.cancellation) {
    logger.info(`Cancellation email already sent for booking ${bookingId}, skipping`);
    return;
  }

  try {
    logger.info(`Sending cancellation email for booking ${bookingId}`);

    // Send cancellation email
    const result = await sendCancellationEmail({
      student_email: bookingData.student_email,
      student_name: bookingData.student_name,
      date: bookingData.date,
      time: bookingData.time,
    });

    if (result.success) {
      logger.info(`Cancellation email sent successfully to ${bookingData.student_email}`);

      // Mark cancellation email as sent
      await db.collection('bookings').doc(bookingId).update({
        'emailSent.cancellation': true,
      });

      // Log email delivery
      await db.collection('bookings').doc(bookingId).collection('email_logs').add({
        type: 'cancellation',
        status: 'sent',
        timestamp: new Date(),
      });
    } else {
      logger.error(`Failed to send cancellation email: ${result.error}`);

      // Log failed attempt
      await db.collection('bookings').doc(bookingId).collection('email_logs').add({
        type: 'cancellation',
        status: 'failed',
        error: result.error,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    logger.error('Error sending cancellation email:', error);

    // Don't throw - allow the main operation to succeed
    await db.collection('bookings').doc(bookingId).collection('email_logs').add({
      type: 'cancellation',
      status: 'error',
      error: error.message,
      timestamp: new Date(),
    });
  }
}
