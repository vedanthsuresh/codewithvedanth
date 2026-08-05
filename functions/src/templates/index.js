// Template registry for email templates

const { renderWelcomeEmail } = require('./welcome');
const { renderBookingConfirmation } = require('./bookingConfirmation');
const { renderReminderEmail } = require('./reminder');
const { renderFollowUpEmail } = require('./followUp');
const { renderCancellationEmail } = require('./cancellation');
const { renderInstructorCancellationEmail } = require('./instructorCancellation');

module.exports = {
  renderWelcomeEmail,
  renderBookingConfirmation,
  renderReminderEmail,
  renderFollowUpEmail,
  renderCancellationEmail,
  renderInstructorCancellationEmail,
};
