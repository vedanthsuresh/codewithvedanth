// Environment variables and configuration for email service

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const INSTRUCTOR_EMAIL = process.env.INSTRUCTOR_EMAIL || 'vedanth.suresh039@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';
const FROM_NAME = process.env.FROM_NAME || 'Code with Vedanth';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const STATIC_MEETING_LINK = process.env.STATIC_MEETING_LINK || 'https://meet.google.com/';

// Validate required environment variables
if (!RESEND_API_KEY) {
  console.warn('WARNING: RESEND_API_KEY is not set in environment variables');
}

module.exports = {
  RESEND_API_KEY,
  INSTRUCTOR_EMAIL,
  FROM_EMAIL,
  FROM_NAME,
  APP_URL,
  STATIC_MEETING_LINK,
};
