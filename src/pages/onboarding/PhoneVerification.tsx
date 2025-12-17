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

      <div className="flex-1 flex flex-col px-6 py-8">
        {step === "phone" ? (
          <>
            <button
              onClick={() => navigate("/onboarding/language")}
              className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {t("back")}
            </button>

            <div className="text-center mb-8 animate-patela-slide-up">
              <div className="text-6xl mb-4">📱</div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("enterPhone")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("enterPhoneDesc")}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center animate-patela-fade-in">
              <PhoneInput
                value={phone}
                onChange={(val) => {
                  setPhone(val);
                  setError("");
                }}
                error={error}
                disabled={isLoading}
              />
            </div>

            <div className="pt-6">
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
                    {t("loading")}
                  </>
                ) : (
                  <>
                    {t("sendCode")}
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
              className="flex items-center gap-2 text-muted-foreground mb-6 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              {t("back")}
            </button>

            <div className="text-center mb-8 animate-patela-slide-up">
              <div className="text-6xl mb-4">✉️</div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("verifyPhone")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("enterOtp")} +27 {phone}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center animate-patela-fade-in">
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
                className="mt-6 text-primary font-medium hover:underline disabled:opacity-50 text-center"
              >
                {t("resendCode")}
              </button>
            </div>

            <div className="pt-6">
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
                    {t("loading")}
                  </>
                ) : (
                  <>
                    {t("confirm")}
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
