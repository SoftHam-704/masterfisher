-- Create guides table
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf TEXT NOT NULL,
  birth_date DATE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  specialties TEXT NOT NULL,
  languages TEXT NOT NULL,
  certifications TEXT,
  availability TEXT NOT NULL,
  service_areas TEXT NOT NULL,
  equipment_list TEXT NOT NULL,
  equipment_images TEXT[],
  half_day_price DECIMAL(10,2) NOT NULL,
  full_day_price DECIMAL(10,2) NOT NULL,
  additional_services TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  responsible_name TEXT NOT NULL,
  responsible_cpf TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  products_services TEXT NOT NULL,
  operating_hours TEXT NOT NULL,
  payment_methods TEXT NOT NULL,
  delivery_options TEXT,
  facade_image TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on guides table
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Enable RLS on suppliers table
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guides table
CREATE POLICY "Users can view approved guides"
  ON public.guides
  FOR SELECT
  USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own guide registration"
  ON public.guides
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guide registration"
  ON public.guides
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all guides"
  ON public.guides
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for suppliers table
CREATE POLICY "Users can view approved suppliers"
  ON public.suppliers
  FOR SELECT
  USING (approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own supplier registration"
  ON public.suppliers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplier registration"
  ON public.suppliers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all suppliers"
  ON public.suppliers
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();