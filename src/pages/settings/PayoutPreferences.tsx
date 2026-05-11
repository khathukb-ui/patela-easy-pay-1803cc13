import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/patela/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Zap, 
  Clock, 
  Banknote,
  Check,
  AlertCircle,
  Loader2,
  Info
} from "lucide-react";
import { toast } from "sonner";

interface PayoutSettings {
  payout_speed: "same_day" | "24_hours";
  same_day_fee_percent: number;
  standard_fee_percent: number;
  bank_linked: boolean;
}

export default function PayoutPreferences() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [settings, setSettings] = useState<PayoutSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState<"same_day" | "24_hours">("24_hours");

  // Example amount for fee calculation preview
  const exampleAmount = 1000;

  useEffect(() => {
    if (user) {
      fetchPayoutSettings();
    }
  }, [user]);

  const fetchPayoutSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("payout_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setSettings(data as PayoutSettings);
        setSelectedSpeed(data.payout_speed as "same_day" | "24_hours");
      }
    } catch (e) {
      console.error("Failed to fetch payout settings:", e);
      toast.error("Failed to load payout settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !settings) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from("payout_settings")
        .update({ payout_speed: selectedSpeed })
        .eq("user_id", user.id);
      
      if (error) throw error;
      
      setSettings({ ...settings, payout_speed: selectedSpeed });
      toast.success("Payout preference updated");
    } catch (e) {
      console.error("Failed to update payout settings:", e);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const calculateFee = (amount: number, feePercent: number) => {
    return (amount * feePercent) / 100;
  };

  const calculateNet = (amount: number, feePercent: number) => {
    return amount - calculateFee(amount, feePercent);
  };

  if (loading) {
    return (
      <div className="min-h-screen patela-app-bg flex items-center justify-center pb-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <BottomNav />
      </div>
    );
  }

  const sameDayFee = settings?.same_day_fee_percent || 2.5;
  const standardFee = settings?.standard_fee_percent || 1.0;

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      {/* Header */}
      <header className="bg-primary px-4 py-4 patela-shadow-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/account")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">Payout Preferences</h1>
            <p className="text-sm text-primary-foreground/70">Choose when to get paid</p>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Bank Link Warning */}
        {!settings?.bank_linked && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Bank account not linked</p>
              <p className="text-sm text-muted-foreground mb-2">
                Link your bank account to receive payouts.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate("/bank/start")}
              >
                Link Bank Account
              </Button>
            </div>
          </div>
        )}

        {/* Trust Account Info */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Same-day payouts available</p>
            <p className="text-sm text-muted-foreground">
              Same-day payouts are supported by Patela's settlement process, so you can access your money faster.
            </p>
          </div>
        </div>

        {/* Payout Speed Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Select Payout Speed</h3>
          
          {/* Same Day Option */}
          <button
            className={`w-full bg-card rounded-xl p-4 border-2 text-left transition-colors ${
              selectedSpeed === "same_day" 
                ? "border-accent bg-accent/5" 
                : "border-border hover:border-primary/30"
            }`}
            onClick={() => setSelectedSpeed("same_day")}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedSpeed === "same_day" ? "bg-accent/20" : "bg-primary/10"
              }`}>
                <Zap className={`h-6 w-6 ${selectedSpeed === "same_day" ? "text-accent" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-foreground">Same-Day Payout</p>
                  {selectedSpeed === "same_day" && (
                    <Check className="h-5 w-5 text-accent" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Get your money today before 6PM
                </p>
                <div className="bg-muted rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Fee: {sameDayFee}%</p>
                </div>
              </div>
            </div>
          </button>

          {/* 24 Hours Option */}
          <button
            className={`w-full bg-card rounded-xl p-4 border-2 text-left transition-colors ${
              selectedSpeed === "24_hours" 
                ? "border-accent bg-accent/5" 
                : "border-border hover:border-primary/30"
            }`}
            onClick={() => setSelectedSpeed("24_hours")}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedSpeed === "24_hours" ? "bg-accent/20" : "bg-primary/10"
              }`}>
                <Clock className={`h-6 w-6 ${selectedSpeed === "24_hours" ? "text-accent" : "text-primary"}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-foreground">Next-Day Payout</p>
                  {selectedSpeed === "24_hours" && (
                    <Check className="h-5 w-5 text-accent" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Receive your money by tomorrow morning
                </p>
                <div className="bg-muted rounded-lg p-2">
                  <p className="text-xs text-muted-foreground">Fee: {standardFee}%</p>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Fee Calculation Preview */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            Example Calculation
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            For a R{exampleAmount.toFixed(2)} sale:
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gross Amount</span>
              <span className="font-medium text-foreground">R{exampleAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Fee ({selectedSpeed === "same_day" ? sameDayFee : standardFee}%)
              </span>
              <span className="font-medium text-destructive">
                -R{calculateFee(exampleAmount, selectedSpeed === "same_day" ? sameDayFee : standardFee).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold text-foreground">You Receive</span>
              <span className="font-bold text-success text-lg">
                R{calculateNet(exampleAmount, selectedSpeed === "same_day" ? sameDayFee : standardFee).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {selectedSpeed !== settings?.payout_speed && (
          <div className="pt-4">
            <Button
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Preference"
              )}
            </Button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
