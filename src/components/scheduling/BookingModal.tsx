import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useSchedulingStore } from '../../stores/schedulingStore';
import type { BookingFormData } from '../../types/scheduling';

interface BookingModalProps {
  onClose?: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ onClose }) => {
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
      onClose?.();
    } catch {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const handleClose = () => {
    setBookingModalOpen(false);
    reset();
    onClose?.();
  };

  if (!isBookingModalOpen || !selectedTimeSlot) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm">
      {/* Small booking form modal positioned below header */}
      <div 
        className="relative w-full mx-4 mt-24 border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-2xl overflow-hidden animate-fade-in-up"
        style={{ 
          maxWidth: '420px',
          maxHeight: '520px'
        }}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)]">
          <div>
            <h3 className="editorial-heading text-lg text-[var(--text-primary)]">
              Book Your Call
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-tertiary)]">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>{format(selectedTimeSlot.date, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{selectedTimeSlot.startTime}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(520px - 80px)' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            {/* Duration Selection */}
            <div>
              <label className="editorial-label block mb-2">Meeting Duration *</label>
              <input type="hidden" {...register('duration', { required: 'Please select a duration' })} />
              <div className="grid grid-cols-1 gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleDurationSelect(option.value as 15 | 30 | 60)}
                    className={`flex items-center justify-between px-4 py-3 border text-left transition-all duration-200 ${
                      duration === option.value
                        ? 'border-[var(--text-primary)] bg-[var(--bg-primary)]'
                        : 'border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">{option.label}</div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{option.description}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      duration === option.value
                        ? 'border-[var(--text-primary)]'
                        : 'border-[var(--border-secondary)]'
                    }`}>
                      {duration === option.value && (
                        <div className="w-2 h-2 rounded-full bg-[var(--text-primary)]"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.duration && (
                <p className="text-xs text-red-500 mt-1">{errors.duration.message}</p>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
              <div>
                <label className="editorial-label block mb-1">Full Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-minimal"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="editorial-label block mb-1">Email Address *</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                  })}
                  className="input-minimal"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="editorial-label block mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-minimal"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="editorial-label block mb-1">What would you like to discuss? *</label>
                <textarea
                  {...register('purpose', { required: 'Please describe the purpose of the call' })}
                  rows={3}
                  className="input-minimal resize-none"
                  placeholder="Brief description of what you'd like to discuss..."
                />
                {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose.message}</p>}
              </div>
            </div>

            {/* Timezone Info */}
            <div className="flex items-center gap-2 px-3 py-2 border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
              <span className="text-xs text-[var(--text-tertiary)]">
                Your timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={handleClose} className="btn-outline flex-1 text-xs py-2.5">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="btn-primary flex-1 text-xs py-2.5">
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