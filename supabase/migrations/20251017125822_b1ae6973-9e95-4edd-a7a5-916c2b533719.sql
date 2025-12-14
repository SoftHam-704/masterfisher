-- Remover bucket existente completamente
DELETE FROM storage.objects WHERE bucket_id = 'gallery';
DELETE FROM storage.buckets WHERE id = 'gallery';

-- Criar bucket com configuração mínima
INSERT INTO storage.buckets (id, name, owner, created_at, updated_at)
VALUES (
  'gallery',
  'gallery', 
  NULL,
  NOW(),
  NOW()
);

-- Aguardar propagação (isso é um comentário, não tem efeito prático, mas documenta a intenção)
-- Storage precisa sincronizar com o bucket criado

-- Recriar as políticas RLS
DROP POLICY IF EXISTS "Users can view all gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own gallery photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own gallery photos" ON storage.objects;

CREATE POLICY "Users can view all gallery photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Users can upload their own gallery photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own gallery photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own gallery photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);