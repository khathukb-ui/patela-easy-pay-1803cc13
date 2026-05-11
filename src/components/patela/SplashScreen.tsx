import { useEffect, useState } from "react";
import { PatelaLogo } from "./PatelaLogo";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(onComplete, 300); // Wait for fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-300 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated rings */}
        <div className="absolute -inset-16">
          <div 
            className="absolute inset-0 rounded-full border-2 border-primary-foreground/10 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div 
            className="absolute inset-4 rounded-full border border-primary-foreground/5 animate-ping"
            style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
          />
        </div>

        {/* Logo with animation - Full wordmark for splash screens */}
        <div className="animate-patela-bounce-in">
          <PatelaLogo size="2xl" variant="dark" className="drop-shadow-lg" />
        </div>

        {/* Tagline */}
        <p 
          className="mt-4 text-primary-foreground/80 text-lg font-bold uppercase tracking-wide animate-patela-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          Built for the Hustle.
        </p>

        {/* Loading indicator */}
        <div className="mt-8 flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "0.15s" }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-accent animate-bounce"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      </div>
    </div>
  );
}