import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useSchedulingStore } from '../../stores/schedulingStore';
import type { TimeSlot } from '../../types/scheduling';

const CalendarView: React.FC = () => {
  const {
    selectedDate,
    timeSlots,
    setSelectedDate,
    setSelectedTimeSlot,
    setBookingModalOpen
  } = useSchedulingStore();

  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const availableSlots = timeSlots.filter(slot => slot.isAvailable);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setBookingModalOpen(true);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(addDays(currentWeek, direction === 'next' ? 7 : -7));
  };

  return (
    <div className="space-y-5">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="w-7 h-7 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {format(currentWeek, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="w-7 h-7 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
          <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
          <span>Available</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="text-center">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">
              {format(day, 'EEE')}
            </div>
            <button
              onClick={() => handleDateSelect(day)}
              disabled={isBefore(day, startOfDay(new Date()))}
              className={`w-full pt-2 pb-1 text-center transition-colors duration-200 ${
                isSameDay(day, selectedDate)
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : isToday(day)
                  ? 'border border-[var(--border-primary)] text-[var(--text-primary)]'
                  : isBefore(day, startOfDay(new Date()))
                  ? 'text-[var(--text-muted)] cursor-not-allowed'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
              }`}
            >
              <div className="text-sm font-medium">{format(day, 'd')}</div>
              {isSameDay(day, selectedDate) && (
                <div className="text-[10px] mt-0.5 opacity-60">{availableSlots.length}</div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {isSameDay(selectedDate, new Date()) || !isBefore(selectedDate, startOfDay(new Date())) ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[var(--text-tertiary)]" />
            <h4 className="text-sm font-medium text-[var(--text-primary)]">
              {format(selectedDate, 'MMM d')} — Available Times
            </h4>
          </div>

          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.slice(0, 9).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className="py-2 text-xs font-medium border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-secondary)] transition-colors duration-200"
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-tertiary)]">
              <CalendarIcon size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium mb-1">No available slots</p>
              <p className="text-xs">Try a different date</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-[var(--text-tertiary)]">
          <CalendarIcon size={28} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs font-medium mb-1">Select a future date</p>
          <p className="text-xs">Choose from today onwards</p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
