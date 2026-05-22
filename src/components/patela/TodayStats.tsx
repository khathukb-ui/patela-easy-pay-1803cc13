import { TrendingUp, ArrowDownUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodayStatsProps {
  totalSales: number;
  salesCount: number;
  refundsTotal: number;
  netAmount: number;
}

export function TodayStats({ totalSales, salesCount, refundsTotal, netAmount }: TodayStatsProps) {
  return (
    <div className="bg-card rounded-2xl p-5 patela-shadow-md border border-primary/10 animate-patela-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Today's Summary
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">Total Sales</p>
          <p className="text-2xl font-bold text-foreground">R{totalSales.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{salesCount} transactions</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">Net Amount</p>
          <p className={cn(
            "text-2xl font-bold",
            netAmount >= 0 ? "text-success" : "text-destructive"
          )}>
            R{netAmount.toFixed(2)}
          </p>
          {refundsTotal > 0 && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <Minus className="h-3 w-3" />
              R{refundsTotal.toFixed(2)} refunds
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
