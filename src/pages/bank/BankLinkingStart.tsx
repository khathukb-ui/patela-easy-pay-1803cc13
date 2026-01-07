import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { CreditCard, Building2, Shield, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import patelaCardImage from "@/assets/patela-card.png";
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
        {/* Patela Card Image */}
        <div className="relative w-64 h-44 mb-4">
          <div className="absolute inset-4 rounded-2xl bg-primary/40 blur-2xl" />
          <div className="relative w-full h-full animate-float">
            <img 
              src={patelaCardImage} 
              alt="Patela payment card" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
            {/* Card content overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              <PatelaLogo size="sm" variant="dark" className="drop-shadow-md" />
              <div className="space-y-1">
                <p className="font-mono text-sm tracking-widest text-foreground/80 drop-shadow-sm">
                  4532 •••• •••• 7891
                </p>
                <p className="text-xs text-muted-foreground">VALID THRU 12/28</p>
              </div>
            </div>
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
