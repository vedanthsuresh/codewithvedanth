import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingModal from '../components/BookingModal';

export default function BookTrial() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsModalOpen(false);
    // Navigate back after modal closes
    setTimeout(() => navigate('/'), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 flex items-center justify-center p-4">
      {/* Background illustration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Content (only visible when modal is closed) */}
      {!isModalOpen && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Booking Complete!</h1>
          <p className="text-gray-300 mb-6">Thank you for booking your free trial class.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={handleClose} />
    </div>
  );
}
