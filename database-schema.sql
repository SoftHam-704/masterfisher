-- ============================================
-- MASTERFISHER - Database Schema
-- Complete SQL Script for Database Creation
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'guide', 'supplier', 'sponsor');

-- ============================================
-- TABLES
-- ============================================

-- User Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  user_type TEXT,
  location TEXT,
  specialties TEXT[],
  years_experience INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Roles Table (Security: Separate table for role management)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Services Table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_type TEXT NOT NULL,
  price DECIMAL(10,2),
  location TEXT,
  images TEXT[],
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bookings Table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  guests_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(service_id, user_id)
);

-- Guides Table
CREATE TABLE public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  cpf TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  equipment_description TEXT NOT NULL,
  boat_info TEXT,
  daily_rate DECIMAL(10,2) NOT NULL,
  half_day_rate DECIMAL(10,2),
  fish_species TEXT[] NOT NULL,
  operating_region TEXT NOT NULL,
  equipment_images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suppliers Table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  company_name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  service_type TEXT NOT NULL,
  services_description TEXT NOT NULL,
  opening_hours TEXT,
  facade_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('booking', 'review', 'message', 'promotion', 'system')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Messages Table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Loyalty Points Table
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  level TEXT DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Points History Table
CREATE TABLE public.points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points INTEGER NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Badges Table
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Badges Table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Rewards Table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  discount_percentage INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Article Categories Table
CREATE TABLE public.article_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Articles Table (Blog/Content)
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  category_id UUID REFERENCES public.article_categories(id),
  published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sponsor Analytics Table
CREATE TABLE public.sponsor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click')),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store Guide Requests Table (B2B)
CREATE TABLE public.store_guide_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_user_id UUID REFERENCES auth.users(id) NOT NULL,
  guide_user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_guide_requests ENABLE ROW LEVEL SECURITY;

-- Security Definer Function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- User Roles Policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Services Policies
CREATE POLICY "Services are viewable by everyone"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Users can create their own services"
ON public.services FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services"
ON public.services FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services"
ON public.services FOR DELETE
USING (auth.uid() = user_id);

-- Bookings Policies
CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IN (
  SELECT user_id FROM public.services WHERE id = service_id
));

CREATE POLICY "Users can create bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Service owners can update bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() IN (
  SELECT user_id FROM public.services WHERE id = service_id
));

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.reviews FOR DELETE
USING (auth.uid() = user_id);

-- Guides Policies
CREATE POLICY "Guides are viewable by everyone"
ON public.guides FOR SELECT
USING (true);

CREATE POLICY "Users can create guide profiles"
ON public.guides FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guide profile"
ON public.guides FOR UPDATE
USING (auth.uid() = user_id);

-- Suppliers Policies
CREATE POLICY "Suppliers are viewable by everyone"
ON public.suppliers FOR SELECT
USING (true);

CREATE POLICY "Users can create supplier profiles"
ON public.suppliers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplier profile"
ON public.suppliers FOR UPDATE
USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Messages Policies
CREATE POLICY "Users can view their own messages"
ON public.messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received messages"
ON public.messages FOR UPDATE
USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their messages"
ON public.messages FOR DELETE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Loyalty Points Policies
CREATE POLICY "Users can view their own loyalty points"
ON public.loyalty_points FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage loyalty points"
ON public.loyalty_points FOR ALL
USING (true);

-- Points History Policies
CREATE POLICY "Users can view their own points history"
ON public.points_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert points history"
ON public.points_history FOR INSERT
WITH CHECK (true);

-- Badges Policies
CREATE POLICY "Badges are viewable by everyone"
ON public.badges FOR SELECT
USING (true);

CREATE POLICY "Admins can manage badges"
ON public.badges FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- User Badges Policies
CREATE POLICY "Users can view their own badges"
ON public.user_badges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can award badges"
ON public.user_badges FOR INSERT
WITH CHECK (true);

-- Rewards Policies
CREATE POLICY "Active rewards are viewable by everyone"
ON public.rewards FOR SELECT
USING (active = true);

CREATE POLICY "Admins can manage rewards"
ON public.rewards FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Article Categories Policies
CREATE POLICY "Anyone can view categories"
ON public.article_categories FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.article_categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Articles Policies
CREATE POLICY "Anyone can view published articles"
ON public.articles FOR SELECT
USING (published = true OR auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all articles"
ON public.articles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors can manage their own articles"
ON public.articles FOR ALL
USING (auth.uid() = author_id);

-- Sponsor Analytics Policies
CREATE POLICY "Sponsors can view their own analytics"
ON public.sponsor_analytics FOR SELECT
USING (public.has_role(auth.uid(), 'sponsor') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert analytics"
ON public.sponsor_analytics FOR INSERT
WITH CHECK (true);

-- Store Guide Requests Policies
CREATE POLICY "Stores and guides can view their requests"
ON public.store_guide_requests FOR SELECT
USING (auth.uid() = store_user_id OR auth.uid() = guide_user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Stores can create requests"
ON public.store_guide_requests FOR INSERT
WITH CHECK (auth.uid() = store_user_id AND public.has_role(auth.uid(), 'supplier'));

CREATE POLICY "Guides can update their requests"
ON public.store_guide_requests FOR UPDATE
USING (auth.uid() = guide_user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Function to update loyalty level based on total earned points
CREATE OR REPLACE FUNCTION public.update_loyalty_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.total_earned >= 10000 THEN
    NEW.level = 'diamond';
  ELSIF NEW.total_earned >= 5000 THEN
    NEW.level = 'platinum';
  ELSIF NEW.total_earned >= 2000 THEN
    NEW.level = 'gold';
  ELSIF NEW.total_earned >= 500 THEN
    NEW.level = 'silver';
  ELSE
    NEW.level = 'bronze';
  END IF;
  RETURN NEW;
END;
$$;

-- Function to increment article views
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.articles
  SET views = views + 1
  WHERE id = article_id;
END;
$$;

-- Function to handle new user signup and create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, full_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for services updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for bookings updated_at
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for reviews updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for articles updated_at
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for loyalty points updated_at
CREATE TRIGGER update_loyalty_points_updated_at
BEFORE UPDATE ON public.loyalty_points
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for loyalty level updates
CREATE TRIGGER update_loyalty_level_trigger
BEFORE INSERT OR UPDATE ON public.loyalty_points
FOR EACH ROW
EXECUTE FUNCTION public.update_loyalty_level();

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default article categories
INSERT INTO public.article_categories (name, slug, description) VALUES
('Técnicas de Pesca', 'tecnicas-de-pesca', 'Aprenda técnicas e estratégias de pesca'),
('Equipamentos', 'equipamentos', 'Tudo sobre equipamentos e acessórios'),
('Locais de Pesca', 'locais-de-pesca', 'Descubra os melhores pontos de pesca'),
('Conservação', 'conservacao', 'Práticas sustentáveis e conservação ambiental'),
('Notícias', 'noticias', 'Últimas notícias do mundo da pesca');

-- Insert default badges
INSERT INTO public.badges (name, description, icon, requirement) VALUES
('Primeira Pescaria', 'Complete sua primeira reserva', '🎣', 1),
('Pescador Frequente', 'Complete 5 reservas', '⭐', 5),
('Mestre Pescador', 'Complete 20 reservas', '🏆', 20),
('Explorador', 'Visite 3 locais diferentes', '🗺️', 3),
('Avaliador', 'Deixe 10 avaliações', '💬', 10);

-- Insert default rewards
INSERT INTO public.rewards (title, description, points_required, discount_percentage, active) VALUES
('5% de Desconto', 'Desconto de 5% em qualquer serviço', 100, 5, true),
('10% de Desconto', 'Desconto de 10% em qualquer serviço', 250, 10, true),
('15% de Desconto', 'Desconto de 15% em qualquer serviço', 500, 15, true),
('20% de Desconto', 'Desconto de 20% em qualquer serviço', 1000, 20, true),
('Serviço Gratuito', 'Um serviço completamente gratuito', 5000, 100, true);

-- ============================================
-- REALTIME CONFIGURATION
-- ============================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.articles;

-- ============================================
-- STORAGE BUCKETS (Reference - Created via Supabase Dashboard)
-- ============================================

-- Note: Storage buckets should be created via Supabase Dashboard or API:
-- - guide-images (public)
-- - supplier-images (public)
-- - service-images (public)
-- - avatars (public)

-- ============================================
-- END OF SCHEMA
-- ============================================