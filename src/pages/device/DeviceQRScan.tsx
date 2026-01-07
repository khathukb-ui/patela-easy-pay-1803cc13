import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, QrCode, Flashlight, Bluetooth, RotateCcw } from "lucide-react";

export default function DeviceQRScan() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate QR detection after 2 seconds
    setTimeout(() => {
      navigate("/device/found", { 
        state: { 
          deviceName: "Patela Pro",
          deviceId: "PTL-2024-7842",
          battery: 85,
          method: "qr"
        } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center justify-between">
        <button 
          onClick={() => navigate("/device/start")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-6 rounded-full bg-success" />
          <div className="h-2 w-6 rounded-full patela-gradient-primary" />
          <div className="h-2 w-6 rounded-full bg-muted" />
        </div>
        <div className="w-10" />
      </div>

      {/* Scan Area */}
      <div className="flex-1 flex flex-col items-center justify-center patela-form-container">
        <h1 className="text-xl font-bold text-foreground text-center mb-1">
          Scan Device QR Code
        </h1>
        <p className="text-muted-foreground text-sm text-center mb-3">
          Point at the QR code on your Patela machine
        </p>

        {/* Camera Preview Area */}
        <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
          {/* Simulated camera view */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            {isScanning ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-foreground font-medium text-sm">Scanning...</p>
              </div>
            ) : (
              <QrCode className="h-16 w-16 text-muted-foreground/50" />
            )}
          </div>

          {/* QR Frame Overlay */}
          <div className="absolute inset-10 border-2 border-dashed border-primary/50 rounded-xl">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-primary rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-primary rounded-br-lg" />
          </div>

          {/* Scan Line Animation */}
          {isScanning && (
            <div className="absolute inset-10 overflow-hidden rounded-xl">
              <div className="h-1 bg-primary/50 animate-bounce" style={{ animationDuration: "1s" }} />
            </div>
          )}

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

        {/* Helper Text */}
        <div className="flex items-center gap-3 p-2.5 bg-card rounded-xl patela-shadow-sm mb-3 w-full max-w-xs border border-border">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <QrCode className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Find the QR code</p>
            <p className="text-xs text-muted-foreground">On the back of your device</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 flex flex-col items-center gap-2">
        <Button 
          variant="default"
          size="default" 
          className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          onClick={handleStartScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RotateCcw className="mr-1.5 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <QrCode className="mr-1.5 h-4 w-4" />
              Start Scanning
            </>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="default"
          className="w-[220px] text-muted-foreground"
          onClick={() => navigate("/device/bluetooth")}
        >
          <Bluetooth className="mr-1.5 h-4 w-4" />
          Use Bluetooth Instead
        </Button>
      </div>
    </div>
  );
}
