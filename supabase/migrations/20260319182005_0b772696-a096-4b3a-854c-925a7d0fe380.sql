-- Merchants table
CREATE TABLE public.merchants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  business_type text NOT NULL,
  trading_name text,
  registration_number text,
  tax_number text,
  business_address text,
  business_city text,
  business_province text,
  business_postal_code text,
  contact_email text,
  contact_phone text,
  website_url text,
  description text,
  status text NOT NULL DEFAULT 'pending',
  is_live_enabled boolean NOT NULL DEFAULT false,
  environment text NOT NULL DEFAULT 'sandbox',
  approved_at timestamptz,
  rejected_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own record" ON public.merchants FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Merchants can insert own record" ON public.merchants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Merchants can update own record" ON public.merchants FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON public.merchants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Merchant documents (KYC)
CREATE TABLE public.merchant_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  status text NOT NULL DEFAULT 'pending',
  rejection_reason text,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.merchant_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own documents" ON public.merchant_documents FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_documents.merchant_id AND user_id = auth.uid()));
CREATE POLICY "Merchants can upload documents" ON public.merchant_documents FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_documents.merchant_id AND user_id = auth.uid()));

-- Merchant API keys
CREATE TABLE public.merchant_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  environment text NOT NULL,
  public_key text NOT NULL,
  secret_key text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);

ALTER TABLE public.merchant_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own API keys" ON public.merchant_api_keys FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_api_keys.merchant_id AND user_id = auth.uid()));
CREATE POLICY "Merchants can create API keys" ON public.merchant_api_keys FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_api_keys.merchant_id AND user_id = auth.uid()));
CREATE POLICY "Merchants can update own API keys" ON public.merchant_api_keys FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_api_keys.merchant_id AND user_id = auth.uid()));

-- Merchant transactions
CREATE TABLE public.merchant_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  environment text NOT NULL DEFAULT 'sandbox',
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'ZAR',
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL DEFAULT 'card',
  reference text,
  customer_email text,
  customer_name text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.merchant_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own transactions" ON public.merchant_transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_transactions.merchant_id AND user_id = auth.uid()));
CREATE POLICY "Merchants can insert transactions" ON public.merchant_transactions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_transactions.merchant_id AND user_id = auth.uid()));

-- Merchant payouts
CREATE TABLE public.merchant_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id uuid NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'ZAR',
  status text NOT NULL DEFAULT 'pending',
  bank_name text,
  account_number text,
  branch_code text,
  account_holder text,
  reference text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE public.merchant_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Merchants can view own payouts" ON public.merchant_payouts FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_payouts.merchant_id AND user_id = auth.uid()));
CREATE POLICY "Merchants can request payouts" ON public.merchant_payouts FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.merchants WHERE id = merchant_payouts.merchant_id AND user_id = auth.uid()));

-- Storage bucket for merchant documents
INSERT INTO storage.buckets (id, name, public) VALUES ('merchant-documents', 'merchant-documents', false);

CREATE POLICY "Merchants can upload own docs" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'merchant-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Merchants can view own docs" ON storage.objects FOR SELECT
  USING (bucket_id = 'merchant-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Function to generate API keys
CREATE OR REPLACE FUNCTION public.generate_merchant_api_keys(p_merchant_id uuid, p_environment text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prefix text;
BEGIN
  IF p_environment = 'sandbox' THEN
    v_prefix := 'pk_test_';
  ELSE
    v_prefix := 'pk_live_';
  END IF;

  INSERT INTO public.merchant_api_keys (merchant_id, environment, public_key, secret_key)
  VALUES (
    p_merchant_id,
    p_environment,
    v_prefix || encode(gen_random_bytes(24), 'hex'),
    replace(v_prefix, 'pk_', 'sk_') || encode(gen_random_bytes(32), 'hex')
  );
END;
$$;