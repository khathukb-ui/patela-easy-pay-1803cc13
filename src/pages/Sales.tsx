import { useState, useMemo } from "react";
import { BottomNav } from "@/components/patela/BottomNav";
import { SaleItem, SaleStatus } from "@/components/patela/SaleItem";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter, TrendingUp, Users, Banknote, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Sale {
  id: string;
  amount: number;
  timestamp: Date;
  status: SaleStatus;
  lastFourDigits?: string;
  note?: string;
  paymentMethod?: "card" | "cash" | "qr" | "other";
  cashierId?: string;
}

// Mock data - generate more for better graphs
const generateMockSales = (): Sale[] => {
  const sales: Sale[] = [];
  const now = new Date();
  const statuses: SaleStatus[] = ["success", "success", "success", "success", "queued", "refunded", "failed"];
  const methods: ("card" | "cash" | "qr" | "other")[] = ["card", "card", "card", "cash", "qr"];
  const notes = ["Bread & milk", "Groceries", "Phone airtime", "Lunch", "Snacks", undefined, undefined];
  
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now.getTime() - (daysAgo * 24 + hoursAgo) * 3600000);
    
    sales.push({
      id: `sale-${i}`,
      amount: Math.floor(Math.random() * 500) + 20,
      timestamp,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastFourDigits: Math.random() > 0.3 ? String(Math.floor(Math.random() * 10000)).padStart(4, "0") : undefined,
      note: notes[Math.floor(Math.random() * notes.length)],
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
    });
  }
  
  return sales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const mockSales = generateMockSales();

type TimeRange = "today" | "week" | "month";
type PaymentMethodFilter = "all" | "card" | "cash" | "qr" | "other";

export default function Sales() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethodFilter>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter sales based on time range
  const filteredSales = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 3600000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 3600000);
        break;
    }
    
    return mockSales.filter(sale => {
      const inTimeRange = sale.timestamp >= startDate;
      const matchesMethod = paymentMethodFilter === "all" || sale.paymentMethod === paymentMethodFilter;
      return inTimeRange && matchesMethod;
    });
  }, [timeRange, paymentMethodFilter]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const successful = filteredSales.filter(s => s.status === "success");
    const totalSales = successful.reduce((sum, s) => sum + s.amount, 0);
    const totalFees = totalSales * 0.015; // 1.5% example fee
    const netAmount = totalSales - totalFees;
    const avgSale = successful.length > 0 ? totalSales / successful.length : 0;
    
    return {
      totalSales,
      totalFees,
      netAmount,
      avgSale,
      salesCount: successful.length,
      refunds: filteredSales.filter(s => s.status === "refunded").length,
    };
  }, [filteredSales]);

  // Generate chart data
  const chartData = useMemo(() => {
    const days: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize days
    const numDays = timeRange === "today" ? 1 : timeRange === "week" ? 7 : 30;
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 3600000);
      const key = date.toLocaleDateString("en-ZA", { 
        day: "numeric", 
        month: timeRange === "month" ? "numeric" : "short" 
      });
      days[key] = 0;
    }
    
    // Sum sales by day
    filteredSales
      .filter(s => s.status === "success")
      .forEach(sale => {
        const key = sale.timestamp.toLocaleDateString("en-ZA", { 
          day: "numeric", 
          month: timeRange === "month" ? "numeric" : "short" 
        });
        if (key in days) {
          days[key] += sale.amount;
        }
      });
    
    return Object.entries(days).map(([date, amount]) => ({ date, amount }));
  }, [filteredSales, timeRange]);

  // Payment method breakdown
  const methodBreakdown = useMemo(() => {
    const breakdown: { [key: string]: number } = { card: 0, cash: 0, qr: 0, other: 0 };
    filteredSales
      .filter(s => s.status === "success")
      .forEach(sale => {
        breakdown[sale.paymentMethod || "other"] += sale.amount;
      });
    return Object.entries(breakdown)
      .filter(([_, amount]) => amount > 0)
      .map(([method, amount]) => ({ method, amount }));
  }, [filteredSales]);

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      {/* Header */}
      <header className="bg-primary px-4 py-3 patela-shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-primary-foreground">{t("salesHistory")}</h1>
          <div className="flex items-center gap-1">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto max-h-[60vh]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Period</label>
                    <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <Select value={paymentMethodFilter} onValueChange={(v) => setPaymentMethodFilter(v as PaymentMethodFilter)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="qr">QR Code</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(["today", "week", "month"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "secondary" : "ghost"}
              size="sm"
              className={timeRange === range 
                ? "bg-primary-foreground text-primary font-medium" 
                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              }
              onClick={() => setTimeRange(range)}
            >
              {range === "today" ? "Today" : range === "week" ? "7 Days" : "30 Days"}
            </Button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Total Sales</span>
            </div>
            <p className="text-xl font-bold text-success">R{stats.totalSales.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{stats.salesCount} transactions</p>
          </div>
          
          <div className="bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Banknote className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">Net Amount</span>
            </div>
            <p className="text-xl font-bold text-foreground">R{stats.netAmount.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">After R{stats.totalFees.toFixed(2)} fees</p>
          </div>
          
          <div className="bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg Sale</span>
            </div>
            <p className="text-xl font-bold text-foreground">R{stats.avgSale.toFixed(2)}</p>
          </div>
          
          <div className="bg-card rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <X className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Refunds</span>
            </div>
            <p className="text-xl font-bold text-foreground">{stats.refunds}</p>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Sales Trend</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                  formatter={(value: number) => [`R${value.toFixed(2)}`, "Sales"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--success))" 
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        {methodBreakdown.length > 0 && (
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">By Payment Method</h3>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={methodBreakdown} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    type="category" 
                    dataKey="method" 
                    tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px"
                    }}
                    formatter={(value: number) => [`R${value.toFixed(2)}`, "Amount"]}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="hsl(var(--primary))" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Transactions</h3>
          <div className="space-y-2">
            {filteredSales.slice(0, 15).map((sale) => (
              <SaleItem
                key={sale.id}
                {...sale}
                onClick={() => console.log("View sale", sale.id)}
              />
            ))}
          </div>
          
          {filteredSales.length > 15 && (
            <Button variant="outline" className="w-full mt-3">
              View All ({filteredSales.length} transactions)
            </Button>
          )}
          
          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
