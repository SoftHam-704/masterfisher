-- Drop existing bucket if it exists
DELETE FROM storage.buckets WHERE id = 'gallery';

-- Create gallery bucket with minimal configuration
INSERT INTO storage.buckets (id, name)
VALUES ('gallery', 'gallery');

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own gallery photos" ON storage.objects;

-- Policy: Anyone can view gallery photos
CREATE POLICY "Users can view all gallery photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Policy: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload their own gallery photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own photos
CREATE POLICY "Users can update their own gallery photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete their own gallery photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);