import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Battery, Bluetooth, CheckCircle2, Loader2 } from "lucide-react";

export default function DeviceConfirmBluetooth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPairing, setIsPairing] = useState(false);
  
  const { deviceName, deviceId, battery } = location.state || {
    deviceName: "Patela Pro",
    deviceId: "PTL-2024-7842",
    battery: 85
  };

  const handlePair = () => {
    setIsPairing(true);
    // Simulate pairing process
    setTimeout(() => {
      navigate("/device/found", { 
        state: { deviceName, deviceId, battery, method: "bluetooth" } 
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 flex items-center">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground pr-10">
          Confirm Device
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Device Card */}
        <div className="w-full max-w-sm bg-card rounded-xl patela-shadow-md overflow-hidden mb-4">
          <div className="patela-gradient-primary p-5 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-primary-foreground mb-1">{deviceName}</h2>
            <p className="text-primary-foreground/80 text-sm">{deviceId}</p>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Battery</span>
              </div>
              <span className={`font-bold text-sm ${battery > 20 ? "text-success" : "text-destructive"}`}>
                {battery}%
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Bluetooth className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">Connection</span>
              </div>
              <span className="text-accent font-bold text-sm">Bluetooth</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="w-full max-w-sm bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm mb-0.5">Press the green button</p>
              <p className="text-xs text-muted-foreground">
                On your Patela device to confirm pairing
              </p>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="default"
          size="default" 
          className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          onClick={handlePair}
          disabled={isPairing}
        >
          {isPairing ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              Waiting for confirmation...
            </>
          ) : (
            <>
              <Bluetooth className="mr-1.5 h-4 w-4" />
              Pair This Device
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
