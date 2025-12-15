import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { OfflineBanner } from "@/components/patela/OfflineBanner";
import { TodayStats } from "@/components/patela/TodayStats";
import { Button } from "@/components/ui/button";
import { CreditCard, QrCode, Smartphone, Battery, Wifi, WifiOff } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
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
    name: "Patela-7823",
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <OfflineBanner isOffline={isOffline} queuedCount={queuedCount} />

      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 patela-shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Patela</h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-ZA", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </p>
          </div>
          
          {/* Device Status */}
          <button 
            className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2"
            onClick={() => navigate("/account")}
          >
            <Smartphone className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{deviceStatus.name}</span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Battery className="h-4 w-4" />
              <span className="text-xs">{deviceStatus.battery}%</span>
            </div>
            {isOffline ? (
              <WifiOff className="h-4 w-4 text-warning" />
            ) : (
              <Wifi className="h-4 w-4 text-success" />
            )}
          </button>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        {/* Take Payment - Primary CTA */}
        <div className="animate-patela-slide-up">
          <Button
            variant="hero"
            size="xl"
            className="w-full h-24 text-2xl animate-patela-pulse"
            onClick={() => navigate("/payment")}
          >
            <CreditCard className="h-8 w-8 mr-3" />
            Take Payment
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate("/payment-link")}
          >
            <QrCode className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Payment Link</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2"
            onClick={() => navigate("/sales")}
          >
            <CreditCard className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Recent Sales</span>
          </Button>
        </div>

        {/* Today's Summary */}
        <div style={{ animationDelay: "0.2s" }}>
          <TodayStats {...todayStats} />
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
