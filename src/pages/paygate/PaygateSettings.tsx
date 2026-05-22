import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Save, Building2, Globe, Mail, Phone } from "lucide-react";

export default function PaygateSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [tradingName, setTradingName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("merchants").select("*").eq("user_id", user.id).single();
      if (data) {
        setBusinessName(data.business_name || "");
        setTradingName(data.trading_name || "");
        setContactEmail(data.contact_email || "");
        setContactPhone(data.contact_phone || "");
        setWebsiteUrl(data.website_url || "");
        setDescription(data.description || "");
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("merchants").update({
        business_name: businessName,
        trading_name: tradingName || null,
        contact_email: contactEmail || null,
        contact_phone: contactPhone || null,
        website_url: websiteUrl || null,
        description: description || null,
      }).eq("user_id", user.id);

      if (error) throw error;
      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button onClick={() => navigate("/paygate/dashboard")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Business Details</h2>
          </div>

          <div>
            <Label>Business Name</Label>
            <Input value={businessName} onChange={e => setBusinessName(e.target.value)} />
          </div>
          <div>
            <Label>Trading Name</Label>
            <Input placeholder="Optional" value={tradingName} onChange={e => setTradingName(e.target.value)} />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Mail className="h-3 w-3" /> Contact Email</Label>
            <Input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Phone className="h-3 w-3" /> Contact Phone</Label>
            <Input value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
          </div>
          <div>
            <Label className="flex items-center gap-1"><Globe className="h-3 w-3" /> Website</Label>
            <Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" disabled={saving} onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
