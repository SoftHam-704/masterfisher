-- Create loyalty_points table
CREATE TABLE public.loyalty_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_level CHECK (level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond'))
);

-- Create points_history table to track point transactions
CREATE TABLE public.points_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_badges table
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  discount_percentage INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loyalty_points
CREATE POLICY "Users can view their own points"
  ON public.loyalty_points
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage points"
  ON public.loyalty_points
  FOR ALL
  USING (true);

-- RLS Policies for points_history
CREATE POLICY "Users can view their own history"
  ON public.points_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create history"
  ON public.points_history
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for badges
CREATE POLICY "Everyone can view badges"
  ON public.badges
  FOR SELECT
  USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges"
  ON public.user_badges
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can award badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for rewards
CREATE POLICY "Everyone can view active rewards"
  ON public.rewards
  FOR SELECT
  USING (active = true);

-- Create function to update loyalty level
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
  
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for updating loyalty level
CREATE TRIGGER update_loyalty_level_trigger
  BEFORE UPDATE OF total_earned ON public.loyalty_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_loyalty_level();

-- Insert default badges
INSERT INTO public.badges (name, description, icon, requirement) VALUES
  ('Primeiro Passo', 'Criou sua conta', '🎣', 0),
  ('Pescador Iniciante', 'Fez sua primeira reserva', '🐟', 1),
  ('Pescador Experiente', 'Completou 5 reservas', '🎯', 5),
  ('Mestre Pescador', 'Completou 20 reservas', '👑', 20),
  ('Explorador', 'Visitou 10 serviços diferentes', '🗺️', 10),
  ('Avaliador', 'Deixou 10 avaliações', '⭐', 10);

-- Insert default rewards
INSERT INTO public.rewards (title, description, points_required, discount_percentage) VALUES
  ('5% de Desconto', 'Ganhe 5% de desconto em qualquer reserva', 100, 5),
  ('10% de Desconto', 'Ganhe 10% de desconto em qualquer reserva', 250, 10),
  ('15% de Desconto', 'Ganhe 15% de desconto em qualquer reserva', 500, 15),
  ('20% de Desconto', 'Ganhe 20% de desconto em qualquer reserva', 1000, 20),
  ('Reserva Grátis', 'Uma reserva completamente grátis', 2000, 100);

-- Create indexes
CREATE INDEX idx_loyalty_points_user_id ON public.loyalty_points(user_id);
CREATE INDEX idx_points_history_user_id ON public.points_history(user_id);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);