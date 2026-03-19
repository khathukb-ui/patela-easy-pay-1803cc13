
-- Create refunds table with full audit trail
CREATE TABLE public.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL,
  refunded_by_user_id uuid NOT NULL,
  refund_reference text NOT NULL DEFAULT ('REF-' || upper(substr(gen_random_uuid()::text, 1, 8))),
  original_transaction_reference text,
  amount numeric NOT NULL,
  refund_type text NOT NULL DEFAULT 'full',
  reason text NOT NULL DEFAULT 'other',
  reason_note text,
  status text NOT NULL DEFAULT 'pending',
  payment_method text NOT NULL DEFAULT 'card',
  same_day_refund_deduction numeric DEFAULT 0,
  next_settlement_adjustment numeric DEFAULT 0,
  sms_sent boolean DEFAULT false,
  email_sent boolean DEFAULT false,
  whatsapp_sent boolean DEFAULT false,
  flagged_suspicious boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own refunds"
  ON public.refunds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert refunds"
  ON public.refunds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own refunds"
  ON public.refunds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_refunds_updated_at
  BEFORE UPDATE ON public.refunds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_refunds_sale_id ON public.refunds(sale_id);
CREATE INDEX idx_refunds_user_id ON public.refunds(user_id);
CREATE INDEX idx_refunds_status ON public.refunds(status);
