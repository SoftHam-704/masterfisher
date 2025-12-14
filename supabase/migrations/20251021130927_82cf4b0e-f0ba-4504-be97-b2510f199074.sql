-- Create table for partner payment status
CREATE TABLE IF NOT EXISTS public.partner_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  area TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'succeeded', 'failed', 'canceled')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'incomplete', 'past_due', 'trialing')),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  amount INTEGER NOT NULL,
  registration_token TEXT UNIQUE,
  registration_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.partner_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payment records by email
CREATE POLICY "Users can view own payment records"
ON public.partner_payments
FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Policy: Service role can do everything (for webhooks and edge functions)
CREATE POLICY "Service role has full access"
ON public.partner_payments
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create index for faster lookups
CREATE INDEX idx_partner_payments_email ON public.partner_payments(email);
CREATE INDEX idx_partner_payments_token ON public.partner_payments(registration_token);
CREATE INDEX idx_partner_payments_stripe_customer ON public.partner_payments(stripe_customer_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_partner_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_payments_updated_at
BEFORE UPDATE ON public.partner_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_partner_payments_updated_at();