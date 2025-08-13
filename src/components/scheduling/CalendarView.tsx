import React from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedulingStore } from '../../stores/schedulingStore';

const CalendarView: React.FC = () => {
  const { isDark } = useTheme();
  const {
    selectedDate,
    timeSlots,
    setSelectedDate,
    setSelectedTimeSlot,
    setBookingModalOpen
  } = useSchedulingStore();

  const [currentWeek, setCurrentWeek] = React.useState(startOfWeek(new Date()));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const availableSlots = timeSlots.filter(slot => slot.isAvailable);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSlotSelect = (slot: any) => {
    setSelectedTimeSlot(slot);
    setBookingModalOpen(true);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = addDays(currentWeek, direction === 'next' ? 7 : -7);
    setCurrentWeek(newWeek);
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className={`p-1 rounded-lg ${
              isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            } transition-all duration-200`}
          >
            <ChevronLeft size={16} />
          </button>
          
          <h3 className={`text-sm font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {format(currentWeek, 'MMM yyyy')}
          </h3>
          
          <button
            onClick={() => navigateWeek('next')}
            className={`p-1 rounded-lg ${
              isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            } transition-all duration-200`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Available</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="text-center">
            <div className={`text-xs font-medium ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            } mb-1`}>
              {format(day, 'EEE')}
            </div>
            <button
              onClick={() => handleDateSelect(day)}
              disabled={isBefore(day, startOfDay(new Date()))}
              className={`w-full p-2 rounded-lg text-center transition-all duration-200 ${
                isSameDay(day, selectedDate)
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow'
                  : isToday(day)
                  ? `${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} border`
                  : isBefore(day, startOfDay(new Date()))
                  ? `${isDark ? 'bg-white/5 text-gray-600' : 'bg-gray-50 text-gray-400'} cursor-not-allowed`
                  : `${isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'} border hover:border-primary-500/30`
              }`}
            >
              <div className="text-sm font-semibold">{format(day, 'd')}</div>
              {isSameDay(day, selectedDate) && (
                <div className="text-xs mt-0.5 opacity-80">
                  {availableSlots.length}
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Time Slots */}
      {isSameDay(selectedDate, new Date()) || !isBefore(selectedDate, startOfDay(new Date())) ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-primary-500" />
            <h4 className={`text-sm font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {format(selectedDate, 'MMM d')} - Available Times
            </h4>
          </div>

          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.slice(0, 9).map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={`p-2 rounded-lg text-center text-xs font-medium transition-all duration-200 ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-primary-500/20 hover:border-primary-500/30 hover:text-primary-300'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700'
                  } border hover:scale-105`}
                >
                  {slot.startTime}
                </button>
              ))}
            </div>
          ) : (
            <div className={`text-center py-6 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <CalendarIcon size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium mb-1">No available slots</p>
              <p className="text-xs">Try a different date</p>
            </div>
          )}
        </div>
      ) : (
        <div className={`text-center py-6 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <CalendarIcon size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs font-medium mb-1">Select a future date</p>
          <p className="text-xs">Choose from today onwards</p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;