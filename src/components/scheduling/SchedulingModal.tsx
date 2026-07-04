import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedulingStore } from '../../stores/schedulingStore';
import CalendarView from './CalendarView';
import BookingModal from './BookingModal';

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SchedulingModal: React.FC<SchedulingModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { selectedDate, generateTimeSlots } = useSchedulingStore();

  useEffect(() => {
    if (isOpen) {
      generateTimeSlots(selectedDate);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, selectedDate, generateTimeSlots]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-24">
        <div
          className={`relative mx-4 ${
            isDark ? 'bg-[#0a0a0a] border-[#262626]' : 'bg-[#ffffff] border-[#e8e8e8]'
          } border shadow-2xl overflow-hidden animate-fade-in-up`}
          style={{
            width: '100%',
            maxWidth: '700px',
            maxHeight: '540px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center justify-between px-6 py-5 border-b ${
            isDark ? 'border-[#262626]' : 'border-[#e8e8e8]'
          }`}>
            <div>
              <h2 className="editorial-heading text-xl text-[var(--text-primary)]">
                Book a Strategy Call
              </h2>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Select a date and time for your free consultation
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: 'calc(540px - 69px)' }}>
            <div className="p-6">
              <CalendarView />
            </div>
          </div>
        </div>
      </div>

      <BookingModal onClose={onClose} />
    </>
  );
};

export default SchedulingModal;
