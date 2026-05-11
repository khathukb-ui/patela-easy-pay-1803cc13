import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp } from "lucide-react";

interface SalesTrendChartProps {
  data?: { day: string; amount: number }[];
}

const emptyData = [
  { day: "Mon", amount: 0 },
  { day: "Tue", amount: 0 },
  { day: "Wed", amount: 0 },
  { day: "Thu", amount: 0 },
  { day: "Fri", amount: 0 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
];

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const { t } = useLanguage();
  const chartData = data && data.length > 0 ? data : emptyData;
  const hasData = data && data.length > 0 && data.some(d => d.amount > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-bold text-foreground">
            R{payload[0].value.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl p-4 border border-primary/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Sales Trend
        </h3>
        <span className="text-xs text-muted-foreground">This Week</span>
      </div>
      {!hasData ? (
        <div className="h-32 flex flex-col items-center justify-center text-center">
          <TrendingUp className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">No sales yet</p>
          <p className="text-[10px] text-muted-foreground/60">Start taking payments to see trends</p>
        </div>
      ) : (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
