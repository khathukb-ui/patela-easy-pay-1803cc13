import { CreditCard, RefreshCw, Clock, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type SaleStatus = "success" | "pending" | "failed" | "queued" | "refunded";

interface SaleItemProps {
  id: string;
  amount: number;
  timestamp: Date;
  status: SaleStatus;
  lastFourDigits?: string;
  note?: string;
  onClick?: () => void;
}

const statusConfig: Record<SaleStatus, { icon: typeof Check; color: string; label: string }> = {
  success: { icon: Check, color: "text-success", label: "Success" },
  pending: { icon: RefreshCw, color: "text-warning animate-spin", label: "Processing" },
  failed: { icon: AlertTriangle, color: "text-destructive", label: "Failed" },
  queued: { icon: Clock, color: "text-muted-foreground", label: "Queued" },
  refunded: { icon: RefreshCw, color: "text-muted-foreground", label: "Refunded" },
};

export function SaleItem({ id, amount, timestamp, status, lastFourDigits, note, onClick }: SaleItemProps) {
  const { icon: StatusIcon, color, label } = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:bg-secondary/50 transition-colors duration-200 text-left"
    >
      <div className={cn("h-10 w-10 rounded-full bg-muted flex items-center justify-center", color)}>
        <StatusIcon className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-lg font-bold",
            status === "refunded" ? "text-muted-foreground line-through" : "text-foreground"
          )}>
            R{Math.abs(amount).toFixed(2)}
          </span>
          {status === "refunded" && (
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
              Refunded
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {lastFourDigits && (
            <>
              <CreditCard className="h-3 w-3" />
              <span>•••• {lastFourDigits}</span>
              <span>•</span>
            </>
          )}
          <span>{timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        {note && (
          <p className="text-sm text-muted-foreground truncate mt-1">"{note}"</p>
        )}
      </div>
      
      <div className="text-right">
        <span className={cn("text-xs font-medium", color)}>{label}</span>
      </div>
    </button>
  );
}
