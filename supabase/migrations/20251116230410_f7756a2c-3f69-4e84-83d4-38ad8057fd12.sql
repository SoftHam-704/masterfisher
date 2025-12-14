-- Etapa 1: Adicionar índices otimizados para gallery_photos
-- Estes índices melhoram drasticamente a performance das queries

-- Índice para buscar fotos por usuário (usado em UserGallery)
CREATE INDEX IF NOT EXISTS idx_gallery_photos_user_id 
ON public.gallery_photos(user_id);

-- Índice para ordenar por data de criação
CREATE INDEX IF NOT EXISTS idx_gallery_photos_created_at 
ON public.gallery_photos(created_at DESC);

-- Índice composto para buscar fotos de um usuário ordenadas por data
-- Este é o mais importante, pois combina as duas queries mais comuns
CREATE INDEX IF NOT EXISTS idx_gallery_photos_user_created 
ON public.gallery_photos(user_id, created_at DESC);