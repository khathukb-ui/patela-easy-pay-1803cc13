import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Package } from "lucide-react";

interface StockLevelChartProps {
  data?: { name: string; stock: number; lowThreshold: number }[];
}

export function StockLevelChart({ data }: StockLevelChartProps) {
  const hasData = data && data.length > 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isLow = payload[0].value <= payload[0].payload.lowThreshold;
      return (
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={`text-sm font-bold ${isLow ? 'text-destructive' : 'text-foreground'}`}>
            {payload[0].value} units
          </p>
          {isLow && (
            <p className="text-xs text-destructive">Low stock!</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl p-4 border border-primary/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Stock Levels
        </h3>
        <span className="text-xs text-muted-foreground">{hasData ? "Top 5 Items" : ""}</span>
      </div>
      {!hasData ? (
        <div className="h-32 flex flex-col items-center justify-center text-center">
          <Package className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs text-muted-foreground">No stock data</p>
          <p className="text-[10px] text-muted-foreground/60">Stock is managed by your IMS</p>
        </div>
      ) : (
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                interval={0}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="stock"
                radius={[4, 4, 0, 0]}
                fill="hsl(var(--primary))"
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const isLow = payload.stock <= payload.lowThreshold;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      rx={4}
                      ry={4}
                      fill={isLow ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
