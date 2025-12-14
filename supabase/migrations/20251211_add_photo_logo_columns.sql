-- Add logo_url and photo_url columns to partner_payments table
ALTER TABLE partner_payments ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE partner_payments ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add logo_url column to suppliers table if not exists
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS logo_url TEXT;
