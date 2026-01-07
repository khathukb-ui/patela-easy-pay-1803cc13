import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, XCircle, Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type VerificationStatus = "verifying" | "success" | "failed";

export default function BankVerify() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === "verifying") {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            // Simulate 80% success rate
            setStatus(Math.random() > 0.2 ? "success" : "failed");
            return 100;
          }
          return prev + 5;
        });
      }, 100);

      return () => clearInterval(progressInterval);
    }
  }, [status]);

  const handleRetry = () => {
    setStatus("verifying");
    setProgress(0);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
      {status === "verifying" && (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative">
            <Shield className="h-10 w-10 text-primary" />
            <div className="absolute inset-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (289 * progress) / 100}
                  className="text-primary transition-all duration-100"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-bold text-foreground mb-1">
            {t("verifying")}
          </h1>
          <p className="text-muted-foreground text-sm mb-3">
            {t("loading")}
          </p>

          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-mono font-bold">{progress}%</span>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>

          <h1 className="text-xl font-bold text-foreground mb-1">
            {t("verified")}!
          </h1>
          <p className="text-muted-foreground text-sm mb-4 max-w-xs">
            {t("accountReady")}
          </p>

          <div className="w-full max-w-sm bg-success/5 border border-success/20 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground text-sm">FNB ****4521</p>
                <p className="text-xs text-success">{t("verified")}</p>
              </div>
            </div>
          </div>

          <Button 
            variant="default"
            size="default" 
            className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => navigate("/bank/success")}
          >
            Continue
          </Button>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center text-center animate-fade-in w-full max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>

          <h1 className="text-xl font-bold text-foreground mb-1">
            Verification Failed
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            We couldn't verify your account. Please try again or upload proof.
          </p>

          <div className="w-full flex flex-col items-center gap-2">
            <Button 
              variant="default"
              size="default" 
              className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              onClick={handleRetry}
            >
              Try Again
            </Button>

            <Button 
              variant="outline"
              size="default" 
              className="w-[220px]"
              onClick={() => navigate("/bank/upload")}
            >
              <Upload className="mr-1.5 h-4 w-4" />
              Upload Proof of Account
            </Button>

            <Button 
              variant="ghost"
              size="sm" 
              className="text-muted-foreground"
              onClick={() => navigate("/help")}
            >
              Get Help
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
