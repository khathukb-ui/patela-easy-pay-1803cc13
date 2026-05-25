import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Battery, Wifi, CheckCircle2, Loader2 } from "lucide-react";
import patelaDeviceBox from "@/assets/patela-device-box.jpg";
import { getPatelaQposBattery } from "@/plugins/patelaQpos";
import {
  getPairedPatelaDevice,
  savePairedPatelaDevice,
} from "@/services/patelaBluetooth";

export default function DeviceFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState<number>(-1);
  const [isBatteryLoading, setIsBatteryLoading] = useState(false);

  const locationState = location.state || {};

  const pairedDevice = getPairedPatelaDevice();

  const deviceName =
    locationState.deviceName ||
    pairedDevice?.name ||
    "Patela Pro";

  const deviceId =
    locationState.deviceId ||
    pairedDevice?.deviceId ||
    pairedDevice?.id ||
    "PTL-2024-7842";

  const initialBattery =
    typeof locationState.battery === "number"
      ? locationState.battery
      : typeof pairedDevice?.battery === "number"
        ? pairedDevice.battery
        : -1;

  const getBatteryLabel = (battery: number): string => {
    if (battery < 0) {
      return "Checking...";
    }

    return `${battery}%`;
  };

  const getBatteryIconClass = (battery: number): string => {
    if (battery < 0) {
      return "text-muted-foreground";
    }

    if (battery <= 20) {
      return "text-destructive";
    }

    return "text-success";
  };

  const refreshBattery = async () => {
    const savedDevice = getPairedPatelaDevice();

    if (!savedDevice?.name) {
      console.warn("PATELA BATTERY: No paired device found.");
      return;
    }

    try {
      setIsBatteryLoading(true);

      console.log("PATELA BATTERY REFRESH START:", {
        deviceName: savedDevice.name,
      });

      const battery = await getPatelaQposBattery(savedDevice.name);

      console.log("PATELA BATTERY VALUE:", battery);

      if (typeof battery !== "number" || battery < 0) {
        setBatteryLevel(-1);
        return;
      }

      const updatedDevice = {
        ...savedDevice,
        battery,
      };

      savePairedPatelaDevice(updatedDevice);
      setBatteryLevel(battery);

      console.log("PATELA BATTERY UPDATED:", updatedDevice);
    } catch (error) {
      console.warn("Unable to read Patela battery:", error);
      setBatteryLevel(-1);
    } finally {
      setIsBatteryLoading(false);
    }
  };

  useEffect(() => {
    setBatteryLevel(initialBattery);
  }, [initialBattery]);

  useEffect(() => {
    const progressInterval = window.setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(progressInterval);
          setIsConnecting(false);
          return 100;
        }

        return prev + 10;
      });
    }, 200);

    return () => window.clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (!isConnecting) {
      void refreshBattery();
    }
  }, [isConnecting]);

  return (
    <div className="min-h-screen patela-app-bg flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Device Visual */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
            <img
              src={patelaDeviceBox}
              alt="Patela payment device"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Connection Status Badge */}
          <div
            className={`absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center ${
              isConnecting ? "bg-accent" : "bg-success"
            }`}
          >
            {isConnecting ? (
              <Loader2 className="h-6 w-6 text-accent-foreground animate-spin" />
            ) : (
              <CheckCircle2 className="h-6 w-6 text-success-foreground" />
            )}
          </div>

          {/* Connecting pulse */}
          {isConnecting && (
            <div
              className="absolute -inset-2 rounded-2xl border-2 border-accent/50 animate-ping"
              style={{ animationDuration: "1.5s" }}
            />
          )}
        </div>

        {/* Status Text */}
        {isConnecting ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Connecting...
            </h1>

            <p className="text-muted-foreground text-base mb-4">
              Please wait while we connect to your device
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs h-2.5 bg-muted rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-accent transition-all duration-200"
                style={{ width: `${connectionProgress}%` }}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {connectionProgress}%
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Device Connected!
            </h1>

            <p className="text-muted-foreground text-base mb-4">
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
                <button
                  type="button"
                  onClick={() => void refreshBattery()}
                  disabled={isBatteryLoading}
                  className="flex items-center gap-2 rounded-lg px-2 py-1 -ml-2 transition-colors hover:bg-secondary disabled:opacity-70"
                >
                  {isBatteryLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : (
                    <Battery
                      className={`h-4 w-4 ${getBatteryIconClass(
                        batteryLevel,
                      )}`}
                    />
                  )}

                  <span className="text-foreground font-medium text-sm">
                    {isBatteryLoading
                      ? "Checking..."
                      : getBatteryLabel(batteryLevel)}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-success" />
                  <span className="text-success font-medium text-sm">
                    Connected
                  </span>
                </div>
              </div>

              {batteryLevel < 0 && !isBatteryLoading && (
                <p className="mt-2 text-xs text-muted-foreground text-left">
                  Battery level not available yet. Tap the battery area to
                  retry.
                </p>
              )}
            </div>

            <Button
              variant="default"
              size="xl"
              className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              onClick={() => navigate("/device/success")}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Continue
            </Button>
          </>
        )}
      </div>
    </div>
  );
}