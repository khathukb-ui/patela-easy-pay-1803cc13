import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bluetooth, Smartphone, RefreshCw, Loader2, Battery, Signal } from "lucide-react";

interface Device {
  id: string;
  name: string;
  battery: number;
  signal: "strong" | "medium" | "weak";
}

const handleScan = async (): Promise<Device[]> => {
  // In a real Capacitor app, this would use the Bluetooth plugin.
  // In browser, Web Bluetooth API is used if available.
  if ('bluetooth' in navigator) {
    try {
      const btDevice = await (navigator as any).bluetooth.requestDevice({
        filters: [{ namePrefix: 'FP9320' }],
        optionalServices: [],
      });
      if (btDevice) {
        return [{
          id: btDevice.id || `FP9320-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          name: btDevice.name || 'FP9320',
          battery: 0,
          signal: 'strong' as const,
        }];
      }
    } catch {
      // User cancelled or no device found
    }
  }
  return [];
};

export default function DeviceBluetooth() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleRefresh = async () => {
    setIsSearching(true);
    setDevices([]);
    try {
      const found = await handleScan();
      setDevices(found);
    } catch {
      setDevices([]);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const handleSelectDevice = (device: Device) => {
    navigate("/device/confirm-bluetooth", { 
      state: { 
        deviceName: device.name,
        deviceId: device.id,
        battery: device.battery,
        method: "bluetooth"
      } 
    });
  };

  const getSignalBars = (signal: Device["signal"]) => {
    const bars = signal === "strong" ? 3 : signal === "medium" ? 2 : 1;
    return (
      <div className="flex gap-0.5 items-end">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1 rounded-full ${i <= bars ? "bg-success" : "bg-muted"}`}
            style={{ height: `${i * 4 + 4}px` }}
          />
        ))}
      </div>
    );
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
        <button 
          onClick={handleRefresh}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
          disabled={isSearching}
        >
          <RefreshCw className={`h-5 w-5 text-foreground ${isSearching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 patela-form-container py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Bluetooth className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Find Nearby Devices
            </h1>
            <p className="text-xs text-muted-foreground">
              Turn on your Patela machine
            </p>
          </div>
        </div>

        {/* Initial State - prompt to scan */}
        {!isSearching && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Bluetooth className="h-10 w-10 text-accent" />
              </div>
            </div>
            <p className="text-foreground font-medium mb-1 text-sm">Ready to scan</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs mb-4">
              Make sure your FP9320 is turned on and nearby
            </p>
            <Button onClick={handleRefresh} variant="default" size="lg" className="rounded-lg">
              <Bluetooth className="mr-2 h-4 w-4" />
              Scan for Devices
            </Button>
          </div>
        )}

        {/* Searching State */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Bluetooth className="h-10 w-10 text-accent" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping" />
            </div>
            <p className="text-foreground font-medium mb-1 text-sm">Searching...</p>
            <p className="text-xs text-muted-foreground">Looking for FP9320 devices nearby</p>
          </div>
        )}

        {/* Device List */}
        {!isSearching && devices.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              {devices.length} device{devices.length > 1 ? "s" : ""} found
            </p>
            
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => handleSelectDevice(device)}
                className="w-full flex items-center gap-3 p-3 bg-card rounded-xl patela-shadow-sm hover:bg-muted/50 transition-colors border border-border"
              >
                <div className="w-12 h-12 rounded-xl patela-gradient-primary flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-foreground">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.id}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getSignalBars(device.signal)}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Battery className="h-3 w-3" />
                    <span>{device.battery}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Devices Found */}
        {!isSearching && hasSearched && devices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bluetooth className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1 text-sm">No FP9320 devices found</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs mb-4">
              Make sure your FP9320 is turned on and nearby
            </p>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="rounded-lg">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Help Tips */}
        {!isSearching && hasSearched && (
          <div className="mt-6 p-3 bg-muted/50 rounded-xl">
            <h3 className="font-semibold text-foreground text-sm mb-2">Can't find your device?</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Turn on your Patela machine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Enable Bluetooth on your phone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Keep the device within 2 meters</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
