import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProgressSteps } from "./ProgressSteps";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingHeader({ currentStep, totalSteps }: OnboardingHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Spacer for symmetry */}
        <div className="w-10" />
        
        {/* Progress steps centered */}
        <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
        
        {/* Exit button - top right, standard UX pattern */}
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          aria-label="Exit onboarding"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
