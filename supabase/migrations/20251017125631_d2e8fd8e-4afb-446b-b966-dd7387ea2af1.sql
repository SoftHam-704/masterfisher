-- Enable RLS on gallery_photos if not already enabled
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all gallery photos" ON gallery_photos;
DROP POLICY IF EXISTS "Users can create their own gallery photos" ON gallery_photos;
DROP POLICY IF EXISTS "Users can update their own gallery photos" ON gallery_photos;
DROP POLICY IF EXISTS "Users can delete their own gallery photos" ON gallery_photos;

-- Policy: Everyone can view all photos
CREATE POLICY "Users can view all gallery photos"
ON gallery_photos FOR SELECT
USING (true);

-- Policy: Authenticated users can insert their own photos
CREATE POLICY "Users can create their own gallery photos"
ON gallery_photos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own photos
CREATE POLICY "Users can update their own gallery photos"
ON gallery_photos FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete their own gallery photos"
ON gallery_photos FOR DELETE
USING (auth.uid() = user_id);