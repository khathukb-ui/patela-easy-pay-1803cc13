CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.generate_merchant_api_keys(p_merchant_id uuid, p_environment text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
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
    v_prefix || encode(extensions.gen_random_bytes(24), 'hex'),
    replace(v_prefix, 'pk_', 'sk_') || encode(extensions.gen_random_bytes(32), 'hex')
  );
END;
$$;