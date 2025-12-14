-- Simply create the photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('photos', 'photos')
ON CONFLICT (id) DO NOTHING;