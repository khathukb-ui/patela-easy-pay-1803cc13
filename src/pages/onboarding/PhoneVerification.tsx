import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PhoneInput } from "@/components/patela/PhoneInput";
import { OtpInput } from "@/components/patela/OtpInput";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboardingData } from "@/hooks/use-onboarding-data";

type Step = "phone" | "otp";

export default function PhoneVerification() {
  const { data: onboardingData, updateData } = useOnboardingData();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState(onboardingData.phone);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Save phone to onboarding data when it changes
  useEffect(() => {
    updateData({ phone, currentStep: "phone" });
  }, [phone, updateData]);

  const handleSendOtp = async () => {
    if (phone.length < 9) {
      setError(t("wrongCode"));
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep("otp");
    toast({
      title: "OTP Sent!",
      description: `We sent a code to +27 ${phone}`,
    });
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setError(t("wrongCode"));
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (otp === "123456") {
      setIsLoading(false);
      updateData({ phoneVerified: true, currentStep: "details" });
      navigate("/onboarding/details");
    } else {
      setIsLoading(false);
      setError(t("wrongCode"));
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setOtp("");
    setError("");
    toast({
      title: "New code sent!",
      description: "Check your phone for the new code",
    });
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <ProgressSteps currentStep={2} totalSteps={5} />

      <div className="flex-1 flex flex-col patela-form-container py-6">
        {step === "phone" ? (
          <>
            <button
              onClick={() => navigate("/onboarding/language")}
              className="flex items-center gap-2 text-muted-foreground mb-4 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {t("back")}
            </button>

            <div className="text-center mb-6 animate-patela-slide-up">
              <div className="text-5xl mb-3">📱</div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {t("enterPhone")}
              </h1>
              <p className="text-muted-foreground text-sm">
                {t("enterPhoneDesc")}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center animate-patela-fade-in patela-form-section">
              <label className="patela-label mb-2">Mobile Number</label>
              <PhoneInput
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  setError("");
                }}
                error={error}
                disabled={isLoading}
              />
              <p className="patela-helper-text">We'll send you a verification code</p>
            </div>

            <div className="patela-button-container">
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleSendOtp}
                disabled={isLoading || phone.length < 9}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="flex items-center gap-2 text-muted-foreground mb-4 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {t("back")}
            </button>

            <div className="text-center mb-6 animate-patela-slide-up">
              <div className="text-5xl mb-3">✉️</div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {t("verifyPhone")}
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter the 6-digit code sent to +27 {phone}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center animate-patela-fade-in patela-form-section">
              <label className="patela-label mb-2 text-center">Verification Code</label>
              <OtpInput
                value={otp}
                onChange={(val) => {
                  setOtp(val);
                  setError("");
                }}
                error={error}
                disabled={isLoading}
              />
              
              <button
                onClick={handleResendOtp}
                disabled={isLoading}
                className="mt-4 text-primary text-sm font-medium hover:underline disabled:opacity-50 text-center"
              >
                Didn't receive it? Resend code
              </button>
            </div>

            <div className="patela-button-container">
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length < 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
