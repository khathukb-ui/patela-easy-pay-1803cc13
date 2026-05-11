import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { Download, Smartphone, CheckCircle2, Share, ArrowRight } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallApp() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Already Installed!</h1>
          <p className="text-muted-foreground text-base mb-6 max-w-xs">
            Patela is installed on your device. Open it from your home screen for the best experience.
          </p>
          <Button variant="default" size="xl" className="w-[300px]" onClick={() => navigate("/home")}>
            <ArrowRight className="mr-2 h-5 w-5" />
            Continue to App
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <PatelaLogo size="xl" className="mb-6" />

        <h1 className="text-3xl font-bold text-foreground text-center mb-2">
          Install Patela
        </h1>
        <p className="text-muted-foreground text-center text-base mb-8 max-w-sm">
          Add Patela to your home screen for instant access, offline support, and a native app experience.
        </p>

        {/* Benefits */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {[
            { icon: Smartphone, text: "Works like a native app" },
            { icon: Download, text: "Works offline — take payments anywhere" },
            { icon: CheckCircle2, text: "Fast launch from home screen" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-foreground font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Install Actions */}
        {isIOS ? (
          <div className="w-full max-w-sm">
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
              <p className="font-semibold text-foreground mb-2">Install on iPhone / iPad</p>
              <div className="space-y-2 text-sm text-muted-foreground text-left">
                <p className="flex items-center gap-2">
                  <span className="text-primary font-bold">1.</span>
                  Tap the <Share className="inline h-4 w-4 text-accent" /> Share button in Safari
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Tap <strong className="text-foreground">Add</strong> to confirm
                </p>
              </div>
            </div>
          </div>
        ) : deferredPrompt ? (
          <Button
            variant="default"
            size="xl"
            className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={handleInstall}
          >
            <Download className="mr-2 h-5 w-5" />
            Install Patela
          </Button>
        ) : (
          <div className="w-full max-w-sm bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Open this page in <strong className="text-foreground">Chrome</strong> or <strong className="text-foreground">Safari</strong> on your phone to install.
            </p>
          </div>
        )}
      </div>

      {/* Skip */}
      <div className="p-6 text-center">
        <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate("/home")}>
          Skip — use in browser
        </Button>
      </div>
    </div>
  );
}
