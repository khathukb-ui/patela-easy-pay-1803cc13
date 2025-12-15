import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight, Shield, Wifi, Smartphone } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        {/* Logo */}
        <div className="h-24 w-24 rounded-3xl patela-gradient-primary flex items-center justify-center patela-shadow-lg mb-8 animate-patela-bounce-in">
          <CreditCard className="h-12 w-12 text-primary-foreground" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-3 animate-patela-slide-up">
          Patela
        </h1>
        <p className="text-xl text-muted-foreground mb-8 animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
          Get paid. Stay paid.
        </p>

        {/* Features */}
        <div className="w-full max-w-sm space-y-4 mb-12 animate-patela-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-success" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Works Offline</p>
              <p className="text-sm text-muted-foreground">Keep selling, even with no signal</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Easy to Use</p>
              <p className="text-sm text-muted-foreground">Big buttons, simple steps</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div className="text-left">
              <p className="font-medium text-foreground">Your Money, Safe</p>
              <p className="text-sm text-muted-foreground">Direct to your bank account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-6 pb-8 space-y-3 animate-patela-slide-up" style={{ animationDelay: "0.3s" }}>
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={() => navigate("/onboarding/language")}
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={() => navigate("/home")}
        >
          I already have an account
        </Button>
      </div>
    </div>
  );
}
