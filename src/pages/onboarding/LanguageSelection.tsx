import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/patela/LanguageSelector";
import { OnboardingHeader } from "@/components/patela/OnboardingHeader";
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
    navigate("/onboarding/details");
  };

  const handleStartFresh = () => {
    clearData();
    setShowResumePrompt(false);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <OnboardingHeader currentStep={1} totalSteps={5} />
      
      <div className="flex-1 flex flex-col patela-form-container py-4">

        {showResumePrompt ? (
          <div className="flex-1 flex flex-col items-center justify-center animate-patela-fade-in">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">👋</div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {t("welcomeBack")}
              </h1>
              <p className="text-muted-foreground text-base">
                {t("resumeOnboardingDesc")}
              </p>
            </div>

            <div className="w-full max-w-sm flex flex-col items-center gap-2">
              <Button
                variant="default"
                size="xl"
                className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                onClick={handleResume}
              >
                <Play className="mr-2 h-5 w-5" />
                Continue Setup
              </Button>
              
              <Button
                variant="outline"
                size="xl"
                className="w-[300px] border-border hover:bg-muted"
                onClick={handleStartFresh}
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4 animate-patela-slide-up">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {t("selectLanguage")}
              </h1>
              <p className="text-muted-foreground text-base">
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
                size="xl"
                className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                onClick={() => navigate("/onboarding/details")}
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
