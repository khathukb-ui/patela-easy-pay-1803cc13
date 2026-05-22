import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Key, Eye, EyeOff, Copy, RefreshCw, Shield } from "lucide-react";

export default function PaygateApiKeys() {
  const navigate = useNavigate();
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [merchantId, setMerchantId] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<string>("sandbox");

  useEffect(() => { fetchKeys(); }, []);

  const fetchKeys = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: merchant } = await supabase.from("merchants").select("id, environment, is_live_enabled").eq("user_id", user.id).single();
    if (!merchant) return;
    setMerchantId(merchant.id);
    setEnvironment(merchant.environment);

    const { data } = await supabase.from("merchant_api_keys").select("*").eq("merchant_id", merchant.id).order("created_at", { ascending: false });
    setKeys(data || []);
    setLoading(false);
  };

  const handleGenerateKeys = async (env: string) => {
    if (!merchantId) return;
    try {
      await supabase.rpc("generate_merchant_api_keys", { p_merchant_id: merchantId, p_environment: env });
      toast.success(`${env} keys generated`);
      fetchKeys();
    } catch (e: any) {
      toast.error(e.message || "Failed to generate keys");
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("Copied to clipboard");
  };

  const toggleVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => key.slice(0, 12) + "•".repeat(20) + key.slice(-4);

  const sandboxKeys = keys.filter(k => k.environment === "sandbox" && k.is_active);
  const liveKeys = keys.filter(k => k.environment === "live" && k.is_active);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => navigate("/paygate/dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>

        <h1 className="text-2xl font-bold text-foreground mb-6">API Keys</h1>

        {/* Info */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3 mb-6">
          <Shield className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground text-sm">Keep your secret keys safe</p>
            <p className="text-xs text-muted-foreground">Never share your secret keys in client-side code or public repositories. Use them only on your server.</p>
          </div>
        </div>

        {/* Sandbox Keys */}
        <div className="bg-card rounded-xl border border-border mb-6">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <h2 className="font-semibold text-foreground">Sandbox Keys</h2>
            </div>
            {sandboxKeys.length === 0 && (
              <Button size="sm" variant="outline" onClick={() => handleGenerateKeys("sandbox")}>
                <RefreshCw className="mr-1 h-3 w-3" /> Generate
              </Button>
            )}
          </div>
          {sandboxKeys.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No sandbox keys yet</div>
          ) : (
            <div className="p-4 space-y-4">
              {sandboxKeys.map(k => (
                <div key={k.id} className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Public Key</p>
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-3 font-mono text-xs">
                      <span className="flex-1 truncate text-foreground">{k.public_key}</span>
                      <button onClick={() => copyKey(k.public_key)} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Secret Key</p>
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-3 font-mono text-xs">
                      <span className="flex-1 truncate text-foreground">{visibleKeys[k.id] ? k.secret_key : maskKey(k.secret_key)}</span>
                      <button onClick={() => toggleVisibility(k.id)} className="text-muted-foreground hover:text-foreground">
                        {visibleKeys[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => copyKey(k.secret_key)} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Keys */}
        <div className="bg-card rounded-xl border border-border">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <h2 className="font-semibold text-foreground">Live Keys</h2>
            </div>
            {liveKeys.length === 0 && (
              <Button size="sm" variant="outline" onClick={() => handleGenerateKeys("live")} disabled={!keys.some(() => true)}>
                <RefreshCw className="mr-1 h-3 w-3" /> Generate
              </Button>
            )}
          </div>
          {liveKeys.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              Live keys will be available once your account is verified.
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {liveKeys.map(k => (
                <div key={k.id} className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Public Key</p>
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-3 font-mono text-xs">
                      <span className="flex-1 truncate text-foreground">{k.public_key}</span>
                      <button onClick={() => copyKey(k.public_key)} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Secret Key</p>
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-3 font-mono text-xs">
                      <span className="flex-1 truncate text-foreground">{visibleKeys[k.id] ? k.secret_key : maskKey(k.secret_key)}</span>
                      <button onClick={() => toggleVisibility(k.id)} className="text-muted-foreground hover:text-foreground">
                        {visibleKeys[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => copyKey(k.secret_key)} className="text-muted-foreground hover:text-foreground"><Copy className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Docs quick reference */}
        <div className="bg-card rounded-xl border border-border p-6 mt-6">
          <h2 className="font-semibold text-foreground mb-3">Quick Start</h2>
          <div className="bg-muted rounded-lg p-4 font-mono text-xs text-foreground overflow-x-auto">
            <pre>{`curl -X POST https://api.patela.co.za/v1/payments \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1500,
    "currency": "ZAR",
    "email": "customer@example.com",
    "reference": "ORDER-001"
  }'`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
