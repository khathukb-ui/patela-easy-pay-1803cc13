import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { PinInput } from "@/components/patela/PinInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2, ShieldAlert, Send } from "lucide-react";
import { toast } from "sonner";
import { requestPinResetOtp, verifyResetOtp, completePinReset, getOtpCooldownRemaining } from "@/services/pin-service";
import { OtpInput } from "@/components/patela/OtpInput";

type Step = "request" | "verify" | "new-pin" | "confirm-pin" | "success";

export default function ResetPin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [otp, setOtp] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      const remaining = getOtpCooldownRemaining();
      setCooldown(remaining > 0 ? Math.ceil(remaining / 1000) : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequestOtp = async () => {
    setLoading(true);
    setError("");
    const result = await requestPinResetOtp();
    setLoading(false);

    if (result.success) {
      setStep("verify");
      toast.success("OTP sent! Check console for mock code.");
      setCooldown(60);
    } else {
      if (result.cooldownRemaining) setCooldown(Math.ceil(result.cooldownRemaining / 1000));
      setError(result.error || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = () => {
    setError("");
    const result = verifyResetOtp(otp);
    if (result.success) {
      setStep("new-pin");
      toast.success("OTP verified!");
    } else {
      setError(result.error || "Invalid OTP");
    }
  };

  const handleNewPin = (pin: string) => {
    setNewPin(pin);
    setError("");
    setStep("confirm-pin");
  };

  const handleConfirmPin = async (pin: string) => {
    setConfirmPin(pin);
    if (pin !== newPin) {
      setError("PINs don't match. Try again.");
      setConfirmPin("");
      return;
    }

    setLoading(true);
    const result = await completePinReset(pin);
    setLoading(false);

    if (result.success) {
      setStep("success");
      toast.success("PIN reset successfully!");
    } else {
      setError(result.error || "Failed to reset PIN");
    }
  };

  if (step === "success") {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col">
        <header className="bg-primary px-6 py-8 text-center">
          <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        </header>
        <main className="flex-1 px-6 py-12 flex flex-col items-center">
          <div className="max-w-sm mx-auto text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">PIN Reset Complete</h2>
            <p className="text-muted-foreground">Your security PIN has been reset. You can now use your new PIN for secure actions.</p>
            <Button size="xl" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => navigate("/account")}>
              Back to Account
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <header className="bg-primary px-6 py-8 text-center">
        <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        <p className="text-primary-foreground/80 mt-4">Reset your security PIN</p>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          <button onClick={() => {
            if (step === "request") navigate(-1);
            else if (step === "verify") setStep("request");
            else if (step === "new-pin") setStep("verify");
            else if (step === "confirm-pin") { setStep("new-pin"); setNewPin(""); setError(""); }
          }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {/* Step: Request OTP */}
          {step === "request" && (
            <div className="space-y-6 text-center">
              <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <ShieldAlert className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Verify Your Identity</h2>
              <p className="text-muted-foreground">
                We'll send a one-time code to your registered phone number or email to verify it's you.
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                size="xl"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                onClick={handleRequestOtp}
                disabled={loading || cooldown > 0}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
              </Button>
            </div>
          )}

          {/* Step: Verify OTP */}
          {step === "verify" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Send className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Enter OTP</h2>
                  <p className="text-sm text-muted-foreground">Check your phone or console for the code</p>
                </div>
              </div>

              <OtpInput
                value={otp}
                onChange={(val) => { setOtp(val); setError(""); }}
                length={6}
              />

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <Button
                size="xl"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                onClick={handleVerifyOtp}
                disabled={otp.length < 6}
              >
                Verify OTP
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-muted-foreground"
                  onClick={handleRequestOtp}
                  disabled={cooldown > 0}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </Button>
              </div>
            </div>
          )}

          {/* Step: New PIN */}
          {step === "new-pin" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Enter New PIN</h2>
                  <p className="text-sm text-muted-foreground">Choose a 4-digit security PIN</p>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <PinInput
                  value={newPin}
                  onChange={(val) => {
                    setNewPin(val);
                    setError("");
                    if (val.length === 4) handleNewPin(val);
                  }}
                  error={error}
                />
              )}
            </div>
          )}

          {/* Step: Confirm PIN */}
          {step === "confirm-pin" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Confirm New PIN</h2>
                  <p className="text-sm text-muted-foreground">Enter your new PIN again</p>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <PinInput
                  value={confirmPin}
                  onChange={(val) => {
                    setConfirmPin(val);
                    setError("");
                    if (val.length === 4) handleConfirmPin(val);
                  }}
                  error={error}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
