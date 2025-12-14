-- Create Sponsors Table
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Sponsors
CREATE POLICY "Anyone can view active sponsors"
ON public.sponsors FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage sponsors"
ON public.sponsors FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert sample sponsors
INSERT INTO public.sponsors (name, logo_url, website_url, display_order, is_active) VALUES
('FishPro Equipment', '/src/assets/partners/partner-1.jpg', 'https://fishpro.example.com', 1, true),
('Marine Adventures', '/src/assets/partners/partner-2.jpg', 'https://marineadv.example.com', 2, true),
('Ocean Gear Co.', '/src/assets/partners/partner-3.jpg', 'https://oceangear.example.com', 3, true),
('Tackle Masters', '/src/assets/partners/partner-4.jpg', 'https://tacklemasters.example.com', 4, true),
('Deep Sea Supplies', '/src/assets/partners/partner-5.jpg', 'https://deepsea.example.com', 5, true),
('Fishing World', '/src/assets/partners/partner-6.jpg', 'https://fishingworld.example.com', 6, true),
('Angler Pro Shop', '/src/assets/partners/partner-7.jpg', 'https://anglerpro.example.com', 7, true),
('Boat & Bait Ltd', '/src/assets/partners/partner-8.jpg', 'https://boatbait.example.com', 8, true);