import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  trading_name: string | null;
  registration_number: string | null;
  tax_number: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  description: string | null;
  status: string;
  is_live_enabled: boolean;
  environment: string;
  created_at: string;
}

interface PaygateContextType {
  merchant: Merchant | null;
  loading: boolean;
  environment: "sandbox" | "live";
  setEnvironment: (env: "sandbox" | "live") => void;
  refreshMerchant: () => Promise<void>;
}

const PaygateContext = createContext<PaygateContextType | undefined>(undefined);

export function PaygateProvider({ children }: { children: ReactNode }) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironmentState] = useState<"sandbox" | "live">("sandbox");

  const fetchMerchant = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from("merchants")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setMerchant(data as Merchant);
      setEnvironmentState((data as Merchant).environment as "sandbox" | "live");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMerchant(); }, [fetchMerchant]);

  const setEnvironment = useCallback(async (env: "sandbox" | "live") => {
    if (!merchant) return;
    if (env === "live" && !merchant.is_live_enabled) return;

    await supabase.from("merchants").update({ environment: env }).eq("id", merchant.id);
    setEnvironmentState(env);
    setMerchant(prev => prev ? { ...prev, environment: env } : null);
  }, [merchant]);

  return (
    <PaygateContext.Provider value={{ merchant, loading, environment, setEnvironment, refreshMerchant: fetchMerchant }}>
      {children}
    </PaygateContext.Provider>
  );
}

export function usePaygate() {
  const ctx = useContext(PaygateContext);
  if (!ctx) throw new Error("usePaygate must be used within PaygateProvider");
  return ctx;
}
