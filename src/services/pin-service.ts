/**
 * PIN Management Service — handles Change PIN, Reset PIN, and verification.
 * Uses Supabase profiles.pin_hash for storage.
 */

import { supabase } from "@/integrations/supabase/client";

const PIN_LENGTH = 4;
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const OTP_COOLDOWN_MS = 60 * 1000; // 60 seconds resend cooldown
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// In-memory lockout state (per session)
let failedAttempts = 0;
let lockoutUntil: number | null = null;
let lastOtpSentAt: number | null = null;
let currentOtp: string | null = null;
let otpExpiresAt: number | null = null;

export interface PinChangeResult {
  success: boolean;
  error?: string;
}

export interface OtpResult {
  success: boolean;
  error?: string;
  cooldownRemaining?: number;
}

function isLocked(): { locked: boolean; remainingMs: number } {
  if (lockoutUntil && Date.now() < lockoutUntil) {
    return { locked: true, remainingMs: lockoutUntil - Date.now() };
  }
  if (lockoutUntil && Date.now() >= lockoutUntil) {
    lockoutUntil = null;
    failedAttempts = 0;
  }
  return { locked: false, remainingMs: 0 };
}

function validatePinFormat(pin: string): string | null {
  if (pin.length !== PIN_LENGTH) return `PIN must be ${PIN_LENGTH} digits`;
  if (!/^\d+$/.test(pin)) return "PIN must be numeric";
  if (/^(\d)\1+$/.test(pin)) return "PIN cannot be all same digits";
  if (pin === "0000") return "PIN cannot be 0000";
  return null;
}

/**
 * Verify a PIN against the stored pin_hash.
 * Falls back to "1234" if no pin_hash is set.
 */
export async function verifyCurrentPin(pin: string): Promise<PinChangeResult> {
  const lockState = isLocked();
  if (lockState.locked) {
    const mins = Math.ceil(lockState.remainingMs / 60000);
    return { success: false, error: `Too many attempts. Try again in ${mins} minute(s).` };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("pin_hash")
      .eq("user_id", user.id)
      .single();

    const storedPin = profile?.pin_hash || "1234";

    if (pin === storedPin) {
      failedAttempts = 0;
      return { success: true };
    }

    failedAttempts++;
    if (failedAttempts >= MAX_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      return { success: false, error: `Too many incorrect attempts. Locked for 5 minutes.` };
    }

    return { success: false, error: `Incorrect PIN. ${MAX_ATTEMPTS - failedAttempts} attempt(s) remaining.` };
  } catch {
    return { success: false, error: "Failed to verify PIN" };
  }
}

/**
 * Change PIN: verify current → save new.
 */
export async function changePin(currentPin: string, newPin: string): Promise<PinChangeResult> {
  const formatError = validatePinFormat(newPin);
  if (formatError) return { success: false, error: formatError };

  const verification = await verifyCurrentPin(currentPin);
  if (!verification.success) return verification;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update({ pin_hash: newPin, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    // Audit log placeholder
    console.log("[PIN-AUDIT] PIN changed", { userId: user.id, changedAt: new Date().toISOString() });

    return { success: true };
  } catch {
    return { success: false, error: "Failed to update PIN" };
  }
}

/**
 * Request OTP for PIN reset.
 * Mock: generates a 6-digit code and logs it.
 */
export async function requestPinResetOtp(): Promise<OtpResult> {
  if (lastOtpSentAt && Date.now() - lastOtpSentAt < OTP_COOLDOWN_MS) {
    const remaining = OTP_COOLDOWN_MS - (Date.now() - lastOtpSentAt);
    return { success: false, error: "Please wait before requesting another OTP", cooldownRemaining: remaining };
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    // Generate mock OTP
    currentOtp = String(Math.floor(100000 + Math.random() * 900000));
    otpExpiresAt = Date.now() + OTP_EXPIRY_MS;
    lastOtpSentAt = Date.now();

    // Mock notification dispatch
    console.log(`[PIN-RESET] OTP sent: ${currentOtp} (mock — expires in 5 min)`);
    console.log("[NOTIFICATION] SMS placeholder: PIN reset OTP sent");
    console.log("[NOTIFICATION] Email placeholder: PIN reset OTP sent");

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send OTP" };
  }
}

/**
 * Verify OTP for PIN reset.
 */
export function verifyResetOtp(otp: string): PinChangeResult {
  if (!currentOtp || !otpExpiresAt) {
    return { success: false, error: "No OTP requested. Please request one first." };
  }
  if (Date.now() > otpExpiresAt) {
    currentOtp = null;
    otpExpiresAt = null;
    return { success: false, error: "OTP has expired. Please request a new one." };
  }
  if (otp !== currentOtp) {
    return { success: false, error: "Incorrect OTP. Please try again." };
  }

  // OTP is valid — clear it (single use)
  currentOtp = null;
  otpExpiresAt = null;
  return { success: true };
}

/**
 * Complete PIN reset: set new PIN after OTP verification.
 */
export async function completePinReset(newPin: string): Promise<PinChangeResult> {
  const formatError = validatePinFormat(newPin);
  if (formatError) return { success: false, error: formatError };

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const { error } = await supabase
      .from("profiles")
      .update({ pin_hash: newPin, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    // Reset lockout state
    failedAttempts = 0;
    lockoutUntil = null;

    // Audit log placeholder
    console.log("[PIN-AUDIT] PIN reset completed", { userId: user.id, resetAt: new Date().toISOString(), method: "otp" });
    console.log("[NOTIFICATION] SMS placeholder: PIN reset successful");
    console.log("[NOTIFICATION] Email placeholder: PIN reset successful");

    return { success: true };
  } catch {
    return { success: false, error: "Failed to reset PIN" };
  }
}

/**
 * Get OTP cooldown remaining in ms (for UI timer).
 */
export function getOtpCooldownRemaining(): number {
  if (!lastOtpSentAt) return 0;
  const remaining = OTP_COOLDOWN_MS - (Date.now() - lastOtpSentAt);
  return remaining > 0 ? remaining : 0;
}
