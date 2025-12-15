import { useLocation, useNavigate } from "react-router-dom";
import { PaymentResultSuccess } from "@/components/patela/PaymentResultSuccess";
import { toast } from "@/hooks/use-toast";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 0, note = "" } = location.state || {};

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
