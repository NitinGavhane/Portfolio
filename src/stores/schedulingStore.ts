import { create } from 'zustand';
import { addDays, addMinutes, format, isAfter, isBefore, isToday, startOfDay } from 'date-fns';
import type { TimeSlot, Booking, AvailabilitySettings, BookingFormData } from '../types/scheduling';

interface SchedulingState {
  // Settings
  availabilitySettings: AvailabilitySettings;
  
  // Data
  bookings: Booking[];
  timeSlots: TimeSlot[];
  
  // UI State
  selectedDate: Date;
  selectedTimeSlot: TimeSlot | null;
  isBookingModalOpen: boolean;
  isLoading: boolean;
  
  // Actions
  setSelectedDate: (date: Date) => void;
  setSelectedTimeSlot: (slot: TimeSlot | null) => void;
  setBookingModalOpen: (open: boolean) => void;
  generateTimeSlots: (date: Date) => void;
  createBooking: (data: BookingFormData) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  updateAvailabilitySettings: (settings: Partial<AvailabilitySettings>) => void;
  getAvailableSlots: (date: Date) => TimeSlot[];
}

// Default availability settings
const defaultSettings: AvailabilitySettings = {
  workingDays: [1, 2, 3, 4, 5], // Monday to Friday
  workingHours: {
    start: '09:00',
    end: '17:00'
  },
  bufferTime: 15, // 15 minutes between meetings
  minNotice: 2, // 2 hours minimum notice
  maxAdvanceBooking: 30, // 30 days max advance booking
  allowedDurations: [15, 30, 60] // 15, 30, 60 minute meetings
};

export const useSchedulingStore = create<SchedulingState>((set, get) => ({
  // Initial state
  availabilitySettings: defaultSettings,
  bookings: [],
  timeSlots: [],
  selectedDate: new Date(),
  selectedTimeSlot: null,
  isBookingModalOpen: false,
  isLoading: false,

  // Actions
  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
    get().generateTimeSlots(date);
  },

  setSelectedTimeSlot: (slot: TimeSlot | null) => {
    set({ selectedTimeSlot: slot });
  },

  setBookingModalOpen: (open: boolean) => {
    set({ isBookingModalOpen: open });
    if (!open) {
      set({ selectedTimeSlot: null });
    }
  },

  generateTimeSlots: (date: Date) => {
    const { availabilitySettings, bookings } = get();
    const dayOfWeek = date.getDay();
    
    // Check if day is available
    if (!availabilitySettings.workingDays.includes(dayOfWeek)) {
      set({ timeSlots: [] });
      return;
    }

    // Check if date is within allowed booking window
    const now = new Date();
    const minBookingTime = addMinutes(now, availabilitySettings.minNotice * 60);
    const maxBookingDate = addDays(now, availabilitySettings.maxAdvanceBooking);
    
    if (isBefore(date, startOfDay(now)) || isAfter(date, maxBookingDate)) {
      set({ timeSlots: [] });
      return;
    }

    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = availabilitySettings.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = availabilitySettings.workingHours.end.split(':').map(Number);
    
    let currentTime = new Date(date);
    currentTime.setHours(startHour, startMinute, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (isBefore(currentTime, endTime)) {
      const slotStart = new Date(currentTime);
      const slotEnd = addMinutes(slotStart, 30); // 30-minute slots
      
      // Check if slot is in the future (for today)
      const isInFuture = isToday(date) ? isAfter(slotStart, minBookingTime) : true;
      
      // Check if slot conflicts with existing bookings
      const hasConflict = bookings.some(booking => {
        const bookingStart = new Date(`${format(booking.date, 'yyyy-MM-dd')}T${booking.startTime}`);
        const bookingEnd = new Date(`${format(booking.date, 'yyyy-MM-dd')}T${booking.endTime}`);
        return (
          booking.status === 'confirmed' &&
          ((isAfter(slotStart, bookingStart) && isBefore(slotStart, bookingEnd)) ||
           (isAfter(slotEnd, bookingStart) && isBefore(slotEnd, bookingEnd)) ||
           (isBefore(slotStart, bookingStart) && isAfter(slotEnd, bookingEnd)))
        );
      });

      slots.push({
        id: `${format(slotStart, 'yyyy-MM-dd-HH:mm')}`,
        date: slotStart,
        startTime: format(slotStart, 'HH:mm'),
        endTime: format(slotEnd, 'HH:mm'),
        isAvailable: isInFuture && !hasConflict,
        isBooked: hasConflict
      });

      currentTime = addMinutes(currentTime, 30);
    }

    set({ timeSlots: slots });
  },

  createBooking: async (data: BookingFormData) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        purpose: data.purpose,
        duration: data.duration,
        date: data.timeSlot.date,
        startTime: data.timeSlot.startTime,
        endTime: format(addMinutes(new Date(`2000-01-01T${data.timeSlot.startTime}`), data.duration), 'HH:mm'),
        timezone: data.timezone,
        status: 'confirmed',
        createdAt: new Date(),
        meetingLink: 'https://meet.google.com/abc-defg-hij' // Mock meeting link
      };

      set(state => ({
        bookings: [...state.bookings, booking],
        isBookingModalOpen: false,
        selectedTimeSlot: null
      }));

      // Regenerate time slots to reflect the new booking
      get().generateTimeSlots(data.timeSlot.date);
      
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelBooking: async (bookingId: string) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      }));

      // Regenerate time slots to reflect the cancellation
      const { selectedDate } = get();
      get().generateTimeSlots(selectedDate);
      
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateAvailabilitySettings: (settings: Partial<AvailabilitySettings>) => {
    set(state => ({
      availabilitySettings: { ...state.availabilitySettings, ...settings }
    }));
  },

  getAvailableSlots: (date: Date) => {
    const { timeSlots } = get();
    return timeSlots.filter(slot => 
      format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      slot.isAvailable
    );
  }
}));