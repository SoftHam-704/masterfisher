-- Adicionar campos para patrocinadores Master à tabela sponsors
ALTER TABLE public.sponsors
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'bronze' CHECK (tier IN ('master', 'gold', 'silver', 'bronze')),
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS priority_order INTEGER DEFAULT 999,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS custom_page_url TEXT;

-- Criar índice para melhorar performance de queries
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON public.sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_featured ON public.sponsors(featured);

-- Atualizar sponsors existentes para ter tier definido
UPDATE public.sponsors SET tier = 'bronze' WHERE tier IS NULL;