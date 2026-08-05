import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

// X icon as inline SVG
const XIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function BookingModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Student details form (for users not logged in or with incomplete profiles)
  const [studentDetails, setStudentDetails] = useState({
    student_name: '',
    student_email: '',
    student_phone: '',
    student_age: ''
  });

  // Pre-fill student details if user is logged in or from registration
  useEffect(() => {
    // Check for registration data from sessionStorage
    const registrationData = sessionStorage.getItem('registrationData');
    if (registrationData) {
      const data = JSON.parse(registrationData);
      setStudentDetails({
        student_name: data.student_name || '',
        student_email: data.student_email || '',
        student_phone: data.student_phone || '',
        student_age: data.student_age || ''
      });
      // Clear the stored data after using it
      sessionStorage.removeItem('registrationData');
    } else if (user) {
      setStudentDetails({
        student_name: user.displayName || '',
        student_email: user.email || '',
        student_phone: '',
        student_age: ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      loadSlots();
      setSelectedSlot(null);
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const loadSlots = async () => {
    try {
      setLoading(true);
      const data = await api.getAvailableTimeSlots();
      setSlots(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const handleBookSlot = async () => {
    // Validate student details
    if (!studentDetails.student_name || studentDetails.student_name.length < 2) {
      setError('Please enter a valid name');
      return;
    }
    if (!studentDetails.student_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentDetails.student_email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!studentDetails.student_phone || !/^\d{10}$/.test(studentDetails.student_phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!studentDetails.student_age || studentDetails.student_age < 6 || studentDetails.student_age > 18) {
      setError('Age must be between 6 and 18');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        user_id: user?.uid || 'guest',
        student_name: studentDetails.student_name,
        student_email: studentDetails.student_email,
        student_phone: studentDetails.student_phone,
        student_age: parseInt(studentDetails.student_age)
      };

      await api.bookFreeTrial(selectedSlot.id, bookingData);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to book slot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedSlot(null);
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {success ? 'Booking Confirmed!' : 'Book Your Free Trial'}
                </h2>
                <p className="text-gray-500 text-sm">
                  {success ? 'See you soon!' : 'Select an available time slot'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-6">
              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
                  {error}
                </div>
              )}

              {/* Success */}
              {success ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Your free trial is booked!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedSlot && (
                      <>
                        {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.time)}
                      </>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    Check your email for confirmation details
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Loading */}
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                      <p className="text-gray-500 mt-4">Loading available slots...</p>
                    </div>
                  ) : (
                    <>
                      {!selectedSlot ? (
                        <>
                          {/* No User Info */}
                          {!user && (
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl mb-6">
                              <p className="font-medium">Book as a guest or <Link to="/register" className="underline font-semibold">create an account</Link> for easier tracking</p>
                            </div>
                          )}

                          {/* Slots List */}
                          {slots.length === 0 ? (
                            <div className="text-center py-12">
                              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">No slots available</h3>
                              <p className="text-gray-500">Check back later for new time slots</p>
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {slots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
                                  onClick={() => setSelectedSlot(slot)}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h3 className="font-semibold text-gray-900">
                                        {formatDate(slot.date)}
                                      </h3>
                                      <p className="text-gray-600">{formatTime(slot.time)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                        Available
                                      </span>
                                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Selected Slot Details */}
                          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  {formatDate(selectedSlot.date)}
                                </h3>
                                <p className="text-gray-600">{formatTime(selectedSlot.time)}</p>
                                <p className="text-sm text-gray-500 mt-1">Free Trial Class • 45 minutes</p>
                              </div>
                              <button
                                onClick={() => setSelectedSlot(null)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Student Details Form */}
                          <div className="space-y-4">
                            {!user && (
                              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl mb-4">
                                <p className="text-sm">Not logged in? Your booking will be linked to your email address.</p>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Student Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={studentDetails.student_name}
                                onChange={(e) => setStudentDetails({ ...studentDetails, student_name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter student name"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                value={studentDetails.student_email}
                                onChange={(e) => setStudentDetails({ ...studentDetails, student_email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="student@example.com"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                  Phone <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="tel"
                                  value={studentDetails.student_phone}
                                  onChange={(e) => setStudentDetails({ ...studentDetails, student_phone: e.target.value })}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="1234567890"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                  Age <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  value={studentDetails.student_age}
                                  onChange={(e) => setStudentDetails({ ...studentDetails, student_age: e.target.value })}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="10"
                                  min="6"
                                  max="18"
                                  required
                                />
                              </div>
                            </div>

                            <button
                              onClick={handleBookSlot}
                              disabled={submitting}
                              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submitting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Booking...
                                </>
                              ) : 'Confirm Booking'}
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
