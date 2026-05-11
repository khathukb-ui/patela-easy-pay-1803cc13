import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";

interface TestPaymentSimulatorProps {
  merchantId: string;
  environment: "sandbox" | "live";
  onTransactionCreated: () => void;
}

export function TestPaymentSimulator({ merchantId, environment, onTransactionCreated }: TestPaymentSimulatorProps) {
  const [amount, setAmount] = useState("100.00");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    if (environment !== "sandbox") {
      toast.error("Test payments can only be made in sandbox mode");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Get the merchant's sandbox API key
      const { data: apiKey } = await supabase
        .from("merchant_api_keys")
        .select("public_key")
        .eq("merchant_id", merchantId)
        .eq("environment", "sandbox")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();

      if (!apiKey) {
        toast.error("No sandbox API key found. Generate one from API Keys page.");
        setLoading(false);
        return;
      }

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/process-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey.public_key,
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: "ZAR",
            reference: `TEST-${Date.now()}`,
            customer_name: "Test Customer",
            customer_email: "test@example.com",
            payment_method: "card",
          }),
        }
      );

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(`Test payment of R${amount} processed successfully!`);
      } else if (data.transaction?.status === "pending") {
        toast.info("Payment is pending");
      } else {
        toast.error(data.failure_reason || "Payment failed");
      }

      onTransactionCreated();
    } catch (err) {
      toast.error("Failed to process test payment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (environment !== "sandbox") return null;

  const statusIcon = result?.transaction?.status === "success"
    ? <CheckCircle2 className="h-4 w-4 text-success" />
    : result?.transaction?.status === "failed"
    ? <XCircle className="h-4 w-4 text-destructive" />
    : result?.transaction?.status === "pending"
    ? <Clock className="h-4 w-4 text-warning" />
    : null;

  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-8">
      <h3 className="font-semibold text-foreground mb-1">🧪 Test Payment Simulator</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Send a test payment through your sandbox API to verify your integration works.
      </p>

      <div className="flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[120px]">
          <label className="text-xs text-muted-foreground mb-1 block">Amount (ZAR)</label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            className="bg-background"
          />
        </div>
        <div className="flex gap-2">
          {[10, 50, 100, 250].map((v) => (
            <Button
              key={v}
              size="sm"
              variant="outline"
              onClick={() => setAmount(v.toFixed(2))}
              className="text-xs"
            >
              R{v}
            </Button>
          ))}
        </div>
        <Button onClick={runTest} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Send Test Payment
        </Button>
      </div>

      {/* Test hints */}
      <div className="mt-3 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <strong>Test amounts:</strong> R0.01 = failed payment · R0.02 = pending payment · Any other = success
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 bg-muted/30 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-2">
            {statusIcon}
            <span className="font-medium text-sm capitalize">{result.transaction?.status || "error"}</span>
            {result.transaction?.reference && (
              <span className="text-xs text-muted-foreground ml-auto font-mono">{result.transaction.reference}</span>
            )}
          </div>
          <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
