import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Clock, Calendar, User, Mail, Phone, MessageSquare, Globe } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedulingStore } from '../../stores/schedulingStore';
import type { BookingFormData } from '../../types/scheduling';

const BookingModal: React.FC = () => {
  const { isDark } = useTheme();
  const {
    selectedTimeSlot,
    isBookingModalOpen,
    isLoading,
    setBookingModalOpen,
    createBooking
  } = useSchedulingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<Omit<BookingFormData, 'timeSlot' | 'timezone'>>({
    defaultValues: {
      duration: 30 // Set default duration
    }
  });

  const duration = watch('duration', 30);

  // Duration options with descriptions
  const durationOptions = [
    { value: 15, label: '15 min', description: 'Quick consultation' },
    { value: 30, label: '30 min', description: 'Standard meeting' },
    { value: 60, label: '60 min', description: 'Extended discussion' }
  ];

  const handleDurationSelect = (selectedDuration: 15 | 30 | 60) => {
    setValue('duration', selectedDuration, { shouldValidate: true });
  };

  const onSubmit = async (data: Omit<BookingFormData, 'timeSlot' | 'timezone'>) => {
    if (!selectedTimeSlot) return;

    try {
      await createBooking({
        ...data,
        timeSlot: selectedTimeSlot,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      
      toast.success('Booking confirmed! Check your email for details.');
      reset();
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handleClose = () => {
    setBookingModalOpen(false);
    reset();
  };

  if (!isBookingModalOpen || !selectedTimeSlot) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm">
      {/* Small booking form modal positioned below header */}
      <div 
        className={`relative w-full mx-4 mt-24 ${
          isDark ? 'bg-dark-900 border-white/10' : 'bg-white border-gray-200'
        } border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300`}
        style={{ 
          maxWidth: '420px',
          maxHeight: '520px'
        }}
      >
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div>
            <h3 className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Book Your Call
            </h3>
            <div className="flex items-center space-x-3 mt-1 text-xs">
              <div className="flex items-center space-x-1">
                <Calendar size={12} className="text-primary-500" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {format(selectedTimeSlot.date, 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={12} className="text-primary-500" />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {selectedTimeSlot.startTime}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className={`p-2 rounded-xl ${
              isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            } transition-all duration-200`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(520px - 80px)' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            {/* Duration Selection - Enhanced */}
            <div>
              <label className={`block text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              } mb-3`}>
                Meeting Duration *
              </label>
              
              {/* Hidden input for form validation */}
              <input
                type="hidden"
                {...register('duration', { required: 'Please select a duration' })}
              />
              
              <div className="grid grid-cols-1 gap-3">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleDurationSelect(option.value as 15 | 30 | 60)}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-300 group ${
                      duration === option.value
                        ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white border-transparent shadow-glow scale-105'
                        : `${isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'} hover:scale-102`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-semibold text-base ${
                          duration === option.value ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className={`text-sm mt-1 ${
                          duration === option.value 
                            ? 'text-white/80' 
                            : isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {option.description}
                        </div>
                      </div>
                      
                      {/* Selection indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        duration === option.value
                          ? 'border-white bg-white'
                          : `${isDark ? 'border-gray-400' : 'border-gray-300'} group-hover:border-primary-500`
                      }`}>
                        {duration === option.value && (
                          <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        )}
                      </div>
                    </div>
                    
                    {/* Hover effect overlay */}
                    {duration !== option.value && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </button>
                ))}
              </div>
              
              {errors.duration && (
                <p className="text-red-500 text-xs mt-2">{errors.duration.message}</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
              <div>
                <label className={`block text-xs font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Full Name *
                </label>
                <div className="relative">
                  <User size={14} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full pl-8 pr-3 py-2 text-sm ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    } border rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300`}
                   
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-xs font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={14} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className={`w-full pl-8 pr-3 py-2 text-sm ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    } border rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300`}
                   
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className={`block text-xs font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone size={14} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full pl-8 pr-3 py-2 text-sm ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    } border rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                } mb-1`}>
                  What would you like to discuss? *
                </label>
                <div className="relative">
                  <MessageSquare size={14} className={`absolute left-3 top-3 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <textarea
                    {...register('purpose', { required: 'Please describe the purpose of the call' })}
                    rows={3}
                    className={`w-full pl-8 pr-3 py-2 text-sm ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                    } border rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 transition-all duration-300 resize-none`}
                    placeholder="Brief description of what you'd like to discuss..."
                  />
                </div>
                {errors.purpose && (
                  <p className="text-red-500 text-xs mt-1">{errors.purpose.message}</p>
                )}
              </div>
            </div>

            {/* Timezone Info */}
            <div className={`flex items-center space-x-2 p-2 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
            } border rounded-lg`}>
              <Globe size={12} className="text-primary-500" />
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Your timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className={`flex-1 px-4 py-2 text-sm ${
                  isDark ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                } border font-medium rounded-lg transition-all duration-200`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 text-sm bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:shadow-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;