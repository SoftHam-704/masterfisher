-- Criar políticas RLS para a tabela sponsors
-- Permitir que todos vejam patrocinadores ativos (público)
CREATE POLICY "Anyone can view active sponsors"
ON public.sponsors
FOR SELECT
USING (is_active = true);

-- Apenas admins podem criar patrocinadores
CREATE POLICY "Admins can insert sponsors"
ON public.sponsors
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Apenas admins podem atualizar patrocinadores
CREATE POLICY "Admins can update sponsors"
ON public.sponsors
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Apenas admins podem deletar patrocinadores
CREATE POLICY "Admins can delete sponsors"
ON public.sponsors
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);