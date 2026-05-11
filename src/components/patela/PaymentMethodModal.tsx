import { CreditCard, Banknote, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PaymentMethod = "card" | "cash";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (method: PaymentMethod) => void;
  amount: number;
}

export function PaymentMethodModal({ isOpen, onClose, onSelect, amount }: PaymentMethodModalProps) {
  if (!isOpen) return null;

  const formattedAmount = amount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 animate-patela-slide-up shadow-2xl border border-border">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Select Payment Method</h2>
          <p className="text-3xl font-bold text-primary">R{formattedAmount}</p>
        </div>

        {/* Payment Options */}
        <div className="space-y-3">
          <button
            onClick={() => onSelect("card")}
            className="w-full flex items-center gap-4 p-5 bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 hover:border-primary rounded-2xl transition-all group"
          >
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
              <CreditCard className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-lg font-semibold text-foreground">Card Payment</p>
              <p className="text-sm text-muted-foreground">Tap, insert or swipe on device</p>
            </div>
          </button>

          <button
            onClick={() => onSelect("cash")}
            className="w-full flex items-center gap-4 p-5 bg-accent/5 hover:bg-accent/10 border-2 border-accent/20 hover:border-accent rounded-2xl transition-all group"
          >
            <div className="h-14 w-14 rounded-xl bg-accent flex items-center justify-center group-hover:scale-105 transition-transform">
              <Banknote className="h-7 w-7 text-accent-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-lg font-semibold text-foreground">Cash Payment</p>
              <p className="text-sm text-muted-foreground">Record cash received</p>
            </div>
          </button>
        </div>

        {/* Cancel */}
        <Button
          variant="ghost"
          className="w-full mt-4"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
