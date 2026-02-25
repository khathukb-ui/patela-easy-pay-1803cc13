import { useState, useEffect, useMemo } from "react";
import { BottomNav } from "@/components/patela/BottomNav";
import { SaleItem, SaleStatus } from "@/components/patela/SaleItem";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter, TrendingUp, Users, Banknote, X, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ordersApi, OrderResponse, ApiError } from "@/lib/api-client";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

type TimeRange = "today" | "week" | "month";

export default function Sales() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [showFilters, setShowFilters] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await ordersApi.list();
        setOrders(data);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Failed to load sales");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
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
    return orders.filter((o) => new Date(o.created_at) >= startDate);
  }, [timeRange, orders]);

  const stats = useMemo(() => {
    const paid = filteredOrders.filter((o) => o.status === "paid");
    const totalSales = paid.reduce((sum, o) => sum + o.total, 0);
    const totalFees = totalSales * 0.015;
    const netAmount = totalSales - totalFees;
    const avgSale = paid.length > 0 ? totalSales / paid.length : 0;
    return { totalSales, totalFees, netAmount, avgSale, salesCount: paid.length, refunds: filteredOrders.filter((o) => o.status === "cancelled").length };
  }, [filteredOrders]);

  const chartData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    const numDays = timeRange === "today" ? 1 : timeRange === "week" ? 7 : 30;
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 3600000);
      days[date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })] = 0;
    }
    filteredOrders.filter((o) => o.status === "paid").forEach((order) => {
      const key = new Date(order.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
      if (key in days) days[key] += order.total;
    });
    return Object.entries(days).map(([date, amount]) => ({ date, amount }));
  }, [filteredOrders, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen patela-app-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">Unable to load sales</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      {/* Header */}
      <header className="bg-primary px-4 py-3 patela-shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-primary-foreground">{t("salesHistory")}</h1>
          <div className="flex items-center gap-1">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto max-h-[60vh]">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Period</label>
                    <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={() => setShowFilters(false)}>Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          {(["today", "week", "month"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "secondary" : "ghost"}
              size="sm"
              className={timeRange === range ? "bg-primary-foreground text-primary font-medium" : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"}
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
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(value) => `R${value}`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number) => [`R${value.toFixed(2)}`, "Sales"]} />
                <Area type="monotone" dataKey="amount" stroke="hsl(var(--success))" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders List */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {filteredOrders.slice(0, 20).map((order) => (
              <div key={order.id} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.order_no}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">R{order.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    order.status === "paid" ? "bg-success/10 text-success" :
                    order.status === "failed" ? "bg-destructive/10 text-destructive" :
                    "bg-warning/10 text-warning"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
