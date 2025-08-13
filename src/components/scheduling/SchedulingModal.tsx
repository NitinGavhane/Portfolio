import React, { useEffect } from 'react';
import { Calendar, Clock, Users, Settings, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedulingStore } from '../../stores/schedulingStore';
import CalendarView from './CalendarView';
import BookingModal from './BookingModal';
import BookingsList from './BookingsList';
import AvailabilitySettings from './AvailabilitySettings';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
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
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal positioned below header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-24">
        <div 
          className={`relative mx-4 ${
            isDark ? 'bg-dark-900 border-white/10' : 'bg-white border-gray-200'
          } border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform animate-fade-in-up`}
          style={{ 
            width: '100%',
            maxWidth: '700px',
            maxHeight: '500px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}>
            <div>
              <h2 className={`text-xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Schedule a Call
              </h2>
              <p className={`${
                isDark ? 'text-gray-400' : 'text-gray-600'
              } text-sm mt-1`}>
                Book a consultation session with me
              </p>
            </div>
            
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${
                isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } transition-all duration-200`}
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? `${isDark ? 'text-primary-400 border-primary-400' : 'text-primary-600 border-primary-600'} border-b-2`
                    : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} border-b-2 border-transparent hover:border-gray-300`
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(500px - 140px)' }}>
            <div className="p-6">
              {activeTab === 'calendar' && <CalendarView />}
              {activeTab === 'bookings' && <BookingsList />}
              {activeTab === 'settings' && <AvailabilitySettings />}
            </div>
          </div>
        </div>
      </div>

      <BookingModal />
    </>
  );
};

export default SchedulingModal;