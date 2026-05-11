import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboardingData } from "@/hooks/use-onboarding-data";

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { clearData } = useOnboardingData();

  // Clear onboarding data when user completes onboarding
  useEffect(() => {
    clearData();
  }, [clearData]);

  return (
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center max-w-md animate-patela-bounce-in">
        {/* Success Icon */}
        <div className="h-24 w-24 rounded-full patela-gradient-success flex items-center justify-center patela-shadow-success mb-4">
          <Check className="h-12 w-12 text-success-foreground" strokeWidth={3} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground mb-1">{t("allSet")}</h1>
        <p className="text-muted-foreground text-base mb-4">
          {t("accountReady")}
        </p>

        {/* What's Next Info */}
        <div className="w-full mb-4">
          <p className="text-sm text-muted-foreground text-center mb-2">
            Your next step:
          </p>
          <div className="bg-muted/30 rounded-xl p-3 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-base font-medium text-foreground">{t("linkBank")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("linkBankDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="default"
            size="xl"
            className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => navigate("/bank/start")}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <button
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate("/home")}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
