import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) {
      return json({ error: "Missing x-api-key header" }, 401);
    }

    // Parse request body
    const body = await req.json();
    const { amount, currency, reference, customer_email, customer_name, payment_method, metadata } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return json({ error: "Invalid or missing 'amount' (must be a positive number)" }, 400);
    }

    // Create admin client to look up API key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Authenticate via API key (public_key)
    const { data: keyRecord, error: keyError } = await supabaseAdmin
      .from("merchant_api_keys")
      .select("id, merchant_id, environment, is_active")
      .eq("public_key", apiKey)
      .maybeSingle();

    if (keyError || !keyRecord) {
      return json({ error: "Invalid API key" }, 401);
    }

    if (!keyRecord.is_active) {
      return json({ error: "API key is deactivated" }, 403);
    }

    const { merchant_id, environment } = keyRecord;

    // Verify merchant exists and environment matches
    const { data: merchant, error: merchantError } = await supabaseAdmin
      .from("merchants")
      .select("id, status, environment, is_live_enabled, business_name")
      .eq("id", merchant_id)
      .single();

    if (merchantError || !merchant) {
      return json({ error: "Merchant not found" }, 404);
    }

    // Block live payments for unverified merchants
    if (environment === "live" && !merchant.is_live_enabled) {
      return json({ error: "Live payments are not enabled. Complete KYC verification first." }, 403);
    }

    // Simulate payment processing
    // Sandbox: always succeeds | Live: would integrate with real provider
    const isSandbox = environment === "sandbox";
    let paymentStatus = "success";
    let failureReason: string | null = null;

    if (isSandbox) {
      // Sandbox test scenarios based on amount
      if (amount === 0.01) {
        paymentStatus = "failed";
        failureReason = "Test failure: insufficient funds";
      } else if (amount === 0.02) {
        paymentStatus = "pending";
      } else {
        paymentStatus = "success";
      }
    } else {
      // Live mode — stub for now, would call real provider
      paymentStatus = "success";
    }

    // Record the transaction
    const txnReference = reference || `TXN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const { data: txn, error: txnError } = await supabaseAdmin
      .from("merchant_transactions")
      .insert({
        merchant_id,
        amount,
        currency: currency || "ZAR",
        reference: txnReference,
        customer_email: customer_email || null,
        customer_name: customer_name || null,
        payment_method: payment_method || "card",
        environment,
        status: paymentStatus,
        metadata: metadata || null,
      })
      .select("id, amount, currency, reference, status, created_at, environment")
      .single();

    if (txnError) {
      console.error("Transaction insert error:", txnError);
      return json({ error: "Failed to process payment" }, 500);
    }

    // Update last_used_at on API key
    await supabaseAdmin
      .from("merchant_api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyRecord.id);

    return json({
      success: paymentStatus === "success",
      transaction: {
        id: txn.id,
        amount: txn.amount,
        currency: txn.currency,
        reference: txn.reference,
        status: txn.status,
        environment: txn.environment,
        created_at: txn.created_at,
      },
      ...(failureReason ? { failure_reason: failureReason } : {}),
      sandbox: isSandbox,
      test_hints: isSandbox
        ? {
            note: "This is a sandbox transaction. No real money was charged.",
            test_amounts: {
              "0.01": "Simulates a declined/failed payment",
              "0.02": "Simulates a pending payment",
              "any other": "Simulates a successful payment",
            },
          }
        : undefined,
    });
  } catch (err) {
    console.error("Payment processing error:", err);
    return json({ error: "Internal server error" }, 500);
  }
});
