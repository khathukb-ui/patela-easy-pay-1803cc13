import { useLocation, useNavigate } from "react-router-dom";
import { PaymentResultSuccess } from "@/components/patela/PaymentResultSuccess";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";

interface SaleItemData {
  name: string;
  sku?: string;
  price: number;
  quantity: number;
}

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const savedRef = useRef(false);
  const { amount = 0, note = "", method = "card", items = [] } = location.state || {} as {
    amount: number;
    note: string;
    method: string;
    items: SaleItemData[];
  };

  // Save the sale + items to database
  useEffect(() => {
    if (savedRef.current || !user || !amount) return;
    savedRef.current = true;

    async function saveSale() {
      try {
        const { data: sale, error: saleError } = await supabase
          .from("sales")
          .insert({
            user_id: user!.id,
            amount,
            payment_method: method,
            status: "success",
            note: note || null,
          })
          .select("id")
          .single();

        if (saleError) {
          console.error("Failed to save sale:", saleError);
          return;
        }

        // Save line items if any
        if (sale && items.length > 0) {
          const saleItems = items.map((item: SaleItemData) => ({
            sale_id: sale.id,
            item_name: item.name,
            sku: item.sku || null,
            unit_price: item.price,
            quantity: item.quantity,
            line_total: item.price * item.quantity,
          }));

          const { error: itemsError } = await supabase
            .from("sale_items")
            .insert(saleItems);

          if (itemsError) {
            console.error("Failed to save sale items:", itemsError);
          }
        }
      } catch (e) {
        console.error("Error saving sale:", e);
      }
    }

    saveSale();
  }, [user, amount, method, note, items]);

  const handleSendReceipt = (method: "sms" | "whatsapp" | "email") => {
    toast({
      title: "Receipt Sent!",
      description: `Receipt sent via ${method.toUpperCase()}`,
    });
    navigate("/home");
  };

  const handleNoReceipt = () => {
    navigate("/home");
  };

  const handleDone = () => {
    navigate("/home");
  };

  return (
    <PaymentResultSuccess
      amount={amount}
      note={note}
      onSendReceipt={handleSendReceipt}
      onNoReceipt={handleNoReceipt}
      onDone={handleDone}
    />
  );
}
