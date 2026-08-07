const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { logger } = require('firebase-functions/v2');
const { getFirestore } = require('firebase-admin/firestore');
const { sendBookingConfirmationEmail } = require('../emailService');

const db = getFirestore();

/**
 * Firestore trigger: Send booking confirmation email when a new booking is created
 * Triggered on: bookings/{bookingId} creation
 */
exports.onBookingCreated = onDocumentCreated('bookings/{bookingId}', async (event) => {
  const snapshot = event.data;
  const bookingData = snapshot.data();

  if (!bookingData) {
    logger.warn('No booking data found in snapshot');
    return;
  }

  const bookingId = event.params.bookingId;
  const { student_email, student_name, lesson_type, is_paid_lesson } = bookingData;

  logger.info(`New booking created: ${bookingId}, email: ${student_email}`);

  // Check if confirmation email was already sent
  if (bookingData.emailSent?.confirmation) {
    logger.info(`Confirmation email already sent for booking ${bookingId}, skipping`);
    return;
  }

  // Send booking confirmation email
  try {
    // Fetch time slot details for date/time
    const slotRef = db.collection('time_slots').doc(bookingData.time_slot_id);
    const slotSnap = await slotRef.get();

    let slotData = {};
    if (slotSnap.exists) {
      slotData = slotSnap.data();
      logger.info(`Retrieved time slot: ${slotData.date} at ${slotData.time}`);
    } else {
      logger.warn(`Time slot ${bookingData.time_slot_id} not found for booking ${bookingId}`);
    }

    const result = await sendBookingConfirmationEmail({
      student_email,
      student_name,
      date: slotData.date || null,
      time: slotData.time || null,
      lesson_type,
      is_paid_lesson,
    });

    if (result.success) {
      logger.info(`Booking confirmation email sent successfully to ${student_email}`);

      // Mark confirmation email as sent
      await snapshot.ref.update({
        'emailSent.confirmation': true,
      });

      // Log email delivery
      await snapshot.ref.collection('email_logs').add({
        type: 'confirmation',
        status: 'sent',
        timestamp: new Date(),
      });
    } else {
      logger.error(`Failed to send booking confirmation email: ${result.error}`);

      // Log failed attempt
      await snapshot.ref.collection('email_logs').add({
        type: 'confirmation',
        status: 'failed',
        error: result.error,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    logger.error('Error in onBookingCreated trigger:', error);

    // Don't throw - allow the main operation to succeed
    await snapshot.ref.collection('email_logs').add({
      type: 'confirmation',
      status: 'error',
      error: error.message,
      timestamp: new Date(),
    });
  }
});
