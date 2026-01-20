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
import { supabase } from "@/integrations/supabase/client";
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
  Gift
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isOffline, setIsOffline] = useState(false);
  const [queuedCount] = useState(isOffline ? 3 : 0);
  const [bankLinked, setBankLinked] = useState(true);
  const [devicePaired, setDevicePaired] = useState(true);

  // Check setup status
  useEffect(() => {
    if (user) {
      checkSetupStatus();
    }
  }, [user]);

  const checkSetupStatus = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from("payout_settings")
        .select("bank_linked, device_paired")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data) {
        setBankLinked(data.bank_linked);
        setDevicePaired(data.device_paired);
      }
    } catch (e) {
      console.error("Failed to check setup status:", e);
    }
  };

  // Mock data
  const todayStats = {
    totalSales: 2450.0,
    salesCount: 12,
    refundsTotal: 50.0,
    netAmount: 2400.0,
  };

  const deviceStatus = {
    connected: devicePaired,
    battery: 85,
    name: "Patela Pro",
  };

  const quickServices = [
    { icon: Nfc, label: "Tap to Pay", desc: "Contactless" },
    { icon: Banknote, label: "Payouts", desc: "Next day" },
    { icon: Store, label: "My Sales", desc: "View all" },
    { icon: Gift, label: "Rewards", desc: "Coming soon" },
  ];

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      <OfflineBanner isOffline={isOffline} queuedCount={queuedCount} />

      {/* Header - Icon logo for small navigation areas */}
      <header className="bg-primary px-6 py-4 patela-shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PatelaLogo size="md" variant="light-icon" />
            <p className="text-xs text-primary-foreground/70">
              {new Date().toLocaleDateString("en-ZA", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          
          {/* Device Status */}
          <button 
            className="flex items-center gap-2 bg-primary-foreground/10 rounded-xl px-4 py-2 hover:bg-primary-foreground/20 transition-colors"
            onClick={() => navigate("/account")}
          >
            <Smartphone className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">{deviceStatus.name}</span>
            <div className="flex items-center gap-1 text-primary-foreground/70">
              <Battery className="h-4 w-4" />
              <span className="text-xs">{deviceStatus.battery}%</span>
            </div>
            {isOffline ? (
              <WifiOff className="h-4 w-4 text-warning" />
            ) : (
              <Wifi className="h-4 w-4 text-accent" />
            )}
          </button>
        </div>
      </header>

      <main className="px-5 py-5 space-y-5">
        {/* Setup Reminders (non-blocking) */}
        {(!bankLinked || !devicePaired) && (
          <div className="space-y-3 animate-patela-slide-up">
            {!bankLinked && <SetupReminder type="bank" />}
            {!devicePaired && <SetupReminder type="device" />}
          </div>
        )}

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
            onClick={() => navigate("/sales")}
          >
            <CreditCard className="h-6 w-6 text-accent" />
            <span className="text-sm font-medium">{t("salesHistory")}</span>
          </Button>
        </div>

        {/* Today's Summary */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.2s" }}>
          <TodayStats {...todayStats} />
        </div>

        {/* Charts - Side by Side */}
        <div className="grid grid-cols-2 gap-4 animate-patela-slide-up" style={{ animationDelay: "0.25s" }}>
          <SalesTrendChart />
          <StockLevelChart />
        </div>

        {/* Loan Offers */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.3s" }}>
          <LoanOffers 
            onApply={(offerId) => {
              toast({
                title: "Application Started",
                description: "We'll review your application and get back to you within 24 hours.",
              });
            }}
          />
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

        {/* Upgrade Banner */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.4s" }}>
          <button 
            className="w-full bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-4 flex items-center gap-4 text-left"
            onClick={() => navigate("/")}
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-primary-foreground">Upgrade to Patela Pro</p>
              <p className="text-sm text-primary-foreground/70">Get a printer & larger screen</p>
            </div>
            <ChevronRight className="h-5 w-5 text-primary-foreground/50" />
          </button>
        </div>

        {/* Payout Info */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.45s" }}>
          <div className="bg-success/10 rounded-2xl p-4 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Banknote className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Next payout</p>
                <p className="font-bold text-foreground">R2,400.00 <span className="text-sm font-normal text-success">Tomorrow</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Toggle for Offline */}
        <div className="pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setIsOffline(!isOffline)}
          >
            {isOffline ? "Simulate: Go Online" : "Simulate: Go Offline"}
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}