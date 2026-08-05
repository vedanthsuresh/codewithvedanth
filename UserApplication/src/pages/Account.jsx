import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

export default function Account() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserBookings();
    }
  }, [user]);

  const loadUserBookings = async () => {
    try {
      // For now, we'll load all bookings since we don't have a user-specific endpoint yet
      // In production, you'd filter by user_id
      const data = await api.getAvailableTimeSlots();
      setBookings([]); // Reset until we have user-specific endpoint
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
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
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      Free Trial Class
                    </h3>
                    <p className="text-gray-400">
                      {formatDate(booking.date)} at {formatTime(booking.time)}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Status: <span className="font-medium text-green-400">Confirmed</span>
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium rounded-full">
                    Upcoming
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}
