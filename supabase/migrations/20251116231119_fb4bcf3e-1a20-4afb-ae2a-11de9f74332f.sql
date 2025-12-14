-- Etapa 3: Criar bucket de storage 'gallery' para fotos

-- Criar bucket para galeria de fotos (público)
INSERT INTO storage.buckets (id, name)
VALUES ('gallery', 'gallery')
ON CONFLICT (id) DO NOTHING;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem fazer upload de suas fotos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem ver suas próprias fotos" ON storage.objects;
DROP POLICY IF EXISTS "Qualquer pessoa pode ver fotos da galeria" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias fotos" ON storage.objects;

-- Política: Permitir que qualquer usuário autenticado faça upload de suas próprias fotos
CREATE POLICY "Usuários podem fazer upload de suas fotos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Permitir acesso público de leitura (para galeria pública)
CREATE POLICY "Qualquer pessoa pode ver fotos da galeria"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery');

-- Política: Permitir que usuários deletem suas próprias fotos
CREATE POLICY "Usuários podem deletar suas próprias fotos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery' AND
  (storage.foldername(name))[1] = auth.uid()::text
);