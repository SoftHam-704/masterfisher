-- Sub-etapa 1a: Adicionar novos campos e índice de performance
-- Colunas opcionais (nullable) - zero risco para dados existentes
ALTER TABLE public.gallery_photos 
ADD COLUMN IF NOT EXISTS fishing_date DATE,
ADD COLUMN IF NOT EXISTS river_name TEXT;

-- Índice para melhorar performance em queries de contagem por usuário
CREATE INDEX IF NOT EXISTS idx_gallery_user_count ON public.gallery_photos(user_id);

-- Comentários para documentação
COMMENT ON COLUMN public.gallery_photos.fishing_date IS 'Data da pescaria (opcional)';
COMMENT ON COLUMN public.gallery_photos.river_name IS 'Nome do rio onde foi a pescaria (opcional)';