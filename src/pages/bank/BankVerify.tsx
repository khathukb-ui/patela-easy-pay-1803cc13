import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, XCircle, Upload, Loader2 } from "lucide-react";

type VerificationStatus = "verifying" | "success" | "failed";

export default function BankVerify() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {status === "verifying" && (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
            <Shield className="h-12 w-12 text-primary" />
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

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Verifying Your Account
          </h1>
          <p className="text-muted-foreground mb-4">
            This only takes a moment...
          </p>

          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">{progress}% Complete</span>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Account Verified!
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xs">
            Your bank account has been verified successfully. You're all set to receive payments.
          </p>

          <div className="w-full max-w-sm bg-success/5 border border-success/20 rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">FNB ****4521</p>
                <p className="text-sm text-success">Verified</p>
              </div>
            </div>
          </div>

          <Button 
            size="xl" 
            className="w-full max-w-sm patela-gradient-primary text-lg font-bold h-16 rounded-2xl patela-shadow-md"
            onClick={() => navigate("/bank/success")}
          >
            Continue to Home
          </Button>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Verification Failed
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xs">
            We couldn't verify your account automatically. Please try again or upload proof.
          </p>

          <div className="w-full max-w-sm space-y-3">
            <Button 
              size="xl" 
              className="w-full patela-gradient-primary text-lg font-bold h-16 rounded-2xl patela-shadow-md"
              onClick={handleRetry}
            >
              Try Again
            </Button>

            <Button 
              variant="outline"
              size="lg" 
              className="w-full h-14 rounded-2xl"
              onClick={() => navigate("/bank/upload")}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload Bank Statement
            </Button>

            <Button 
              variant="ghost"
              size="lg" 
              className="w-full h-14"
              onClick={() => navigate("/help")}
            >
              Contact Support
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
