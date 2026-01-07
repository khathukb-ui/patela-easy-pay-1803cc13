import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/patela/PinInput";
import { ArrowLeft, Share2, Copy, CheckCircle2, Clock, Loader2 } from "lucide-react";

export default function DeviceTransfer() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"pin" | "code">("pin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [transferCode, setTransferCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [copied, setCopied] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (step === "code" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePinComplete = (value: string) => {
    setPin(value);
    setError("");
  };

  const handleGenerateCode = () => {
    // Mock PIN validation
    if (pin !== "1234") {
      setError("Wrong PIN. Please try again.");
      setPin("");
      return;
    }

    setIsGenerating(true);
    // Generate transfer code
    setTimeout(() => {
      setTransferCode("PTL-" + Math.random().toString(36).substring(2, 8).toUpperCase());
      setStep("code");
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(transferCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 flex items-center">
        <button 
          onClick={() => navigate("/device/manage")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground pr-10">
          Transfer Device
        </h1>
      </div>

      {step === "pin" ? (
        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-3">
            <Share2 className="h-8 w-8 text-accent" />
          </div>

          <h2 className="text-xl font-bold text-foreground text-center mb-1">
            Transfer to Another Account
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-4 max-w-xs">
            Generate a one-time code to transfer this device to another Patela account
          </p>

          <div className="w-full max-w-sm">
            <p className="text-center text-foreground font-medium text-sm mb-3">
              Enter your PIN to continue
            </p>
            
            <PinInput
              value={pin}
              onChange={handlePinComplete}
              error={error}
            />

            {error && (
              <p className="text-center text-destructive text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          <div className="mt-4">
            <Button 
              variant="default"
              size="default" 
              className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              onClick={handleGenerateCode}
              disabled={pin.length !== 4 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Generating Code...
                </>
              ) : (
                <>
                  <Share2 className="mr-1.5 h-4 w-4" />
                  Generate Transfer Code
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center px-6 py-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>

          <h2 className="text-xl font-bold text-foreground text-center mb-1">
            Transfer Code Ready
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-4 max-w-xs">
            Share this code with the new owner. They will enter it on their Patela app.
          </p>

          {/* Code Display */}
          <div className="w-full max-w-sm bg-card rounded-xl patela-shadow-md p-4 mb-3">
            <p className="text-3xl font-mono font-bold text-center text-primary tracking-widest mb-3">
              {transferCode}
            </p>
            
            <Button 
              variant="outline" 
              className="w-full h-10 rounded-lg"
              onClick={handleCopyCode}
            >
              {copied ? (
                <>
                  <CheckCircle2 className="mr-1.5 h-4 w-4 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
            timeLeft < 60 ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"
          }`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">
              Expires in {formatTime(timeLeft)}
            </span>
          </div>

          {/* Warning */}
          <div className="w-full max-w-sm mt-4 p-3 bg-accent/10 border border-accent/20 rounded-xl">
            <p className="text-xs text-center text-muted-foreground">
              <strong className="text-foreground">Important:</strong> Your device cannot process payments while transfer is pending.
            </p>
          </div>

          {/* Cancel Button */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="default"
              className="w-[220px]"
              onClick={() => navigate("/device/manage")}
            >
              Cancel Transfer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
