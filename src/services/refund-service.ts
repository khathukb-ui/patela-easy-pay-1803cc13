/**
 * Refund Service — gateway-ready abstraction layer.
 * Currently uses mock processing; swap provider methods for real gateway later.
 */

import { supabase } from "@/integrations/supabase/client";

export interface RefundRequest {
  saleId: string;
  amount: number;
  refundType: "full" | "partial";
  reason: string;
  reasonNote?: string;
  paymentMethod: string;
  originalTransactionReference?: string;
}

export interface RefundRecord {
  id: string;
  sale_id: string;
  user_id: string;
  refunded_by_user_id: string;
  refund_reference: string;
  original_transaction_reference: string | null;
  amount: number;
  refund_type: string;
  reason: string;
  reason_note: string | null;
  status: string;
  payment_method: string;
  same_day_refund_deduction: number;
  next_settlement_adjustment: number;
  sms_sent: boolean;
  email_sent: boolean;
  whatsapp_sent: boolean;
  flagged_suspicious: boolean;
  created_at: string;
  processed_at: string | null;
  updated_at: string;
}

export interface RefundResult {
  success: boolean;
  refund?: RefundRecord;
  error?: string;
}

// Refund window config (placeholder — can be made dynamic later)
const REFUND_WINDOW_DAYS = 30;

/**
 * Check if a sale is eligible for refund
 */
export async function checkRefundEligibility(saleId: string): Promise<{
  eligible: boolean;
  reason?: string;
  sale?: any;
  totalRefunded: number;
  remainingRefundable: number;
}> {
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .select("*")
    .eq("id", saleId)
    .single();

  if (saleError || !sale) {
    return { eligible: false, reason: "Transaction not found", totalRefunded: 0, remainingRefundable: 0 };
  }

  // Only card transactions
  if (sale.payment_method !== "card") {
    return { eligible: false, reason: "Only card transactions can be refunded", sale, totalRefunded: 0, remainingRefundable: 0 };
  }

  // Only successful transactions
  if (sale.status !== "success") {
    return { eligible: false, reason: "Only successful transactions can be refunded", sale, totalRefunded: 0, remainingRefundable: 0 };
  }

  // Check refund window
  const saleDate = new Date(sale.created_at);
  const daysSince = (Date.now() - saleDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSince > REFUND_WINDOW_DAYS) {
    return { eligible: false, reason: `Refund window expired (max ${REFUND_WINDOW_DAYS} days)`, sale, totalRefunded: 0, remainingRefundable: 0 };
  }

  // Calculate total already refunded
  const { data: existingRefunds } = await supabase
    .from("refunds")
    .select("amount, status")
    .eq("sale_id", saleId)
    .in("status", ["pending", "successful"]);

  const totalRefunded = (existingRefunds || []).reduce((sum, r) => sum + Number(r.amount), 0);
  const remainingRefundable = Number(sale.amount) - totalRefunded;

  if (remainingRefundable <= 0) {
    return { eligible: false, reason: "Transaction has been fully refunded", sale, totalRefunded, remainingRefundable: 0 };
  }

  return { eligible: true, sale, totalRefunded, remainingRefundable };
}

/**
 * Verify merchant PIN against stored hash
 */
export async function verifyPin(pin: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("pin_hash")
    .eq("user_id", user.id)
    .single();

  if (!profile?.pin_hash) {
    // No PIN set — allow for now (should prompt setup)
    return pin === "1234"; // Fallback for dev/testing
  }

  // Simple hash comparison (in production, use proper bcrypt on server)
  // For now, compare directly since pin_hash stores the PIN
  return profile.pin_hash === pin;
}

/**
 * Initiate a refund — gateway-ready interface
 */
export async function initiateRefund(request: RefundRequest): Promise<RefundResult> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not authenticated" };

  // Re-validate eligibility
  const eligibility = await checkRefundEligibility(request.saleId);
  if (!eligibility.eligible) {
    return { success: false, error: eligibility.reason };
  }

  // Validate amount
  if (request.amount <= 0) {
    return { success: false, error: "Refund amount must be greater than zero" };
  }
  if (request.amount > eligibility.remainingRefundable) {
    return { success: false, error: `Amount exceeds refundable balance of R${eligibility.remainingRefundable.toFixed(2)}` };
  }

  // Check fraud threshold (placeholder: flag if > 3 refunds in 24h)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentRefunds } = await supabase
    .from("refunds")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", oneDayAgo);

  const flagSuspicious = (recentRefunds?.length || 0) >= 3;

  // --- Mock gateway call ---
  // In production: const gatewayResult = await paymentGateway.processRefund(...)
  const mockGatewaySuccess = true; // Simulate success
  const processedStatus = mockGatewaySuccess ? "successful" : "failed";

  // Insert refund record
  const { data: refund, error: insertError } = await supabase
    .from("refunds")
    .insert({
      sale_id: request.saleId,
      user_id: user.id,
      refunded_by_user_id: user.id,
      amount: request.amount,
      refund_type: request.refundType,
      reason: request.reason,
      reason_note: request.reasonNote || null,
      payment_method: request.paymentMethod,
      original_transaction_reference: request.originalTransactionReference || null,
      status: processedStatus,
      processed_at: processedStatus === "successful" ? new Date().toISOString() : null,
      flagged_suspicious: flagSuspicious,
      same_day_refund_deduction: request.amount * 0.015, // Mock 1.5% fee
      next_settlement_adjustment: request.amount,
    })
    .select("*")
    .single();

  if (insertError) {
    console.error("Refund insert error:", insertError);
    return { success: false, error: "Failed to process refund" };
  }

  // Update sale status if fully refunded
  const newTotalRefunded = eligibility.totalRefunded + request.amount;
  const saleAmount = Number(eligibility.sale.amount);
  const newSaleStatus = newTotalRefunded >= saleAmount ? "refunded" : 
    newTotalRefunded > 0 ? "partially_refunded" : "success";

  await supabase
    .from("sales")
    .update({ status: newSaleStatus })
    .eq("id", request.saleId);

  // Mock notification dispatch
  console.log("[Refund Notification] SMS dispatched for refund:", refund.refund_reference);
  console.log("[Refund Notification] Email dispatched for refund:", refund.refund_reference);

  return { success: true, refund: refund as RefundRecord };
}

/**
 * Get refund status by reference
 */
export async function getRefundStatus(refundReference: string): Promise<RefundRecord | null> {
  const { data } = await supabase
    .from("refunds")
    .select("*")
    .eq("refund_reference", refundReference)
    .single();

  return data as RefundRecord | null;
}

/**
 * Get all refunds for a specific sale
 */
export async function getRefundsForSale(saleId: string): Promise<RefundRecord[]> {
  const { data } = await supabase
    .from("refunds")
    .select("*")
    .eq("sale_id", saleId)
    .order("created_at", { ascending: false });

  return (data || []) as RefundRecord[];
}

/**
 * Get refund metrics for dashboard
 */
export async function getRefundMetrics(userId: string, startDate?: Date) {
  let query = supabase
    .from("refunds")
    .select("amount, status, refund_type, flagged_suspicious")
    .eq("user_id", userId);

  if (startDate) {
    query = query.gte("created_at", startDate.toISOString());
  }

  const { data: refunds } = await query;
  const all = refunds || [];

  return {
    totalRefunds: all.filter(r => r.status === "successful").reduce((s, r) => s + Number(r.amount), 0),
    refundCount: all.length,
    successfulCount: all.filter(r => r.status === "successful").length,
    partialCount: all.filter(r => r.refund_type === "partial").length,
    failedCount: all.filter(r => r.status === "failed").length,
    pendingCount: all.filter(r => r.status === "pending").length,
    flaggedCount: all.filter(r => r.flagged_suspicious).length,
  };
}
