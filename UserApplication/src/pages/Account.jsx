import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService as api } from '../services/firestore';

export default function Account() {
  const { user, logout, deleteAccount } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [studentStatus, setStudentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load bookings and student status in parallel
      const [bookingsData, statusData] = await Promise.all([
        api.getUserBookings(user.uid, user.email),
        api.getStudentStatus(user.uid)
      ]);
      setBookings(bookingsData);
      setStudentStatus(statusData);
    } catch (err) {
      console.error('Failed to load user data:', err);
      setBookings([]);
      setStudentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setDeleting(true);

    try {
      await deleteAccount();
      // Success - redirect to home (Firebase will auto-logout)
      window.location.href = '/login';
    } catch (err) {
      // If re-authentication is required, automatically log out and redirect to login
      if (err.message?.includes('log out') || err.message?.includes('log back in')) {
        await logout();
      } else {
        // Other errors - show in modal
        setDeleteError(err.message || 'Failed to delete account. Please try again.');
        setDeleting(false);
      }
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteError(null);
  };

  const handleCancelBooking = async (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    setCancelling(true);
    try {
      await api.cancelBooking(bookingToCancel.id);
      // Reload bookings to reflect the change
      await loadUserData();
      closeCancelModal();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateStr) => {
    // Parse the date string as local time (not UTC) to avoid timezone offset issues
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Account</h1>
        <p className="text-gray-400 mt-1">Manage your profile and bookings</p>
      </div>

      {/* User Info Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.displayName || 'Student'}
              </h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 text-gray-300 hover:text-white font-medium rounded-xl hover:bg-slate-800 transition-all duration-200 border border-slate-700 hover:border-slate-600"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Student Status Card */}
      {studentStatus && (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Your Status</h2>

          {studentStatus.isPaidStudent ? (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-400 mb-1">Paid Student</h3>
                  <p className="text-gray-400 text-sm">
                    You're enrolled as a paid student. Continue learning and building amazing projects!
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold rounded-full">
                  Active
                </span>
              </div>
            </div>
          ) : studentStatus.hasTakenTrial ? (
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-400 mb-1">Trial Completed</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    You've completed your free trial class! Ready to continue your coding journey?
                  </p>
                  <a
                    href="mailto:vedanth.suresh039@gmail.com?subject=I want to continue as a paid student"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact to Continue
                  </a>
                </div>
              </div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-1">Trial Scheduled</h3>
                  <p className="text-gray-400 text-sm">
                    Your free trial class is scheduled! After completing it, you can continue with paid lessons.
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-semibold rounded-full">
                  Pending
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-purple-400 mb-1">Start Your Journey</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Book your free trial class today and discover the world of coding!
                  </p>
                  <button
                    onClick={() => window.location.href = '/book-trial'}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    Book Free Trial
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* My Bookings */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-6">My Bookings</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const slot = booking.time_slot;
              const status = booking.status || 'confirmed';

              const getStatusColor = (s) => {
                switch (s) {
                  case 'confirmed':
                    return 'bg-green-500/10 border-green-500/20 text-green-400';
                  case 'cancelled':
                    return 'bg-red-500/10 border-red-500/20 text-red-400';
                  case 'completed':
                    return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
                  default:
                    return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
                }
              };

              const getStatusLabel = (s) => {
                switch (s) {
                  case 'confirmed':
                    return 'Upcoming';
                  case 'cancelled':
                    return 'Cancelled';
                  case 'completed':
                    return 'Completed';
                  default:
                    return s;
                }
              };

              return (
                <div key={booking.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        Free Trial Class
                      </h3>
                      {slot ? (
                        <>
                          <p className="text-gray-400">
                            {formatDate(slot.date)} at {formatTime(slot.time)}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Status: <span className={`font-medium capitalize ${status === 'confirmed' ? 'text-green-400' : status === 'completed' ? 'text-blue-400' : 'text-red-400'}`}>
                              {getStatusLabel(status)}
                            </span>
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm">Time slot no longer available</p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        Booked on {new Date(booking.booked_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className={`px-3 py-1 border text-sm font-medium rounded-full ${getStatusColor(status)}`}>
                        {getStatusLabel(status)}
                      </div>
                      {status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking)}
                          className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-all duration-200"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-6">Book your free trial class to get started!</p>
            <button
              onClick={() => window.location.href = '/book-trial'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Book Your Free Trial
            </button>
          </div>
        )}
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl p-8 mt-8">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-gray-400 mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium rounded-xl transition-all duration-200"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDeleteModal}></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            {deleteError ? (
              <>
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">Couldn't Delete Account</h3>
                <p className="text-gray-400 text-center mb-6">
                  {deleteError}
                </p>
                <button
                  onClick={closeDeleteModal}
                  className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all duration-200"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">Delete Account?</h3>
                <p className="text-gray-400 text-center mb-6">
                  This will permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={closeDeleteModal}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      {showCancelModal && bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCancelModal}></div>
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-3">Cancel Booking?</h3>
            <p className="text-gray-400 text-center mb-4">
              Are you sure you want to cancel your booking?
            </p>
            {bookingToCancel.time_slot && (
              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-white font-medium text-center">
                  {formatDate(bookingToCancel.time_slot.date)} at {formatTime(bookingToCancel.time_slot.time)}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 text-center mb-6">
              You can always book another trial class later.
            </p>
            <div className="flex gap-4">
              <button
                onClick={closeCancelModal}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
