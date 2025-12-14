-- Fix search_path for the function by dropping trigger first
DROP TRIGGER IF EXISTS update_partner_payments_updated_at ON public.partner_payments;
DROP FUNCTION IF EXISTS public.update_partner_payments_updated_at();

CREATE OR REPLACE FUNCTION public.update_partner_payments_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_partner_payments_updated_at
BEFORE UPDATE ON public.partner_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_partner_payments_updated_at();