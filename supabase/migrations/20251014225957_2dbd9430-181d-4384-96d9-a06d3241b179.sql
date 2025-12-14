-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  image_url TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to view services
CREATE POLICY "Services are viewable by everyone" 
ON public.services 
FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to create services
CREATE POLICY "Authenticated users can create services" 
ON public.services 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample service data
INSERT INTO public.services (name, type, location, description, phone, email, website, image_url, features)
VALUES 
  (
    'João "Pé de Pano"',
    'Guia de Pesca',
    'Corumbá, MS',
    'Especialista em pesca de Dourado no Pantanal com mais de 15 anos de experiência. Barco completo e equipado para até 3 pessoas.',
    '(67) 99999-9999',
    'joao@pescapantanal.com.br',
    'www.pescapantanal.com.br',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
    '["Barco equipado", "Equipamentos de pesca inclusos", "Lanche e bebidas", "Guia experiente", "Seguro incluso"]'::jsonb
  ),
  (
    'Pousada Águas do Pantanal',
    'Pousada',
    'Miranda, MS',
    'Hospedagem completa no coração do Pantanal com estrutura para pesca esportiva e passeios ecológicos.',
    '(67) 98888-8888',
    'contato@aguasdopantanal.com.br',
    'www.aguasdopantanal.com.br',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    '["Quartos confortáveis", "Pier para pesca", "Passeios inclusos", "Alimentação completa", "WiFi disponível"]'::jsonb
  ),
  (
    'Pescaria & Cia',
    'Loja de Pesca',
    'Campo Grande, MS',
    'Equipamentos completos para pesca esportiva, iscas artificiais e naturais, acessórios e consultoria especializada.',
    '(67) 97777-7777',
    'vendas@pescariaecia.com.br',
    'www.pescariaecia.com.br',
    'https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=800&h=600&fit=crop',
    '["Iscas artificiais", "Varas e molinetes", "Equipamentos de segurança", "Acessórios diversos", "Entrega rápida"]'::jsonb
  );