import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { CreditCard, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatelaCard } from "@/components/patela/PatelaCard";

export default function BankLinkingStart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-3 pt-6">
        <ProgressSteps currentStep={1} totalSteps={4} />
      </div>

      {/* Content - Single connected section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Patela Card */}
        <div className="mb-6">
          <PatelaCard size="lg" />
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

        {/* Skip Option */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleSkip}
          >
            <Clock className="mr-2 h-4 w-4" />
            Do this later
          </Button>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
            You can still make sales without linking a bank, but payouts require a linked account.
          </p>
        </div>
      </div>
    </div>
  );
}
