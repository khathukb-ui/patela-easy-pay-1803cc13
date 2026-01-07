import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { CreditCard, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatelaLogo } from "@/components/patela/PatelaLogo";

export default function BankLinkingStart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-3 pt-6">
        <ProgressSteps currentStep={1} totalSteps={4} />
      </div>

      {/* Content - Single connected section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* CSS-only Patela Card */}
        <div className="relative w-80 h-48 mb-6 animate-float">
          {/* Card shape outline - subtle border only */}
          <div className="absolute inset-0 rounded-2xl bg-white border border-primary/20 shadow-lg" />
          
          {/* Decorative wave accent */}
          <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden rounded-b-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/15 transform -skew-y-3" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 transform skew-y-2 translate-y-2" />
          </div>
          
          {/* Logo */}
          <div className="absolute top-6 left-6">
            <PatelaLogo size="md" variant="dark" />
          </div>
          
          {/* Chip icon */}
          <div className="absolute top-16 left-6">
            <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-200 via-amber-100 to-amber-300 border border-amber-300/50 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-amber-600/60" strokeWidth={1} />
            </div>
          </div>
          
          {/* Card number */}
          <div className="absolute bottom-6 left-6 right-6">
            <p className="font-mono text-lg tracking-[0.2em] text-foreground/70">
              4532 7891 0124 3456
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center mb-1">
          {t("linkBank")}
        </h1>
        
        <p className="text-muted-foreground text-center text-lg mb-2 max-w-sm">
          {t("linkBankDesc")}
        </p>

        <p className="text-base text-muted-foreground text-center mb-4">
          Choose how you'd like to add your bank details:
        </p>

        {/* Actions inline with content */}
        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default"
            size="xl" 
            className="w-[300px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
            onClick={() => navigate("/bank/scan")}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            {t("scanBankCard")}
          </Button>
          
          <Button 
            variant="default" 
            size="xl"
            className="w-[300px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
            onClick={() => navigate("/bank/manual")}
          >
            {t("enterManually")}
          </Button>
        </div>
      </div>
    </div>
  );
}
