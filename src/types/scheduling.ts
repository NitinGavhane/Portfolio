export interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  purpose: string;
  duration: 15 | 30 | 60;
  timeSlot: TimeSlot;
  timezone: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  purpose: string;
  duration: number;
  date: Date;
  startTime: string;
  endTime: string;
  timezone: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  createdAt: Date;
  meetingLink?: string;
}

export interface AvailabilitySettings {
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  workingHours: {
    start: string;
    end: string;
  };
  bufferTime: number; // minutes
  minNotice: number; // hours
  maxAdvanceBooking: number; // days
  allowedDurations: number[]; // minutes
}

export interface CalendarIntegration {
  provider: 'google' | 'outlook' | 'apple';
  isConnected: boolean;
  calendarId?: string;
  accessToken?: string;
}