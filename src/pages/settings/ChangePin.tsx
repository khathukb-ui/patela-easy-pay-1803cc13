import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { PinInput } from "@/components/patela/PinInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { changePin } from "@/services/pin-service";

type Step = "current" | "new" | "confirm" | "success";

export default function ChangePin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("current");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCurrentPinComplete = async (pin: string) => {
    setCurrentPin(pin);
    setError("");
    setStep("new");
  };

  const handleNewPinComplete = (pin: string) => {
    setNewPin(pin);
    setError("");
    setStep("confirm");
  };

  const handleConfirmPinComplete = async (pin: string) => {
    setConfirmPin(pin);
    if (pin !== newPin) {
      setError("PINs don't match. Try again.");
      setConfirmPin("");
      return;
    }

    setLoading(true);
    const result = await changePin(currentPin, pin);
    setLoading(false);

    if (result.success) {
      setStep("success");
      toast.success("PIN changed successfully!");
    } else {
      if (result.error?.includes("Incorrect PIN") || result.error?.includes("Too many")) {
        setStep("current");
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
      }
      setError(result.error || "Failed to change PIN");
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
            <h2 className="text-2xl font-bold text-foreground">PIN Changed</h2>
            <p className="text-muted-foreground">Your security PIN has been updated successfully.</p>
            <Button size="xl" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" onClick={() => navigate("/account")}>
              Back to Account
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const stepConfig = {
    current: { title: "Enter Current PIN", subtitle: "Verify your identity" },
    new: { title: "Enter New PIN", subtitle: "Choose a 4-digit PIN" },
    confirm: { title: "Confirm New PIN", subtitle: "Enter your new PIN again" },
  };

  const config = stepConfig[step as keyof typeof stepConfig];

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <header className="bg-primary px-6 py-8 text-center">
        <PatelaLogo size="xl" variant="dark" className="mx-auto" />
        <p className="text-primary-foreground/80 mt-4">{config.subtitle}</p>
      </header>

      <main className="flex-1 px-6 py-8">
        <div className="max-w-sm mx-auto">
          <button onClick={() => {
            if (step === "current") navigate("/account");
            else if (step === "new") { setStep("current"); setCurrentPin(""); setError(""); }
            else if (step === "confirm") { setStep("new"); setNewPin(""); setError(""); }
          }} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <KeyRound className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{config.title}</h1>
              <div className="flex gap-1 mt-1">
                {["current", "new", "confirm"].map((s, i) => (
                  <div key={s} className={`h-1 w-8 rounded-full ${
                    i <= ["current", "new", "confirm"].indexOf(step) ? "bg-accent" : "bg-muted"
                  }`} />
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Updating PIN...</p>
            </div>
          ) : (
            <PinInput
              value={step === "current" ? currentPin : step === "new" ? newPin : confirmPin}
              onChange={(val) => {
                setError("");
                if (step === "current") {
                  setCurrentPin(val);
                  if (val.length === 4) handleCurrentPinComplete(val);
                } else if (step === "new") {
                  setNewPin(val);
                  if (val.length === 4) handleNewPinComplete(val);
                } else {
                  setConfirmPin(val);
                  if (val.length === 4) handleConfirmPinComplete(val);
                }
              }}
              error={error}
            />
          )}

          {step === "current" && (
            <div className="mt-8 text-center">
              <Button variant="link" className="text-muted-foreground" onClick={() => navigate("/settings/reset-pin")}>
                Forgot your PIN?
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
