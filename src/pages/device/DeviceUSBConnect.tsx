import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Usb, Loader2, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

type ConnectionState = "waiting" | "detecting" | "connected" | "error";

export default function DeviceUSBConnect() {
  const navigate = useNavigate();
  const [state, setState] = useState<ConnectionState>("waiting");

  const handleConnect = () => {
    setState("detecting");
    // Simulate USB detection
    setTimeout(() => {
      setState("connected");
    }, 2500);
  };

  const handleContinue = () => {
    navigate("/device/found", {
      state: {
        deviceName: "FP9320",
        deviceId: "FP9320-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        battery: 100,
        method: "usb",
      },
    });
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/device/start")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-6 rounded-full bg-success" />
          <div className="h-2 w-6 rounded-full patela-gradient-primary" />
          <div className="h-2 w-6 rounded-full bg-muted" />
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Icon */}
        <div className="relative mb-4">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            state === "connected" ? "bg-success/10" : state === "error" ? "bg-destructive/10" : "bg-accent/10"
          }`}>
            {state === "detecting" ? (
              <Loader2 className="h-12 w-12 text-accent animate-spin" />
            ) : state === "connected" ? (
              <CheckCircle2 className="h-12 w-12 text-success" />
            ) : state === "error" ? (
              <AlertTriangle className="h-12 w-12 text-destructive" />
            ) : (
              <Usb className="h-12 w-12 text-accent" />
            )}
          </div>
          {state === "detecting" && (
            <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping" />
          )}
        </div>

        {state === "waiting" && (
          <>
            <h1 className="text-2xl font-bold text-foreground text-center mb-1">
              USB Connection
            </h1>
            <p className="text-muted-foreground text-center text-base mb-6 max-w-xs">
              Connect your FP9320 device using the USB cable provided in the box
            </p>

            {/* Steps */}
            <div className="w-full max-w-sm bg-card rounded-xl border border-border p-4 mb-6">
              <h3 className="font-semibold text-foreground text-sm mb-3">Setup Steps:</h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Turn on the FP9320 device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Connect the USB cable to the device</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Plug the other end into your phone/tablet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Tap "Detect Device" below</span>
                </li>
              </ol>
            </div>

            <Button
              variant="default"
              size="xl"
              className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              onClick={handleConnect}
            >
              <Usb className="mr-2 h-5 w-5" />
              Detect Device
            </Button>
          </>
        )}

        {state === "detecting" && (
          <>
            <h1 className="text-2xl font-bold text-foreground text-center mb-1">
              Detecting Device...
            </h1>
            <p className="text-muted-foreground text-center text-base max-w-xs">
              Looking for FP9320 on USB connection
            </p>
          </>
        )}

        {state === "connected" && (
          <>
            <h1 className="text-2xl font-bold text-foreground text-center mb-1">
              FP9320 Detected!
            </h1>
            <p className="text-muted-foreground text-center text-base mb-6 max-w-xs">
              Device found on USB. Ready to pair.
            </p>

            <Button
              variant="default"
              size="xl"
              className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              onClick={handleContinue}
            >
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Continue Pairing
            </Button>
          </>
        )}

        {state === "error" && (
          <>
            <h1 className="text-2xl font-bold text-foreground text-center mb-1">
              Device Not Found
            </h1>
            <p className="text-muted-foreground text-center text-base mb-6 max-w-xs">
              Make sure the USB cable is properly connected and the FP9320 is turned on
            </p>

            <Button
              variant="default"
              size="xl"
              className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              onClick={() => { setState("waiting"); }}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
          </>
        )}

        {/* Alternative */}
        {state === "waiting" && (
          <div className="mt-4">
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={() => navigate("/device/bluetooth")}
            >
              Use Bluetooth instead
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
