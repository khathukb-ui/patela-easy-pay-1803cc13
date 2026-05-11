import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-300",
              isCompleted
                ? "h-8 w-8 bg-success text-success-foreground"
                : isCurrent
                  ? "h-10 w-10 patela-gradient-primary text-primary-foreground ring-4 ring-primary/20"
                  : "h-8 w-8 bg-muted text-muted-foreground"
            )}
          >
            {isCompleted ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="text-sm font-bold">{stepNumber}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
