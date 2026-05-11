import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Search, Download } from "lucide-react";

export default function PaygateTransactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchTransactions(); }, [statusFilter]);

  const fetchTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: merchant } = await supabase.from("merchants").select("id, environment").eq("user_id", user.id).single();
    if (!merchant) return;

    let query = supabase
      .from("merchant_transactions")
      .select("*")
      .eq("merchant_id", merchant.id)
      .eq("environment", merchant.environment)
      .order("created_at", { ascending: false })
      .limit(100);

    if (statusFilter !== "all") query = query.eq("status", statusFilter);

    const { data } = await query;
    setTransactions(data || []);
    setLoading(false);
  };

  const filtered = transactions.filter(t =>
    !search || t.reference?.toLowerCase().includes(search.toLowerCase()) || t.customer_email?.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      success: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      failed: "bg-destructive/10 text-destructive",
      refunded: "bg-muted text-muted-foreground",
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || colors.pending}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate("/paygate/dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <h1 className="text-2xl font-bold text-foreground mb-6">Transactions</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by reference or email" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Reference</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Method</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No transactions found</td></tr>
                ) : (
                  filtered.map(txn => (
                    <tr key={txn.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-xs text-foreground">{txn.reference || txn.id.slice(0, 12)}</td>
                      <td className="p-4 font-semibold text-foreground">R{Number(txn.amount).toFixed(2)}</td>
                      <td className="p-4">{statusBadge(txn.status)}</td>
                      <td className="p-4 text-muted-foreground capitalize">{txn.payment_method}</td>
                      <td className="p-4 text-muted-foreground">{txn.customer_email || "—"}</td>
                      <td className="p-4 text-muted-foreground text-xs">{new Date(txn.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
