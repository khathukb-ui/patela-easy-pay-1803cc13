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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Device Visual */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl border-2 border-primary/20">
            <img 
              src={patelaDeviceBox} 
              alt="Patela payment device" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Connection Status Badge */}
          <div className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center ${
            isConnecting ? "bg-accent" : "bg-success"
          }`}>
            {isConnecting ? (
              <Loader2 className="h-6 w-6 text-accent-foreground animate-spin" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-success-foreground" />
            )}
          </div>

          {/* Connecting pulse */}
          {isConnecting && (
            <div className="absolute -inset-2 rounded-3xl border-2 border-accent/50 animate-ping" style={{ animationDuration: "1.5s" }} />
          )}
        </div>

        {/* Status Text */}
        {isConnecting ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Connecting...
            </h1>
            <p className="text-muted-foreground mb-6">
              Please wait while we connect to your device
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-accent transition-all duration-200"
                style={{ width: `${connectionProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{connectionProgress}%</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Device Connected!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your Patela device is ready to use
            </p>

            {/* Device Info Card */}
            <div className="w-full max-w-sm bg-card rounded-2xl patela-shadow-sm border border-primary/10 p-5 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-primary/20">
                  <img 
                    src={patelaDeviceBox} 
                    alt="Patela device" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-bold text-foreground text-lg">{deviceName}</p>
                  <p className="text-sm text-muted-foreground">{deviceId}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Battery className={`h-5 w-5 ${battery > 20 ? "text-success" : "text-destructive"}`} />
                  <span className="text-foreground font-medium">{battery}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-success" />
                  <span className="text-success font-medium">Connected</span>
                </div>
              </div>
            </div>

            <Button 
              size="xl" 
              className="w-full max-w-sm bg-accent text-accent-foreground text-lg font-bold h-16 rounded-2xl patela-shadow-accent hover:bg-accent/90"
              onClick={() => navigate("/device/success")}
            >
              <CheckCircle2 className="mr-3 h-6 w-6" />
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}