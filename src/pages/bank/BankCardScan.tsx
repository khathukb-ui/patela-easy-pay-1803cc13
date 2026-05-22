import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/patela/ProgressSteps";
import { Camera, X, Flashlight, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PatelaCard } from "@/components/patela/PatelaCard";

export default function BankCardScan() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate card detection after 2 seconds
    setTimeout(() => {
      navigate("/bank/confirm", { 
        state: { 
          scanned: true,
          bankName: "FNB",
          accountNumber: "****4521",
          accountType: "Cheque Account"
        } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center justify-between">
        <button 
          onClick={() => navigate("/bank/start")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>
        <ProgressSteps currentStep={2} totalSteps={4} />
        <div className="w-10" />
      </div>

      {/* Scan Area */}
      <div className="flex-1 flex flex-col items-center justify-center patela-form-container">
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">
          Scan Your Bank Card
        </h1>
        <p className="text-muted-foreground text-base text-center mb-3">
          Position your card within the frame
        </p>

        {/* Camera Preview Area */}
        <div className="relative w-full max-w-xs aspect-[1.6/1] rounded-2xl overflow-hidden bg-muted mb-3">
          {/* Simulated camera view */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            {isScanning ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-foreground font-medium text-sm">Scanning...</p>
              </div>
            ) : (
              <Camera className="h-12 w-12 text-muted-foreground/50" />
            )}
          </div>

          {/* Card Frame Overlay */}
          <div className="absolute inset-3 border-2 border-dashed border-primary/50 rounded-xl">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-5 h-5 border-t-3 border-l-3 border-primary rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-5 h-5 border-t-3 border-r-3 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-3 border-l-3 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-3 border-r-3 border-primary rounded-br-lg" />
          </div>

          {/* Controls */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <button 
              onClick={() => setFlashOn(!flashOn)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                flashOn ? "bg-accent text-accent-foreground" : "bg-background/80 text-foreground"
              }`}
            >
              <Flashlight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Patela Card */}
        <div className="mb-3 scale-75 -my-4">
          <PatelaCard size="sm" />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 flex flex-col items-center gap-2">
        <Button 
          variant="default"
          size="xl" 
          className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          onClick={handleStartScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RotateCcw className="mr-2 h-5 w-5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-5 w-5" />
              Capture Card
            </>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="xl"
          className="w-[300px] text-muted-foreground"
          onClick={() => navigate("/bank/manual")}
        >
          Enter Details Manually
        </Button>
      </div>
    </div>
  );
}
