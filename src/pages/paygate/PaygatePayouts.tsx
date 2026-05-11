import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Plus, Banknote, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function PaygatePayouts() {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  // Payout form
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: merchant } = await supabase.from("merchants").select("id").eq("user_id", user.id).single();
    if (!merchant) return;
    setMerchantId(merchant.id);

    // Fetch payouts
    const { data: p } = await supabase.from("merchant_payouts").select("*").eq("merchant_id", merchant.id).order("requested_at", { ascending: false });
    setPayouts(p || []);

    // Calculate available balance (successful txns - completed payouts)
    const { data: txns } = await supabase.from("merchant_transactions").select("amount").eq("merchant_id", merchant.id).eq("status", "success");
    const totalRevenue = txns?.reduce((s, t) => s + Number(t.amount), 0) || 0;

    const { data: completedPayouts } = await supabase.from("merchant_payouts").select("amount").eq("merchant_id", merchant.id).in("status", ["completed", "processing", "pending"]);
    const totalPaidOut = completedPayouts?.reduce((s, p) => s + Number(p.amount), 0) || 0;

    // Apply 2.9% + R2 fee estimate
    const fees = txns ? txns.reduce((s, t) => s + (Number(t.amount) * 0.029 + 2), 0) : 0;
    setBalance(Math.max(0, totalRevenue - fees - totalPaidOut));

    setLoading(false);
  };

  const handleRequestPayout = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > balance) { toast.error("Insufficient balance"); return; }
    if (!bankName || !accountNumber || !branchCode || !accountHolder) {
      toast.error("Please fill in all bank details"); return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("merchant_payouts").insert({
        merchant_id: merchantId!,
        amount: amt,
        bank_name: bankName,
        account_number: accountNumber,
        branch_code: branchCode,
        account_holder: accountHolder,
        reference: `PO-${Date.now().toString(36).toUpperCase()}`,
      });
      if (error) throw error;

      toast.success("Payout requested successfully");
      setDialogOpen(false);
      setAmount(""); setBankName(""); setAccountNumber(""); setBranchCode(""); setAccountHolder("");
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Failed to request payout");
    } finally {
      setSubmitting(false);
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "processing": return <Clock className="h-4 w-4 text-accent" />;
      case "failed": return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => navigate("/paygate/dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Payouts</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Plus className="mr-2 h-4 w-4" /> Request Payout
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Payout</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="bg-success/10 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">Available Balance</p>
                  <p className="text-2xl font-bold text-success">R{balance.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Amount (ZAR)</Label>
                  <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <div>
                  <Label>Bank Name</Label>
                  <Input placeholder="e.g. FNB, Capitec, Standard Bank" value={bankName} onChange={e => setBankName(e.target.value)} />
                </div>
                <div>
                  <Label>Account Holder Name</Label>
                  <Input placeholder="Full name on account" value={accountHolder} onChange={e => setAccountHolder(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Account Number</Label>
                    <Input placeholder="Account number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                  </div>
                  <div>
                    <Label>Branch Code</Label>
                    <Input placeholder="Branch code" value={branchCode} onChange={e => setBranchCode(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" disabled={submitting} onClick={handleRequestPayout}>
                  {submitting ? "Processing..." : "Request Payout"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Balance card */}
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <Banknote className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold text-foreground">R{loading ? "..." : balance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payouts list */}
        <div className="bg-card rounded-xl border border-border">
          <h2 className="font-semibold text-foreground p-4 border-b border-border">Payout History</h2>
          {payouts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No payouts yet</div>
          ) : (
            <div className="divide-y divide-border">
              {payouts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {statusIcon(p.status)}
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.reference || p.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{p.bank_name} • {p.account_number?.slice(-4)?.padStart(p.account_number?.length || 4, "•")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">R{Number(p.amount).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground capitalize">{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
