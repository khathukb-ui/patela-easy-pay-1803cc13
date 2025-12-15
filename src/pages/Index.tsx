import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Wifi, Smartphone } from "lucide-react";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import patelaHeroBg from "@/assets/patela-hero-bg.jpg";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${patelaHeroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          {/* Logo Text */}
          <div className="mb-4 animate-patela-bounce-in">
            <PatelaLogo size="xl" variant="light" />
          </div>

          {/* Tagline */}
          <p className="text-xl text-primary-foreground/90 mb-12 animate-patela-slide-up" style={{ animationDelay: "0.1s" }}>
            Get paid. Stay paid.
          </p>

          {/* Features */}
          <div className="w-full max-w-sm space-y-3 mb-12 animate-patela-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Wifi className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary-foreground">Works Offline</p>
                <p className="text-sm text-primary-foreground/70">Keep selling, even with no signal</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary-foreground">Easy to Use</p>
                <p className="text-sm text-primary-foreground/70">Big buttons, simple steps</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 border border-primary-foreground/20">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Shield className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary-foreground">Your Money, Safe</p>
                <p className="text-sm text-primary-foreground/70">Direct to your bank account</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 pb-8 space-y-3 animate-patela-slide-up" style={{ animationDelay: "0.3s" }}>
          <Button
            size="xl"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold patela-shadow-accent"
            onClick={() => navigate("/onboarding/language")}
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/home")}
          >
            I already have an account
          </Button>
        </div>
      </div>
    </div>
  );
}