import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bluetooth, Smartphone, RefreshCw, Loader2, Battery, Signal } from "lucide-react";

interface Device {
  id: string;
  name: string;
  battery: number;
  signal: "strong" | "medium" | "weak";
}

const MOCK_DEVICES: Device[] = [
  { id: "PTL-2024-7842", name: "Patela Pro", battery: 85, signal: "strong" },
  { id: "PTL-2024-3156", name: "Patela Mini", battery: 42, signal: "medium" },
];

export default function DeviceBluetooth() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // Simulate device discovery
    const timer = setTimeout(() => {
      setDevices(MOCK_DEVICES);
      setIsSearching(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsSearching(true);
    setDevices([]);
    setTimeout(() => {
      setDevices(MOCK_DEVICES);
      setIsSearching(false);
    }, 2000);
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 flex items-center justify-between">
        <button 
          onClick={() => navigate("/device/start")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-8 rounded-full bg-success" />
          <div className="h-2 w-8 rounded-full patela-gradient-primary" />
          <div className="h-2 w-8 rounded-full bg-muted" />
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
      <div className="flex-1 px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Bluetooth className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Find Nearby Devices
            </h1>
            <p className="text-sm text-muted-foreground">
              Turn on your Patela machine
            </p>
          </div>
        </div>

        {/* Searching State */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center">
                <Bluetooth className="h-12 w-12 text-accent" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-ping" />
            </div>
            <p className="text-foreground font-medium mb-2">Searching...</p>
            <p className="text-sm text-muted-foreground">Looking for Patela devices nearby</p>
          </div>
        )}

        {/* Device List */}
        {!isSearching && devices.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              {devices.length} device{devices.length > 1 ? "s" : ""} found
            </p>
            
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => handleSelectDevice(device)}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl patela-shadow-sm hover:bg-muted/50 transition-colors"
              >
                <div className="w-14 h-14 rounded-2xl patela-gradient-primary flex items-center justify-center">
                  <Smartphone className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-foreground text-lg">{device.name}</p>
                  <p className="text-sm text-muted-foreground">{device.id}</p>
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
        {!isSearching && devices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bluetooth className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-2">No devices found</p>
            <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
              Make sure your Patela machine is turned on and nearby
            </p>
            <Button onClick={handleRefresh} variant="outline" className="rounded-xl">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Help Tips */}
        {!isSearching && (
          <div className="mt-8 p-4 bg-muted/50 rounded-2xl">
            <h3 className="font-semibold text-foreground mb-3">Can't find your device?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Turn on your Patela machine</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Make sure Bluetooth is on in your phone settings</span>
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
