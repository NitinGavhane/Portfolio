import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, ExternalLink, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedulingStore } from '../../stores/schedulingStore';

const BookingsList: React.FC = () => {
  const { isDark } = useTheme();
  const { bookings, cancelBooking, isLoading } = useSchedulingStore();

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed');
  const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled');

  if (bookings.length === 0) {
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <Calendar size={48} className="mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No bookings yet</p>
        <p className="text-sm">Your scheduled calls will appear here once you book them.</p>
      </div>
    );
  }

  const BookingCard = ({ booking, showCancelButton = true }: { booking: any; showCancelButton?: boolean }) => (
    <div className={`${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
    } border rounded-xl p-6 transition-all duration-300 hover:scale-105`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            booking.status === 'confirmed' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {booking.status === 'confirmed' ? <CheckCircle size={20} /> : <X size={20} />}
          </div>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {booking.name}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
              {booking.status}
            </p>
          </div>
        </div>
        
        {showCancelButton && booking.status === 'confirmed' && (
          <button
            onClick={() => handleCancelBooking(booking.id)}
            disabled={isLoading}
            className={`p-2 rounded-xl ${
              isDark ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
            } transition-all duration-200 disabled:opacity-50`}
            title="Cancel booking"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Calendar size={16} className="text-primary-500" />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {format(booking.date, 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Clock size={16} className="text-primary-500" />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {booking.startTime} - {booking.endTime} ({booking.duration} min)
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Mail size={16} className="text-primary-500" />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {booking.email}
          </span>
        </div>
        
        {booking.phone && (
          <div className="flex items-center space-x-3">
            <Phone size={16} className="text-primary-500" />
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {booking.phone}
            </span>
          </div>
        )}
        
        <div className="flex items-start space-x-3">
          <MessageSquare size={16} className="text-primary-500 mt-0.5" />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {booking.purpose}
          </span>
        </div>
      </div>

      {/* Meeting Link */}
      {booking.status === 'confirmed' && booking.meetingLink && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <a
            href={booking.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:shadow-glow transition-all duration-300 hover:scale-105"
          >
            <ExternalLink size={16} />
            <span>Join Meeting</span>
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Confirmed Bookings */}
      {confirmedBookings.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Upcoming Calls ({confirmedBookings.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {confirmedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Bookings */}
      {cancelledBookings.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Cancelled Calls ({cancelledBookings.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cancelledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showCancelButton={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsList;