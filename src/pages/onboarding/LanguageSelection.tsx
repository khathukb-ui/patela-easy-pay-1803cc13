import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "@/components/patela/LanguageSelector";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ProgressSteps currentStep={1} totalSteps={5} />
      
      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="text-center mb-8 animate-patela-slide-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Choose Your Language
          </h1>
          <p className="text-muted-foreground text-lg">
            Khetha ulimi lwakho
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center animate-patela-fade-in" style={{ animationDelay: "0.1s" }}>
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onSelect={setSelectedLanguage}
          />
        </div>

        <div className="pt-6 animate-patela-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={() => navigate("/onboarding/phone")}
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
