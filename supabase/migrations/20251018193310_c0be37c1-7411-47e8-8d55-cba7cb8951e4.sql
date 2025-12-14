-- Adicionar coluna approved_at nas tabelas guides e suppliers
ALTER TABLE public.guides 
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.suppliers 
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;