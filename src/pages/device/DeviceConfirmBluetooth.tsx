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
        <div className="w-full max-w-sm bg-card rounded-3xl patela-shadow-md overflow-hidden mb-8">
          <div className="patela-gradient-primary p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground mb-1">{deviceName}</h2>
            <p className="text-primary-foreground/80">{deviceId}</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Battery className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Battery</span>
              </div>
              <span className={`font-bold ${battery > 20 ? "text-success" : "text-destructive"}`}>
                {battery}%
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Bluetooth className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Connection</span>
              </div>
              <span className="text-accent font-bold">Bluetooth</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="w-full max-w-sm bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Press the green button</p>
              <p className="text-sm text-muted-foreground">
                On your Patela device to confirm pairing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6">
        <Button 
          size="xl" 
          className="w-full patela-gradient-primary text-lg font-bold h-16 rounded-2xl patela-shadow-md"
          onClick={handlePair}
          disabled={isPairing}
        >
          {isPairing ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Waiting for confirmation...
            </>
          ) : (
            <>
              <Bluetooth className="mr-3 h-6 w-6" />
              Pair This Device
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
