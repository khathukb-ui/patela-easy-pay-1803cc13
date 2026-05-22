import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, CreditCard, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankSuccess() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Success Animation */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-success animate-ping opacity-20" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-1">
          {t("allSet")}
        </h1>
        <p className="text-muted-foreground text-base mb-4 max-w-xs">
          {t("verified")}! {t("accountReady")}
        </p>

        {/* Summary Card */}
        <div className="w-full max-w-sm bg-card rounded-xl patela-shadow-md overflow-hidden mb-4 border border-primary/10">
          <div className="bg-primary p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-primary-foreground/80 text-sm">{t("bankAccount")}</p>
                <p className="text-primary-foreground font-bold text-lg">{`FNB ****4521`}</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-base">{t("status")}</span>
              <span className="flex items-center gap-2 text-success font-semibold text-base">
                <CheckCircle2 className="h-5 w-5" />
                {t("verified")}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="w-full max-w-sm mb-4 bg-muted/30 rounded-xl p-3 border border-border">
          <p className="text-sm text-muted-foreground mb-1">{t("next")}:</p>
          <p className="text-foreground font-medium text-base">
            {t("pairDevice")} — connect your Patela device to start accepting payments.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default"
            size="xl" 
            className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => navigate("/device/start")}
          >
            {t("pairDevice")}
          </Button>
          
          <button 
            className="text-muted-foreground text-base hover:text-foreground transition-colors"
            onClick={() => navigate("/home")}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
