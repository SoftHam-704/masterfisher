-- Criar bucket para fotos da galeria (sem a coluna public)
INSERT INTO storage.buckets (id, name)
VALUES ('gallery', 'gallery');

-- Criar tabela para metadados das fotos
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  location TEXT,
  fish_species TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso - todos podem ver, mas só o dono pode criar/editar/deletar
CREATE POLICY "Fotos são visíveis por todos"
ON public.gallery_photos
FOR SELECT
USING (true);

CREATE POLICY "Usuários podem fazer upload de suas próprias fotos"
ON public.gallery_photos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias fotos"
ON public.gallery_photos
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias fotos"
ON public.gallery_photos
FOR DELETE
USING (auth.uid() = user_id);

-- Políticas de Storage para o bucket gallery
CREATE POLICY "Fotos da galeria são visíveis por todos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Usuários podem fazer upload de suas próprias fotos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem atualizar suas próprias fotos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem deletar suas próprias fotos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'gallery' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_gallery_photos_updated_at
BEFORE UPDATE ON public.gallery_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();