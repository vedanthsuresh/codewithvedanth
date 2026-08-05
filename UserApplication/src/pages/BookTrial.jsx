import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService as api } from '../services/firestore';

export default function BookTrial() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Student details form
  const [studentDetails, setStudentDetails] = useState({
    student_name: '',
    student_email: '',
    student_phone: '',
    student_age: ''
  });

  // Pre-fill student details if user is logged in or from registration
  useEffect(() => {
    const registrationData = sessionStorage.getItem('registrationData');
    if (registrationData) {
      const data = JSON.parse(registrationData);
      setStudentDetails({
        student_name: data.student_name || '',
        student_email: data.student_email || '',
        student_phone: data.student_phone || '',
        student_age: data.student_age || ''
      });
      sessionStorage.removeItem('registrationData');
    } else if (user) {
      setStudentDetails({
        student_name: user.displayName || '',
        student_email: user.email || '',
        student_phone: user.phoneNumber || '',
        student_age: ''
      });
    }
  }, [user]);

  useEffect(() => {
    loadSlots();
  }, []);

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
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
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

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});

  // Get sorted unique dates
  const availableDates = Object.keys(slotsByDate).sort();

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    // Scroll to form
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBookSlot = async (e) => {
    e.preventDefault();
    setError(null);

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
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to book slot');
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background illustration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Book Your Free Trial Class
          </h1>
          <p className="text-gray-400 text-lg">
            Select an available time slot and start your coding journey today!
          </p>
        </div>

        {/* Error */}
        {error && !success && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mb-8 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success ? (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Booking Confirmed! 🎉
            </h2>
            <p className="text-gray-400 text-lg mb-2">
              Your free trial class is scheduled for:
            </p>
            <p className="text-2xl font-semibold text-purple-400 mb-6">
              {formatDate(selectedSlot.date)} at {formatTime(selectedSlot.time)}
            </p>
            <p className="text-gray-500 mb-8">
              Check your email for confirmation details
            </p>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar / Date Selection */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Select a Date</h2>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Loading available slots...</p>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-white mb-2">No slots available</h3>
                    <p className="text-gray-500">Check back later for new time slots</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => handleDateSelect(date)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedDate === date
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">{formatDate(date)}</p>
                            <p className="text-sm text-gray-400">
                              {slotsByDate[date].length} slot{slotsByDate[date].length !== 1 ? 's' : ''} available
                            </p>
                          </div>
                          <svg className={`w-5 h-5 transition-transform duration-200 ${
                            selectedDate === date ? 'rotate-180 text-purple-400' : 'text-gray-500'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Time Slots for Selected Date */}
                {selectedDate && slotsByDate[selectedDate] && (
                  <div className="mt-6 pt-6 border-t border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Available Times</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {slotsByDate[selectedDate].map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-5 rounded-xl border-2 transition-all duration-200 text-center ${
                            selectedSlot?.id === slot.id
                              ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50'
                              : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                          }`}
                        >
                          <p className="text-2xl font-bold text-white mb-1">
                            {formatTime(slot.time)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {slot.capacity} spot{slot.capacity !== 1 ? 's' : ''} available
                          </p>
                          {selectedSlot?.id === slot.id && (
                            <div className="mt-3 flex items-center justify-center gap-2 text-purple-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm font-medium">Selected</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-1">
              <div id="booking-form" className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {selectedSlot ? 'Complete Your Booking' : 'Your Details'}
                </h2>

                {!selectedSlot ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400">Select a date and time slot to continue</p>
                  </div>
                ) : (
                  <form onSubmit={handleBookSlot} className="space-y-4">
                    {/* Selected Slot Summary */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
                      <p className="text-sm text-gray-400 mb-1">Selected Time Slot</p>
                      <p className="font-semibold text-white">{formatDate(selectedSlot.date)}</p>
                      <p className="text-lg text-purple-400">{formatTime(selectedSlot.time)}</p>
                    </div>

                    {!user && (
                      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-3 rounded-xl">
                        <p className="text-sm">Not logged in? Your booking will be linked to your email address.</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Student Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={studentDetails.student_name}
                        onChange={(e) => setStudentDetails({ ...studentDetails, student_name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                        placeholder="Enter student name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        value={studentDetails.student_email}
                        onChange={(e) => setStudentDetails({ ...studentDetails, student_email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                        placeholder="student@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        value={studentDetails.student_phone}
                        onChange={(e) => setStudentDetails({ ...studentDetails, student_phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                        placeholder="1234567890"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Age <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={studentDetails.student_age}
                        onChange={(e) => setStudentDetails({ ...studentDetails, student_age: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                        placeholder="10"
                        min="6"
                        max="18"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
