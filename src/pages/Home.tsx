import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { OfflineBanner } from "@/components/patela/OfflineBanner";
import { TodayStats } from "@/components/patela/TodayStats";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { Button } from "@/components/ui/button";
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
  const [isOffline, setIsOffline] = useState(false);
  const [queuedCount] = useState(isOffline ? 3 : 0);

  // Mock data
  const todayStats = {
    totalSales: 2450.0,
    salesCount: 12,
    refundsTotal: 50.0,
    netAmount: 2400.0,
  };

  const deviceStatus = {
    connected: true,
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

      {/* Header */}
      <header className="bg-primary px-6 py-4 patela-shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <PatelaLogo size="md" variant="light" />
            <p className="text-sm text-primary-foreground/70">
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

      <main className="px-4 py-4 space-y-4">
        {/* Take Payment - Primary CTA */}
        <div className="animate-patela-slide-up">
          <Button
            variant="hero"
            size="xl"
            className="w-full h-20 text-xl animate-patela-pulse"
            onClick={() => navigate("/payment")}
          >
            <CreditCard className="h-7 w-7 mr-2" />
            {t("takePayment")}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button
            variant="outline"
            className="h-16 flex-col gap-1 border-primary/20 hover:border-accent/50 hover:bg-accent/5"
            onClick={() => navigate("/payment-link")}
          >
            <QrCode className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">Payment Link</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col gap-1 border-primary/20 hover:border-accent/50 hover:bg-accent/5"
            onClick={() => navigate("/sales")}
          >
            <CreditCard className="h-5 w-5 text-accent" />
            <span className="text-sm font-medium">{t("salesHistory")}</span>
          </Button>
        </div>

        {/* Today's Summary */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.2s" }}>
          <TodayStats {...todayStats} />
        </div>

        {/* Quick Services */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.25s" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-primary uppercase tracking-wide">Services</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {quickServices.map((service) => (
              <button 
                key={service.label}
                className="flex flex-col items-center p-2 bg-card rounded-xl border border-primary/10 hover:bg-accent/5 hover:border-accent/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mb-1">
                  <service.icon className="h-4 w-4 text-accent" />
                </div>
                <span className="text-[11px] font-medium text-foreground">{service.label}</span>
                <span className="text-[9px] text-muted-foreground">{service.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upgrade Banner */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.3s" }}>
          <button 
            className="w-full bg-gradient-to-r from-primary to-primary/80 rounded-xl p-3 flex items-center gap-3 text-left"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-primary-foreground text-sm">Upgrade to Patela Pro</p>
              <p className="text-xs text-primary-foreground/70">Get a printer & larger screen</p>
            </div>
            <ChevronRight className="h-4 w-4 text-primary-foreground/50 flex-shrink-0" />
          </button>
        </div>

        {/* Payout Info */}
        <div className="animate-patela-slide-up" style={{ animationDelay: "0.35s" }}>
          <div className="bg-success/10 rounded-xl p-3 border border-success/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Banknote className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Next payout</p>
                <p className="font-bold text-sm text-foreground">R2,400.00 <span className="text-xs font-normal text-success">Tomorrow</span></p>
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