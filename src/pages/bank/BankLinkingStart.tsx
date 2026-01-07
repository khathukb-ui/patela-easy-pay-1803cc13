import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { CreditCard, Building2, Shield, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BankLinkingStart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-3 pt-6">
        <ProgressSteps currentStep={1} totalSteps={4} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 patela-shadow-primary animate-fade-in">
          <Building2 className="h-8 w-8 text-primary-foreground" />
        </div>

        <h1 className="text-xl font-bold text-foreground text-center mb-1">
          {t("linkBank")}
        </h1>
        
        <p className="text-muted-foreground text-center text-sm mb-4 max-w-xs">
          {t("linkBankDesc")}
        </p>

        {/* Clear instruction */}
        <div className="w-full max-w-sm bg-secondary/50 rounded-lg p-2.5 mb-4">
          <p className="text-xs text-muted-foreground text-center">
            Choose how you'd like to add your bank details:
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 flex flex-col items-center gap-2">
        <Button 
          variant="default"
          size="default" 
          className="w-[220px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
          onClick={() => navigate("/bank/scan")}
        >
          <CreditCard className="mr-1.5 h-4 w-4" />
          {t("scanBankCard")}
        </Button>
        
        <Button 
          variant="default" 
          size="default"
          className="w-[220px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
          onClick={() => navigate("/bank/manual")}
        >
          {t("enterManually")}
        </Button>
      </div>
    </div>
  );
}
