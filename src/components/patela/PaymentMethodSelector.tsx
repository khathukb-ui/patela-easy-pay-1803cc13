import { CreditCard, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaymentMethod = "card" | "cash";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="flex bg-secondary rounded-xl p-1 gap-1">
      <button
        onClick={() => onChange("card")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
          selected === "card"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <CreditCard className="h-5 w-5" />
        <span>Card</span>
      </button>
      <button
        onClick={() => onChange("cash")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
          selected === "cash"
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Banknote className="h-5 w-5" />
        <span>Cash</span>
      </button>
    </div>
  );
}
