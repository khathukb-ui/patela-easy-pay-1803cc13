import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TestPaymentSimulator } from "@/components/paygate/TestPaymentSimulator";
import {
  BarChart3, CreditCard, Banknote, Key, Settings, LogOut, Home,
  AlertCircle, CheckCircle2, Clock, TrendingUp, ArrowUpRight, FileText
} from "lucide-react";

interface Merchant {
  id: string;
  business_name: string;
  status: string;
  is_live_enabled: boolean;
  environment: string;
}

interface Stats {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
  pendingPayouts: number;
}

export default function PaygateDashboard() {
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [environment, setEnvironment] = useState<"sandbox" | "live">("sandbox");
  const [stats, setStats] = useState<Stats>({ totalTransactions: 0, totalVolume: 0, successRate: 0, pendingPayouts: 0 });
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [environment]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/paygate/auth"); return; }

    const { data: m } = await supabase.from("merchants").select("*").eq("user_id", user.id).maybeSingle();
    if (!m) { navigate("/paygate/auth"); return; }

    setMerchant(m as Merchant);
    setEnvironment((m as Merchant).environment as "sandbox" | "live");

    // Fetch transactions for current environment
    const { data: txns } = await supabase
      .from("merchant_transactions")
      .select("*")
      .eq("merchant_id", (m as Merchant).id)
      .eq("environment", environment)
      .order("created_at", { ascending: false })
      .limit(10);

    setRecentTxns(txns || []);

    // Calculate stats
    const { data: allTxns } = await supabase
      .from("merchant_transactions")
      .select("amount, status")
      .eq("merchant_id", (m as Merchant).id)
      .eq("environment", environment);

    const total = allTxns?.length || 0;
    const successful = allTxns?.filter(t => t.status === "success") || [];
    const volume = successful.reduce((sum, t) => sum + Number(t.amount), 0);

    const { data: payouts } = await supabase
      .from("merchant_payouts")
      .select("amount")
      .eq("merchant_id", (m as Merchant).id)
      .eq("status", "pending");

    setStats({
      totalTransactions: total,
      totalVolume: volume,
      successRate: total > 0 ? Math.round((successful.length / total) * 100) : 0,
      pendingPayouts: payouts?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
    });

    setLoading(false);
  };

  const handleToggleEnvironment = async () => {
    if (!merchant) return;
    if (environment === "sandbox" && !merchant.is_live_enabled) {
      toast.error("Your account must be verified before switching to live mode");
      return;
    }
    const newEnv = environment === "sandbox" ? "live" : "sandbox";
    await supabase.from("merchants").update({ environment: newEnv }).eq("id", merchant.id);
    setEnvironment(newEnv);
    toast.success(`Switched to ${newEnv} mode`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/paygate");
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-warning/10", text: "text-warning" },
      under_review: { bg: "bg-accent/10", text: "text-accent" },
      approved: { bg: "bg-success/10", text: "text-success" },
      rejected: { bg: "bg-destructive/10", text: "text-destructive" },
      success: { bg: "bg-success/10", text: "text-success" },
      failed: { bg: "bg-destructive/10", text: "text-destructive" },
    };
    const s = map[status] || map.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text} capitalize`}>{status.replace("_", " ")}</span>;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" /></div>;
  }

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/paygate/dashboard", active: true },
    { icon: CreditCard, label: "Transactions", path: "/paygate/transactions" },
    { icon: Banknote, label: "Payouts", path: "/paygate/payouts" },
    { icon: Key, label: "API Keys", path: "/paygate/api-keys" },
    { icon: FileText, label: "Documents", path: "/paygate/onboarding" },
    { icon: Settings, label: "Settings", path: "/paygate/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <PatelaLogo size="sm" />
            <span className="text-accent font-bold text-sm">PayGate</span>
          </div>
          {merchant && <p className="text-xs text-muted-foreground mt-2 truncate">{merchant.business_name}</p>}
        </div>

        {/* Environment Toggle */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${environment === "live" ? "bg-success animate-pulse" : "bg-warning"}`} />
              <span className="text-sm font-medium text-foreground capitalize">{environment}</span>
            </div>
            <Switch
              checked={environment === "live"}
              onCheckedChange={handleToggleEnvironment}
              disabled={!merchant?.is_live_enabled && environment === "sandbox"}
            />
          </div>
          {environment === "sandbox" && (
            <p className="text-xs text-muted-foreground mt-1">Test mode — no real charges</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar mobile */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <PatelaLogo size="sm" />
            <span className="text-accent font-bold text-xs">PayGate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${environment === "live" ? "bg-success" : "bg-warning"}`} />
            <span className="text-xs font-medium capitalize">{environment}</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 max-w-5xl">
          {/* Verification Banner */}
          {merchant?.status === "pending" && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Complete your verification</p>
                <p className="text-xs text-muted-foreground">Submit your KYC documents to unlock live payments.</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => navigate("/paygate/onboarding")}>
                  Complete KYC
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          {merchant?.status === "under_review" && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3 mb-6">
              <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Application under review</p>
                <p className="text-xs text-muted-foreground">We're verifying your documents. This typically takes 24-48 hours.</p>
              </div>
            </div>
          )}
          {merchant?.status === "approved" && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3 mb-6">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground text-sm">Account verified</p>
                <p className="text-xs text-muted-foreground">You can now switch to live mode and start accepting real payments.</p>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

          {/* Test Payment Simulator */}
          {merchant && (
            <TestPaymentSimulator
              merchantId={merchant.id}
              environment={environment}
              onTransactionCreated={fetchData}
            />
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Transactions", value: stats.totalTransactions.toLocaleString(), icon: CreditCard, color: "text-primary" },
              { label: "Total Volume", value: `R${stats.totalVolume.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-success" },
              { label: "Success Rate", value: `${stats.successRate}%`, icon: CheckCircle2, color: "text-accent" },
              { label: "Pending Payouts", value: `R${stats.pendingPayouts.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`, icon: Banknote, color: "text-warning" },
            ].map(stat => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Recent Transactions</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/paygate/transactions")}>
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            {recentTxns.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No transactions yet. {environment === "sandbox" ? "Use your test API keys to create test transactions." : "Start accepting payments to see transactions here."}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentTxns.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{txn.reference || txn.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {statusBadge(txn.status)}
                      <p className="font-semibold text-foreground">R{Number(txn.amount).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2">
          {[
            { icon: Home, label: "Home", path: "/paygate/dashboard" },
            { icon: CreditCard, label: "Txns", path: "/paygate/transactions" },
            { icon: Banknote, label: "Payouts", path: "/paygate/payouts" },
            { icon: Key, label: "API", path: "/paygate/api-keys" },
            { icon: Settings, label: "Settings", path: "/paygate/settings" },
          ].map(item => (
            <button key={item.label} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-accent transition-colors p-1">
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
