-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name)
VALUES 
  ('avatars', 'avatars'),
  ('guide-images', 'guide-images'),
  ('supplier-images', 'supplier-images')
ON CONFLICT (id) DO NOTHING;