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
    <div className="bg-card rounded-xl p-3 patela-shadow-md border border-primary/10 animate-patela-slide-up">
      <div className="flex items-center gap-1.5 mb-2">
        <TrendingUp className="h-4 w-4 text-accent" />
        <h2 className="text-xs font-semibold text-primary uppercase tracking-wide">
          Today's Summary
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-0.5">
          <p className="text-muted-foreground text-[10px] font-medium uppercase">Total Sales</p>
          <p className="text-xl font-bold text-foreground">R{totalSales.toFixed(2)}</p>
          <p className="text-[10px] text-muted-foreground">{salesCount} transactions</p>
        </div>
        
        <div className="space-y-0.5">
          <p className="text-muted-foreground text-[10px] font-medium uppercase">Net Amount</p>
          <p className={cn(
            "text-xl font-bold",
            netAmount >= 0 ? "text-success" : "text-destructive"
          )}>
            R{netAmount.toFixed(2)}
          </p>
          {refundsTotal > 0 && (
            <p className="text-[10px] text-destructive flex items-center gap-0.5">
              <Minus className="h-2.5 w-2.5" />
              R{refundsTotal.toFixed(2)} refunds
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
