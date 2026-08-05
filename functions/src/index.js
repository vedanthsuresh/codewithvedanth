const { logger } = require('firebase-functions/v2');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Log when functions are loaded
logger.info('Cloud Functions loaded successfully');
logger.info('Firebase Admin SDK initialized');

// Import and export trigger modules
// These are imported after admin is initialized to ensure proper setup
const { onUserCreated } = require('./triggers/onUserCreated');
const { onBookingCreated } = require('./triggers/onBookingCreated');
const { onBookingUpdated } = require('./triggers/onBookingUpdated');
const { sendReminders } = require('./scheduled/sendReminders');

// Export all Cloud Functions
exports.onUserCreated = onUserCreated;
exports.onBookingCreated = onBookingCreated;
exports.onBookingUpdated = onBookingUpdated;
exports.sendReminders = sendReminders;
