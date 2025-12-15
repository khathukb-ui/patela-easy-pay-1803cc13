import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, CreditCard, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankSuccess() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Success Animation */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-14 w-14 text-success" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-success animate-ping opacity-20" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t("allSet")}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-xs text-lg">
          {t("verified")}! {t("accountReady")}
        </p>

        {/* Summary Card */}
        <div className="w-full max-w-sm bg-card rounded-3xl patela-shadow-md overflow-hidden mb-8 border border-primary/10">
          <div className="bg-primary p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-primary-foreground/80 text-sm">{t("bankAccount")}</p>
                <p className="text-primary-foreground font-bold text-lg">FNB ****4521</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("status")}</span>
              <span className="flex items-center gap-2 text-success font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                {t("verified")}
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="w-full max-w-sm mb-8">
          <h3 className="font-semibold text-foreground mb-3 text-left">{t("next")}:</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                1
              </div>
              <span className="text-foreground">{t("pairDevice")}</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                2
              </div>
              <span className="text-foreground">{t("takePayment")}</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Button 
            size="xl" 
            className="w-full bg-accent text-accent-foreground text-lg font-bold h-16 rounded-2xl patela-shadow-accent hover:bg-accent/90"
            onClick={() => navigate("/device/start")}
          >
            {t("pairDevice")}
            <ArrowRight className="ml-auto h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full h-14 rounded-2xl border-primary/20 hover:bg-primary/5"
            onClick={() => navigate("/home")}
          >
            <Home className="mr-2 h-5 w-5" />
            {t("home")}
          </Button>
        </div>
      </div>
    </div>
  );
}
