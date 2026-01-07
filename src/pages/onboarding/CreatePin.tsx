import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PinInput } from "@/components/patela/PinInput";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { ArrowLeft, Lock, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "create" | "confirm";

export default function CreatePin() {
  const [step, setStep] = useState<Step>("create");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handlePinChange = (value: string) => {
    setError("");
    if (step === "create") {
      setPin(value);
      if (value.length === 4) {
        setTimeout(() => setStep("confirm"), 300);
      }
    } else {
      setConfirmPin(value);
      if (value.length === 4) {
        if (value === pin) {
          // Success - navigate to next step
          setTimeout(() => navigate("/onboarding/success"), 300);
        } else {
          setError(t("pinMismatch"));
          setConfirmPin("");
        }
      }
    }
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <ProgressSteps currentStep={4} totalSteps={5} />

      <div className="flex-1 flex flex-col patela-form-container py-4">
        <button
          onClick={() => {
            if (step === "confirm") {
              setStep("create");
              setConfirmPin("");
              setPin("");
              setError("");
            } else {
              navigate("/onboarding/details");
            }
          }}
          className="flex items-center gap-2 text-muted-foreground mb-4 hover:text-foreground transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>

        <div className="text-center mb-4 animate-patela-slide-up">
          <div className="h-20 w-20 mx-auto mb-3 rounded-full bg-primary flex items-center justify-center patela-shadow-primary">
            {step === "create" ? (
              <Lock className="h-10 w-10 text-primary-foreground" />
            ) : (
              <Shield className="h-10 w-10 text-primary-foreground" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {step === "create" ? "Create Your PIN" : "Confirm Your PIN"}
          </h1>
          <p className="text-muted-foreground text-base">
            {step === "create" ? "Enter a 4-digit PIN to secure your account" : "Re-enter your PIN to confirm"}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center animate-patela-fade-in">
          <PinInput
            value={step === "create" ? pin : confirmPin}
            onChange={handlePinChange}
            error={error}
          />
        </div>

        <div className="pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Your PIN protects your transactions
          </p>
        </div>
      </div>
    </div>
  );
}
