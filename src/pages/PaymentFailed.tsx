import { useNavigate } from "react-router-dom";
import { PaymentResultFailed } from "@/components/patela/PaymentResultFailed";

export default function PaymentFailed() {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate("/payment");
  };

  const handleTryAnotherCard = () => {
    navigate("/payment");
  };

  const handleCancel = () => {
    navigate("/home");
  };

  return (
    <PaymentResultFailed
      reason="Card declined"
      onRetry={handleRetry}
      onTryAnotherCard={handleTryAnotherCard}
      onCancel={handleCancel}
    />
  );
}
