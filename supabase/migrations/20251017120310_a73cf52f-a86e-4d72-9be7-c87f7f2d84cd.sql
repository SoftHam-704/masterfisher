-- Delete existing buckets and recreate them
DELETE FROM storage.buckets WHERE id IN ('avatars', 'guide-images', 'supplier-images');

-- Recreate buckets
INSERT INTO storage.buckets (id, name, owner)
VALUES 
  ('avatars', 'avatars', NULL),
  ('guide-images', 'guide-images', NULL),
  ('supplier-images', 'supplier-images', NULL);