import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Smartphone, ArrowRight } from "lucide-react";

export default function OnboardingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="flex flex-col items-center text-center space-y-8 max-w-md animate-patela-bounce-in">
        {/* Success Icon */}
        <div className="h-28 w-28 rounded-full patela-gradient-success flex items-center justify-center patela-shadow-success">
          <Check className="h-14 w-14 text-success-foreground" strokeWidth={3} />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">You're Ready!</h1>
          <p className="text-muted-foreground text-lg">
            Your Patela account is set up
          </p>
        </div>

        {/* Next Steps */}
        <div className="w-full space-y-4 pt-4">
          <div className="bg-card rounded-2xl p-5 border border-border patela-shadow-sm text-left">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Link Your Bank</h3>
                <p className="text-sm text-muted-foreground">
                  Add your bank account to receive your money
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-5 border border-border patela-shadow-sm text-left">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Pair Your Device</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Patela card machine
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-4">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Go to Home
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={() => navigate("/home")}
          >
            Set up later
          </Button>
        </div>
      </div>
    </div>
  );
}
