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
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Account</h1>
        <p className="text-gray-500 mt-1">Manage your profile and bookings</p>
      </div>

      {/* User Info Card */}
      <div className="card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.displayName || 'Student'}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* My Bookings */}
      <div className="card">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Bookings</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Free Trial Class
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(booking.date)} at {formatTime(booking.time)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Status: <span className="font-medium text-green-600">Confirmed</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't booked any classes yet.</p>
              <button
                onClick={() => window.location.href = '/#book-trial'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
              >
                Book Your Free Trial
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
