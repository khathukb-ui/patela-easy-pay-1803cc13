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
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center text-center space-y-8 max-w-md animate-patela-bounce-in">
        {/* Success Icon */}
        <div className="h-28 w-28 rounded-full patela-gradient-success flex items-center justify-center patela-shadow-success">
          <Check className="h-14 w-14 text-success-foreground" strokeWidth={3} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">{t("allSet")}</h1>
          <p className="text-muted-foreground text-lg">
            {t("accountReady")}
          </p>
        </div>

        {/* What's Next Info */}
        <div className="w-full pt-4">
          <p className="text-sm text-muted-foreground text-center mb-3">
            Your next step:
          </p>
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{t("linkBank")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("linkBankDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Single Clear Action */}
        <div className="w-full pt-6">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={() => navigate("/bank/start")}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <button
            className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => navigate("/home")}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
