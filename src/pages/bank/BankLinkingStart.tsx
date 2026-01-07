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
        
        <p className="text-muted-foreground text-center text-lg mb-6 max-w-xs">
          {t("linkBankDesc")}
        </p>

        {/* Clear instruction */}
        <div className="w-full max-w-sm bg-secondary/50 rounded-xl p-4 mb-8">
          <p className="text-sm text-muted-foreground text-center">
            Choose how you'd like to add your bank details:
          </p>
        </div>
      </div>

      {/* Bottom Actions - Compact buttons */}
      <div className="p-6 flex flex-col items-center gap-3">
        <Button 
          variant="default"
          size="lg" 
          className="w-auto min-w-[200px]"
          onClick={() => navigate("/bank/scan")}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {t("scanBankCard")}
        </Button>
        
        <Button 
          variant="default" 
          size="default"
          className="w-auto min-w-[200px]"
          onClick={() => navigate("/bank/manual")}
        >
          {t("enterManually")}
        </Button>
      </div>
    </div>
  );
}
