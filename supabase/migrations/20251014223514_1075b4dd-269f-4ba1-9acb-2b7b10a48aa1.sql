-- Modify bookings table to support date ranges
ALTER TABLE public.bookings 
  DROP COLUMN booking_date,
  ADD COLUMN start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN end_date DATE NOT NULL DEFAULT CURRENT_DATE;

-- Add constraint to ensure end_date is not before start_date
ALTER TABLE public.bookings
  ADD CONSTRAINT check_date_range CHECK (end_date >= start_date);