import { X, RefreshCw, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentResultFailedProps {
  reason?: string;
  onRetry: () => void;
  onTryAnotherCard: () => void;
  onCancel: () => void;
}

export function PaymentResultFailed({
  reason = "Card declined",
  onRetry,
  onTryAnotherCard,
  onCancel,
}: PaymentResultFailedProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 patela-gradient-danger">
      <div className="flex flex-col items-center text-center space-y-6 animate-patela-bounce-in">
        {/* Failed Icon */}
        <div className="h-28 w-28 rounded-full bg-destructive-foreground/20 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-destructive-foreground flex items-center justify-center">
            <X className="h-12 w-12 text-destructive" strokeWidth={3} />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-3xl font-bold text-destructive-foreground">{reason}</p>
          <p className="text-destructive-foreground/80 text-lg">
            Try another card or use cash
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3 mt-8">
          <Button
            variant="secondary"
            size="xl"
            className="w-full bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
            onClick={onRetry}
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-destructive-foreground/90 hover:bg-destructive-foreground/10"
            onClick={onTryAnotherCard}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Try Another Card
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-destructive-foreground/60 hover:text-destructive-foreground hover:bg-destructive-foreground/10"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
