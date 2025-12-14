-- Remove the incorrectly created gallery bucket
DELETE FROM storage.buckets WHERE id = 'gallery';

-- Recreate the gallery bucket with only the correct columns
INSERT INTO storage.buckets (id, name)
VALUES ('gallery', 'gallery');