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

      <div className="flex-1 flex flex-col px-6 py-8">
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
          className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          {t("back")}
        </button>

        <div className="text-center mb-8 animate-patela-slide-up">
          <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center patela-shadow-primary">
            {step === "create" ? (
              <Lock className="h-10 w-10 text-primary-foreground" />
            ) : (
              <Shield className="h-10 w-10 text-primary-foreground" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {step === "create" ? t("createPin") : t("confirmPin")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {step === "create" ? t("createPinDesc") : t("confirmPinDesc")}
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center animate-patela-fade-in">
          <PinInput
            value={step === "create" ? pin : confirmPin}
            onChange={handlePinChange}
            error={error}
          />
        </div>

        <div className="pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t("createPinDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}
