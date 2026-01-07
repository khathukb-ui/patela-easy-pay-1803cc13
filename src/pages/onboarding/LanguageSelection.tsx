import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/patela/LanguageSelector";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Play } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOnboardingData } from "@/hooks/use-onboarding-data";

export default function LanguageSelection() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { data, clearData } = useOnboardingData();
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // Check for saved progress on mount
  useEffect(() => {
    const hasProgress = data.phone || data.firstName || data.phoneVerified;
    if (hasProgress) {
      setShowResumePrompt(true);
    }
  }, []);

  const handleResume = () => {
    // Navigate to the appropriate step based on saved progress
    if (data.phoneVerified) {
      navigate("/onboarding/details");
    } else if (data.phone) {
      navigate("/onboarding/phone");
    } else {
      navigate("/onboarding/phone");
    }
  };

  const handleStartFresh = () => {
    clearData();
    setShowResumePrompt(false);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <ProgressSteps currentStep={1} totalSteps={5} />
      
      <div className="flex-1 flex flex-col patela-form-container py-4">
        {showResumePrompt ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-patela-fade-in">
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">👋</div>
              <h1 className="text-xl font-bold text-foreground mb-1">
                {t("welcomeBack")}
              </h1>
              <p className="text-muted-foreground text-sm">
                {t("resumeOnboardingDesc")}
              </p>
            </div>

            <div className="w-full max-w-sm flex flex-col items-center gap-2">
              <Button
                variant="default"
                size="default"
                className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                onClick={handleResume}
              >
                <Play className="mr-1.5 h-4 w-4" />
                Continue Setup
              </Button>
              
              <Button
                variant="outline"
                size="default"
                className="w-[220px] border-border hover:bg-muted"
                onClick={handleStartFresh}
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4 animate-patela-slide-up">
              <h1 className="text-xl font-bold text-foreground mb-1">
                {t("selectLanguage")}
              </h1>
              <p className="text-muted-foreground text-sm">
                {t("selectLanguageDesc")}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center animate-patela-fade-in" style={{ animationDelay: "0.1s" }}>
              <LanguageSelector
                selectedLanguage={language}
                onSelect={(lang) => setLanguage(lang as "en" | "zu" | "st" | "ts")}
              />
            </div>

            <div className="pt-4 pb-4 flex flex-col items-center" style={{ animationDelay: "0.2s" }}>
              <Button
                variant="default"
                size="default"
                className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                onClick={() => navigate("/onboarding/phone")}
              >
                Continue
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
