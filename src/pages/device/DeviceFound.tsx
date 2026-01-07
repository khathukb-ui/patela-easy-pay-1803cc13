import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Battery, Wifi, CheckCircle2, Loader2 } from "lucide-react";
import patelaDeviceBox from "@/assets/patela-device-box.jpg";

export default function DeviceFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionProgress, setConnectionProgress] = useState(0);
  
  const { deviceName, deviceId, battery } = location.state || {
    deviceName: "Patela Pro",
    deviceId: "PTL-2024-7842",
    battery: 85,
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsConnecting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Device Visual */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
            <img 
              src={patelaDeviceBox} 
              alt="Patela payment device" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Connection Status Badge */}
          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center ${
            isConnecting ? "bg-accent" : "bg-success"
          }`}>
            {isConnecting ? (
              <Loader2 className="h-5 w-5 text-accent-foreground animate-spin" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-success-foreground" />
            )}
          </div>

          {/* Connecting pulse */}
          {isConnecting && (
            <div className="absolute -inset-2 rounded-2xl border-2 border-accent/50 animate-ping" style={{ animationDuration: "1.5s" }} />
          )}
        </div>

        {/* Status Text */}
        {isConnecting ? (
          <>
            <h1 className="text-xl font-bold text-foreground mb-1">
              Connecting...
            </h1>
            <p className="text-muted-foreground text-sm mb-4">
              Please wait while we connect to your device
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-accent transition-all duration-200"
                style={{ width: `${connectionProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{connectionProgress}%</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-foreground mb-1">
              Device Connected!
            </h1>
            <p className="text-muted-foreground text-sm mb-4">
              Your Patela device is ready to use
            </p>

            {/* Device Info Card */}
            <div className="w-full max-w-sm bg-card rounded-xl patela-shadow-sm border border-primary/10 p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-primary/20">
                  <img 
                    src={patelaDeviceBox} 
                    alt="Patela device" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground">{deviceName}</p>
                  <p className="text-xs text-muted-foreground">{deviceId}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Battery className={`h-4 w-4 ${battery > 20 ? "text-success" : "text-destructive"}`} />
                  <span className="text-foreground font-medium text-sm">{battery}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-success" />
                  <span className="text-success font-medium text-sm">Connected</span>
                </div>
              </div>
            </div>

            <Button 
              variant="default"
              size="default" 
              className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              onClick={() => navigate("/device/success")}
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}