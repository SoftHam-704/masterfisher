-- ============================================
-- Adicionar Campos de Redes Sociais
-- Para Fornecedores, Guias, Parceiros e Patrocinadores
-- ============================================

-- Adicionar colunas de redes sociais na tabela suppliers (Fornecedores)
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.suppliers ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Adicionar colunas de redes sociais na tabela partner_payments (Guias e Parceiros Gold)
ALTER TABLE public.partner_payments ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.partner_payments ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.partner_payments ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.partner_payments ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Adicionar colunas de redes sociais na tabela sponsors (Patrocinadores Master)
ALTER TABLE public.sponsors ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE public.sponsors ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.sponsors ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Comentarios para documentacao
COMMENT ON COLUMN public.suppliers.instagram_url IS 'URL do perfil do Instagram do fornecedor';
COMMENT ON COLUMN public.suppliers.facebook_url IS 'URL do perfil do Facebook do fornecedor';
COMMENT ON COLUMN public.suppliers.youtube_url IS 'URL do canal do YouTube do fornecedor';
COMMENT ON COLUMN public.suppliers.website_url IS 'URL do site do fornecedor';

COMMENT ON COLUMN public.partner_payments.instagram_url IS 'URL do perfil do Instagram do parceiro/guia';
COMMENT ON COLUMN public.partner_payments.facebook_url IS 'URL do perfil do Facebook do parceiro/guia';
COMMENT ON COLUMN public.partner_payments.youtube_url IS 'URL do canal do YouTube do parceiro/guia';
COMMENT ON COLUMN public.partner_payments.website_url IS 'URL do site do parceiro/guia';

COMMENT ON COLUMN public.sponsors.instagram_url IS 'URL do perfil do Instagram do patrocinador';
COMMENT ON COLUMN public.sponsors.facebook_url IS 'URL do perfil do Facebook do patrocinador';
COMMENT ON COLUMN public.sponsors.youtube_url IS 'URL do canal do YouTube do patrocinador';
