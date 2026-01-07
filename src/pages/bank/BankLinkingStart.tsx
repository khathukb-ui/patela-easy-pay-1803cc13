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
        
        <p className="text-muted-foreground text-center text-lg mb-8 max-w-xs">
          {t("linkBankDesc")}
        </p>

        {/* Info List - clearly non-interactive */}
        <ul className="w-full max-w-sm space-y-3 mb-8 text-left">
          <li className="flex items-center gap-3 text-muted-foreground">
            <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm">Scan your bank card - no typing needed</span>
          </li>
          <li className="flex items-center gap-3 text-muted-foreground">
            <Shield className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="text-sm">Your details are encrypted & protected</span>
          </li>
        </ul>
      </div>

      {/* Bottom Actions - consistent button styling */}
      <div className="p-6 space-y-3">
        <Button 
          variant="hero"
          size="xl" 
          className="w-full"
          onClick={() => navigate("/bank/scan")}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {t("scanBankCard")}
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="w-full"
          onClick={() => navigate("/bank/manual")}
        >
          {t("enterManually")}
        </Button>
      </div>
    </div>
  );
}
