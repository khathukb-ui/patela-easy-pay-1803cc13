import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { OfflineBanner } from "@/components/patela/OfflineBanner";
import { TodayStats } from "@/components/patela/TodayStats";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { SetupReminder } from "@/components/patela/SetupReminder";
import { SalesTrendChart } from "@/components/patela/SalesTrendChart";
import { StockLevelChart } from "@/components/patela/StockLevelChart";
import { LoanOffers } from "@/components/patela/LoanOffers";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ordersApi, ApiError } from "@/lib/api-client";
import { getRefundMetrics } from "@/services/refund-service";
import { toast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Battery, 
  Wifi, 
  WifiOff, 
  Zap, 
  ChevronRight,
  Nfc,
  Store,
  Banknote,
  Gift,
  ScanBarcode,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    totalSales: 0,
    salesCount: 0,
    refundsTotal: 0,
    netAmount: 0,
  });

  // Listen for online/offline
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Fetch today's stats from orders API
  useEffect(() => {
    async function fetchStats() {
      try {
        const orders = await ordersApi.list();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = orders.filter(
          (o) => new Date(o.created_at) >= today && o.status === "paid"
        );

        const totalSales = todayOrders.reduce((sum, o) => sum + o.total, 0);

        // Fetch refund totals for today
        let refundsTotal = 0;
        try {
          const metrics = await getRefundMetrics(user!.id, today);
          refundsTotal = metrics.totalRefunds;
        } catch (e) {
          console.error("Failed to fetch refund metrics:", e);
        }

        setTodayStats({
          totalSales,
          salesCount: todayOrders.length,
          refundsTotal,
          netAmount: totalSales - refundsTotal,
        });
      } catch (e) {
        // Backend unavailable — show zeros, not mock data
        console.error("Failed to fetch stats:", e);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchStats();
    else setLoading(false);
  }, [user]);

  const quickServices = [
    { icon: Nfc, label: "Tap to Pay", desc: "Contactless" },
    { icon: Banknote, label: "Payouts", desc: "Next day" },
    { icon: Store, label: "My Sales", desc: "View all" },
    { icon: Gift, label: "Rewards", desc: "Coming soon" },
  ];

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      <OfflineBanner isOffline={isOffline} queuedCount={0} />

      {/* Header */}
      <header className="bg-primary px-6 py-4 patela-shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PatelaLogo size="md" variant="icon" />
            <p className="text-xs text-primary-foreground/70">
              {new Date().toLocaleDateString("en-ZA", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          
          <button 
            className="flex items-center gap-2 bg-primary-foreground/10 rounded-xl px-4 py-2 hover:bg-primary-foreground/20 transition-colors"
            onClick={() => navigate("/account")}
          >
            <Smartphone className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">
              {user?.full_name?.split(" ")[0] || "Account"}
            </span>
            {isOffline ? (
              <WifiOff className="h-4 w-4 text-warning" />
            ) : (
              <Wifi className="h-4 w-4 text-accent" />
            )}
          </button>
        </div>
      </header>

      <main className="px-5 py-5 space-y-5">
        {/* Take Payment - Primary CTA */}
        <div className="animate-patela-slide-up">
          <Button
            variant="hero"
            size="xl"
            className="w-full h-24 text-2xl animate-patela-pulse"
            onClick={() => navigate("/payment")}
          >
            <CreditCard className="h-8 w-8 mr-3" />
            {t("takePayment")}
          </Button>
        </div>

        <div className="animate-patela-slide-up">
          <Button
            variant="hero"
            size="xl"
            className="w-full h-24 text-2xl animate-patela-pulse"
            onClick={() => navigate("/inventory-scanner")}
          >
            <ScanBarcode className="h-8 w-8 mr-3" />
            {t("startPicking")}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-primary/20 hover:border-accent/50 hover:bg-accent/5"
            onClick={() => navigate("/payment-link")}
          >
            <QrCode className="h-6 w-6 text-accent" />
            <span className="text-sm font-medium">Payment Link</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 border-primary/20 hover:border-accent/50 hover:bg-accent/5"
            onClick={() => navigate("/inventory-scanner")}
          >
            <ScanBarcode className="h-6 w-6 text-accent" />
            <span className="text-sm font-medium">IMS Scan</span>
          </Button>
        </div>

        {/* Today's Summary */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.2s" }}>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TodayStats {...todayStats} />
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4 animate-patela-slide-up" style={{ animationDelay: "0.25s" }}>
          <SalesTrendChart />
          <StockLevelChart />
        </div>

        {/* Quick Services */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.35s" }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">Services</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {quickServices.map((service) => (
              <button 
                key={service.label}
                className="flex flex-col items-center p-3 bg-card rounded-xl border border-primary/10 hover:bg-accent/5 hover:border-accent/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                  <service.icon className="h-5 w-5 text-accent" />
                </div>
                <span className="text-xs font-medium text-foreground">{service.label}</span>
                <span className="text-[10px] text-muted-foreground">{service.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
