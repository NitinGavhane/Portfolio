import React, { useEffect } from 'react';
import { Calendar, Clock, Users, Settings, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedulingStore } from '../../stores/schedulingStore';
import CalendarView from './CalendarView';
import BookingModal from './BookingModal';
import BookingsList from './BookingsList';
import AvailabilitySettings from './AvailabilitySettings';

interface SchedulingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulingSystem: React.FC<SchedulingSystemProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { selectedDate, generateTimeSlots } = useSchedulingStore();
  const [activeTab, setActiveTab] = React.useState<'calendar' | 'bookings' | 'settings'>('calendar');

  useEffect(() => {
    if (isOpen) {
      generateTimeSlots(selectedDate);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedDate, generateTimeSlots]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'calendar' as const, label: 'Schedule Call', icon: Calendar },
    { id: 'bookings' as const, label: 'My Bookings', icon: Users },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm">
      {/* Modal positioned below header with proper spacing */}
      <div 
        className={`relative w-full max-w-sm mx-4 mt-24 ${
          isDark ? 'bg-dark-900 border-white/10' : 'bg-white border-gray-200'
        } border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300`}
        style={{ 
          maxWidth: '400px',
          maxHeight: '500px'
        }}
      >
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Schedule a Call
            </h2>
            <p className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } text-xs mt-1`}>
              Book a consultation session
            </p>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${
              isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            } transition-all duration-200`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 text-xs font-medium transition-all duration-200 ${
                activeTab === id
                  ? `${isDark ? 'text-primary-400 border-primary-400' : 'text-primary-600 border-primary-600'} border-b-2`
                  : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} border-b-2 border-transparent hover:border-gray-300`
              }`}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(500px - 120px)' }}>
          <div className="p-4">
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'bookings' && <BookingsList />}
            {activeTab === 'settings' && <AvailabilitySettings />}
          </div>
        </div>
      </div>

      <BookingModal />
    </div>
  );
};

export default SchedulingSystem;