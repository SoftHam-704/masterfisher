-- Remover políticas antigas de guides
DROP POLICY IF EXISTS "Users can view approved guides" ON public.guides;
DROP POLICY IF EXISTS "Users can insert their own guide registration" ON public.guides;
DROP POLICY IF EXISTS "Users can update their own guide registration" ON public.guides;
DROP POLICY IF EXISTS "Admins can manage all guides" ON public.guides;
DROP POLICY IF EXISTS "Supervisors can manage all guides" ON public.guides;

-- Remover políticas antigas de suppliers
DROP POLICY IF EXISTS "Users can view approved suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Users can insert their own supplier registration" ON public.suppliers;
DROP POLICY IF EXISTS "Users can update their own supplier registration" ON public.suppliers;
DROP POLICY IF EXISTS "Admins can manage all suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Supervisors can manage all suppliers" ON public.suppliers;

-- Alterar tabela guides
ALTER TABLE public.guides 
  DROP COLUMN IF EXISTS approved,
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Alterar tabela suppliers
ALTER TABLE public.suppliers 
  DROP COLUMN IF EXISTS approved,
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id);

-- Criar novas políticas para guides
CREATE POLICY "Users can view approved guides"
  ON public.guides
  FOR SELECT
  USING (approval_status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own guide registration"
  ON public.guides
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guide registration"
  ON public.guides
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Supervisors can manage all guides"
  ON public.guides
  FOR ALL
  USING (public.has_role(auth.uid(), 'supervisor'));

-- Criar novas políticas para suppliers
CREATE POLICY "Users can view approved suppliers"
  ON public.suppliers
  FOR SELECT
  USING (approval_status = 'approved' OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own supplier registration"
  ON public.suppliers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplier registration"
  ON public.suppliers
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Supervisors can manage all suppliers"
  ON public.suppliers
  FOR ALL
  USING (public.has_role(auth.uid(), 'supervisor'));