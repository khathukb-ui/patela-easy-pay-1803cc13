
-- Sale items table to record line items for each sale
CREATE TABLE public.sale_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  sku text,
  unit_price numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  line_total numeric NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Users can insert sale items for their own sales
CREATE POLICY "Users can insert sale items" ON public.sale_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND (sales.user_id = auth.uid() OR sales.cashier_id = auth.uid()))
  );

-- Users can view sale items for their own sales
CREATE POLICY "Users can view sale items" ON public.sale_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_items.sale_id AND (sales.user_id = auth.uid() OR sales.cashier_id = auth.uid()))
  );
