import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { CreditCard, Building2, Shield, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankLinkingStart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8">
        <ProgressSteps currentStep={1} totalSteps={4} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6 patela-shadow-primary animate-fade-in">
          <Building2 className="h-10 w-10 text-primary-foreground" />
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-3">
          {t("linkBank")}
        </h1>
        
        <p className="text-muted-foreground text-center text-lg mb-8 max-w-xs">
          {t("linkBankDesc")}
        </p>

        {/* Benefits */}
        <div className="w-full max-w-sm space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-card rounded-2xl patela-shadow-sm border border-primary/10">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{t("scanBankCard")}</p>
              <p className="text-sm text-muted-foreground">No typing needed</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-card rounded-2xl patela-shadow-sm border border-primary/10">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Safe & Secure</p>
              <p className="text-sm text-muted-foreground">Your details are protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <Button 
          size="xl" 
          className="w-full bg-accent text-accent-foreground text-lg font-bold h-16 rounded-2xl patela-shadow-accent hover:bg-accent/90"
          onClick={() => navigate("/bank/scan")}
        >
          <CreditCard className="mr-3 h-6 w-6" />
          {t("scanBankCard")}
          <ArrowRight className="ml-auto h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="w-full text-base h-14 rounded-2xl border-primary/20 hover:bg-primary/5"
          onClick={() => navigate("/bank/manual")}
        >
          {t("enterManually")}
        </Button>
      </div>
    </div>
  );
}
