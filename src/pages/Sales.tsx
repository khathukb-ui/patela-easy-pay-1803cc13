import { useState, useEffect, useMemo, useCallback } from "react";
import { BottomNav } from "@/components/patela/BottomNav";
import { Button } from "@/components/ui/button";
import { Download, Filter, TrendingUp, Users, Banknote, X, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { RefundModal } from "@/components/patela/RefundModal";
import { getRefundMetrics } from "@/services/refund-service";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";

type TimeRange = "today" | "week" | "month";

interface SaleRecord {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  note: string | null;
  created_at: string;
}

export default function Sales() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [showFilters, setShowFilters] = useState(false);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refundSale, setRefundSale] = useState<SaleRecord | null>(null);
  const [refundMetrics, setRefundMetrics] = useState({ totalRefunds: 0, refundCount: 0, partialCount: 0, failedCount: 0 });

  const fetchSales = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      setSales(data || []);

      // Fetch refund metrics
      const metrics = await getRefundMetrics(user.id);
      setRefundMetrics(metrics);
    } catch (e: any) {
      setError(e.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

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
    return sales.filter((s) => new Date(s.created_at) >= startDate);
  }, [timeRange, sales]);

  const stats = useMemo(() => {
    const successful = filteredSales.filter((s) => s.status === "success");
    const totalSales = successful.reduce((sum, s) => sum + Number(s.amount), 0);
    const totalFees = totalSales * 0.015;
    const netAmount = totalSales - totalFees - refundMetrics.totalRefunds;
    const avgSale = successful.length > 0 ? totalSales / successful.length : 0;
    return {
      totalSales,
      totalFees,
      netAmount,
      avgSale,
      salesCount: successful.length,
      refunds: filteredSales.filter((s) => s.status === "refunded" || s.status === "partially_refunded").length,
    };
  }, [filteredSales, refundMetrics]);

  const chartData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = new Date();
    const numDays = timeRange === "today" ? 1 : timeRange === "week" ? 7 : 30;
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 3600000);
      days[date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" })] = 0;
    }
    filteredSales
      .filter((s) => s.status === "success")
      .forEach((sale) => {
        const key = new Date(sale.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
        if (key in days) days[key] += Number(sale.amount);
      });
    return Object.entries(days).map(([date, amount]) => ({ date, amount }));
  }, [filteredSales, timeRange]);

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      success: { bg: "bg-success/10", text: "text-success", label: "Success" },
      failed: { bg: "bg-destructive/10", text: "text-destructive", label: "Failed" },
      refunded: { bg: "bg-destructive/10", text: "text-destructive", label: "Refunded" },
      partially_refunded: { bg: "bg-warning/10", text: "text-warning", label: "Partial Refund" },
      pending: { bg: "bg-warning/10", text: "text-warning", label: "Pending" },
    };
    const s = map[status] || { bg: "bg-muted", text: "text-muted-foreground", label: status };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const canRefund = (sale: SaleRecord) =>
    sale.payment_method === "card" &&
    (sale.status === "success" || sale.status === "partially_refunded");

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
      <div className="min-h-screen patela-app-bg flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] items-center justify-center px-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-bold text-foreground mb-2">Unable to load sales</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchSales}>Try Again</Button>
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
            <p className="text-xs text-muted-foreground">After fees & refunds</p>
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
              <RotateCcw className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Refunds</span>
            </div>
            <p className="text-xl font-bold text-foreground">{stats.refunds}</p>
            {refundMetrics.totalRefunds > 0 && (
              <p className="text-xs text-destructive">-R{refundMetrics.totalRefunds.toFixed(2)}</p>
            )}
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
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
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

        {/* Sales List */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Sales</h3>
          <div className="space-y-2">
            {filteredSales.slice(0, 50).map((sale) => (
              <div key={sale.id} className="bg-card rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {sale.note || sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1) + " Payment"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sale.created_at).toLocaleString("en-ZA", { dateStyle: "short", timeStyle: "short" })}
                      {" · "}
                      {sale.payment_method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">R{Number(sale.amount).toFixed(2)}</p>
                    {getStatusBadge(sale.status)}
                  </div>
                </div>
                {/* Refund button for eligible card transactions */}
                {canRefund(sale) && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1.5 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
                      onClick={() => setRefundSale(sale)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Refund
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sales found for this period</p>
            </div>
          )}
        </div>
      </main>

      {/* Refund Modal */}
      {refundSale && (
        <RefundModal
          open={!!refundSale}
          onOpenChange={(open) => { if (!open) setRefundSale(null); }}
          sale={refundSale}
          onRefundComplete={fetchSales}
        />
      )}

      <BottomNav />
    </div>
  );
}
