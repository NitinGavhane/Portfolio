import React from 'react';
import { Clock, Calendar, Settings as SettingsIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedulingStore } from '../../stores/schedulingStore';

const AvailabilitySettings: React.FC = () => {
  const { isDark } = useTheme();
  const { availabilitySettings, updateAvailabilitySettings } = useSchedulingStore();
  
  const [settings, setSettings] = React.useState(availabilitySettings);

  const weekDays = [
    { id: 0, label: 'Sun', fullName: 'Sunday' },
    { id: 1, label: 'Mon', fullName: 'Monday' },
    { id: 2, label: 'Tue', fullName: 'Tuesday' },
    { id: 3, label: 'Wed', fullName: 'Wednesday' },
    { id: 4, label: 'Thu', fullName: 'Thursday' },
    { id: 5, label: 'Fri', fullName: 'Friday' },
    { id: 6, label: 'Sat', fullName: 'Saturday' },
  ];

  const handleWorkingDayToggle = (dayId: number) => {
    const newWorkingDays = settings.workingDays.includes(dayId)
      ? settings.workingDays.filter(id => id !== dayId)
      : [...settings.workingDays, dayId];
    
    setSettings(prev => ({
      ...prev,
      workingDays: newWorkingDays
    }));
  };

  const handleSave = () => {
    updateAvailabilitySettings(settings);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className={`text-lg font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Availability Settings
          </h3>
          <p className={`text-sm mt-1 break-words ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Configure when you're available for calls
          </p>
        </div>
        
        <button
          onClick={handleSave}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-lg hover:shadow-glow transition-all duration-300 hover:scale-105 whitespace-nowrap min-w-0 flex-shrink-0"
        >
          <Save size={16} className="flex-shrink-0" />
          <span className="truncate">Save</span>
        </button>
      </div>

      {/* Working Days Section */}
      <div className={`${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      } border rounded-xl p-4 sm:p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <Calendar size={20} className="text-primary-500 flex-shrink-0" />
          <h4 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Working Days
          </h4>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {weekDays.map((day) => (
            <label key={day.id} className="relative group">
              <input
                type="checkbox"
                checked={settings.workingDays.includes(day.id)}
                onChange={() => handleWorkingDayToggle(day.id)}
                className="sr-only"
              />
              <div className={`
                relative overflow-hidden p-2 sm:p-3 rounded-xl border text-center cursor-pointer 
                transition-all duration-200 min-h-[3rem] flex items-center justify-center
                ${settings.workingDays.includes(day.id)
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-transparent shadow-glow'
                  : `${isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`
                }
              `}>
                <div className="w-full min-w-0">
                  <div className="font-medium text-sm truncate" title={day.fullName}>
                    {day.label}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Working Hours Section */}
      <div className={`${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      } border rounded-xl p-4 sm:p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <Clock size={20} className="text-primary-500 flex-shrink-0" />
          <h4 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Working Hours
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="min-w-0">
            <label className={`block text-sm font-medium mb-2 truncate ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Start Time
            </label>
            <input
              type="time"
              value={settings.workingHours.start}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                workingHours: { ...prev.workingHours, start: e.target.value }
              }))}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
            />
          </div>
          
          <div className="min-w-0">
            <label className={`block text-sm font-medium mb-2 truncate ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              End Time
            </label>
            <input
              type="time"
              value={settings.workingHours.end}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                workingHours: { ...prev.workingHours, end: e.target.value }
              }))}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
            />
          </div>
        </div>
      </div>

      {/* Booking Settings Section */}
      <div className={`${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      } border rounded-xl p-4 sm:p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <SettingsIcon size={20} className="text-primary-500 flex-shrink-0" />
          <h4 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Booking Settings
          </h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="min-w-0">
            <label className={`block text-sm font-medium mb-2 break-words ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Buffer Time (min)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={settings.bufferTime}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                bufferTime: parseInt(e.target.value) || 0
              }))}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
            />
          </div>
          
          <div className="min-w-0">
            <label className={`block text-sm font-medium mb-2 break-words ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Min Notice (hours)
            </label>
            <input
              type="number"
              min="0"
              max="168"
              value={settings.minNotice}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                minNotice: parseInt(e.target.value) || 0
              }))}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
            />
          </div>
          
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <label className={`block text-sm font-medium mb-2 break-words ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Max Advance Booking (days)
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={settings.maxAdvanceBooking}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maxAdvanceBooking: parseInt(e.target.value) || 1
              }))}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              } border rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300`}
            />
          </div>
        </div>
      </div>

      {/* Meeting Durations Section */}
      <div className={`${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg'
      } border rounded-xl p-4 sm:p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <Clock size={20} className="text-primary-500 flex-shrink-0" />
          <h4 className={`font-semibold break-words ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Allowed Meeting Durations
          </h4>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {[15, 30, 45, 60, 90, 120].map((duration) => (
            <label key={duration} className="relative group">
              <input
                type="checkbox"
                checked={settings.allowedDurations.includes(duration)}
                onChange={(e) => {
                  const newDurations = e.target.checked
                    ? [...settings.allowedDurations, duration]
                    : settings.allowedDurations.filter(d => d !== duration);
                  setSettings(prev => ({
                    ...prev,
                    allowedDurations: newDurations
                  }));
                }}
                className="sr-only"
              />
              <div className={`
                relative overflow-hidden p-2 sm:p-3 rounded-xl border text-center cursor-pointer 
                transition-all duration-200 min-h-[3rem] flex items-center justify-center
                ${settings.allowedDurations.includes(duration)
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-transparent shadow-glow'
                  : `${isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`
                }
              `}>
                <div className="w-full min-w-0">
                  <div className="font-medium text-sm truncate" title={`${duration} minutes`}>
                    {duration}m
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySettings;