import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { 
  ArrowRight, 
  CreditCard, 
  Shield, 
  Zap, 
  Banknote,
  CheckCircle2,
  Play
} from "lucide-react";
import patelaHeroBg from "@/assets/patela-hero-bg.jpg";

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    { icon: CreditCard, text: "Accept card payments easily" },
    { icon: Zap, text: "Fast next-day payouts" },
    { icon: Shield, text: "Secure & protected" },
    { icon: Banknote, text: "Low transaction fees" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="relative flex-1 flex flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${patelaHeroBg})`, backgroundPosition: '70% center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95" />
        
        <div className="relative z-10 flex-1 flex flex-col px-6 py-8">
          {/* Logo */}
          <div className="text-center mb-8 pt-4">
            <PatelaLogo size="lg" variant="light" />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground mb-3 animate-patela-slide-up">
              Accept Payments.
              <br />
              <span className="text-accent">Grow Your Hustle.</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-sm animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
              The easiest way to accept card payments for your business.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 mb-8 w-full max-w-sm animate-patela-slide-up" style={{ animationDelay: "0.2s" }}>
              {features.map((feature) => (
                <div 
                  key={feature.text}
                  className="flex items-center gap-2 bg-primary-foreground/10 rounded-xl px-3 py-2"
                >
                  <feature.icon className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-xs text-primary-foreground">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 animate-patela-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button
              size="xl"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold patela-shadow-accent"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => navigate("/auth")}
            >
              I already have an account
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-6 animate-patela-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-center gap-2 text-primary-foreground/60">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Trusted by 10,000+ vendors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
