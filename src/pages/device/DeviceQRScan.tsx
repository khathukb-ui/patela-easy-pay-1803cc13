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
      <div className="p-4 pt-8 flex items-center justify-between">
        <button 
          onClick={() => navigate("/device/start")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-8 rounded-full bg-success" />
          <div className="h-2 w-8 rounded-full patela-gradient-primary" />
          <div className="h-2 w-8 rounded-full bg-muted" />
        </div>
        <div className="w-10" />
      </div>

      {/* Scan Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="text-xl font-bold text-foreground text-center mb-2">
          Scan Device QR Code
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Point at the QR code on your Patela machine
        </p>

        {/* Camera Preview Area */}
        <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-muted mb-6">
          {/* Simulated camera view */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
            {isScanning ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-foreground font-medium">Scanning...</p>
              </div>
            ) : (
              <QrCode className="h-20 w-20 text-muted-foreground/50" />
            )}
          </div>

          {/* QR Frame Overlay */}
          <div className="absolute inset-12 border-2 border-dashed border-primary/50 rounded-2xl">
            {/* Corner Markers */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
          </div>

          {/* Scan Line Animation */}
          {isScanning && (
            <div className="absolute inset-12 overflow-hidden rounded-2xl">
              <div className="h-1 bg-primary/50 animate-bounce" style={{ animationDuration: "1s" }} />
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
            <button 
              onClick={() => setFlashOn(!flashOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                flashOn ? "bg-accent text-accent-foreground" : "bg-background/80 text-foreground"
              }`}
            >
              <Flashlight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center gap-3 p-4 bg-card rounded-2xl patela-shadow-sm mb-4 w-full max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Find the QR code</p>
            <p className="text-sm text-muted-foreground">On the back of your device</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <Button 
          size="xl" 
          className="w-full patela-gradient-primary text-lg font-bold h-16 rounded-2xl patela-shadow-md"
          onClick={handleStartScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <>
              <RotateCcw className="mr-3 h-6 w-6 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <QrCode className="mr-3 h-6 w-6" />
              Start Scanning
            </>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="lg"
          className="w-full text-base h-14"
          onClick={() => navigate("/device/bluetooth")}
        >
          <Bluetooth className="mr-2 h-5 w-5" />
          Use Bluetooth Instead
        </Button>
      </div>
    </div>
  );
}
