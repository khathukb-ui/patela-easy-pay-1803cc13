import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Battery,
  Bluetooth,
  RefreshCw,
  Smartphone,
  SignalHigh,
  SignalLow,
  SignalMedium,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  connectPatelaDevice,
  getPairedPatelaDevice,
  savePairedPatelaDevice,
  scanForPatelaDevices,
  type PatelaBluetoothDevice,
  type PatelaSignalStrength,
} from "@/services/patelaBluetooth";

const DeviceBluetooth = () => {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<PatelaBluetoothDevice[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const [pairedDevice, setPairedDevice] =
    useState<PatelaBluetoothDevice | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [connectingDeviceId, setConnectingDeviceId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const savedDevice = getPairedPatelaDevice();

    if (savedDevice) {
      setPairedDevice(savedDevice);

      // Important:
      // Saved device does not mean Bluetooth is connected right now.
      setIsConnected(false);
    }
  }, []);

  const getSignalBars = (signal: PatelaSignalStrength) => {
    if (signal === "strong") {
      return <SignalHigh className="h-4 w-4 text-green-600" />;
    }

    if (signal === "medium") {
      return <SignalMedium className="h-4 w-4 text-yellow-600" />;
    }

    return <SignalLow className="h-4 w-4 text-red-600" />;
  };

  const handleRefresh = async () => {
    try {
      setIsSearching(true);
      setHasSearched(true);
      setScanError(null);
      setDevices([]);

      const foundDevices = await scanForPatelaDevices();

      setDevices(foundDevices);
    } catch (error) {
      console.error("Patela Bluetooth scan failed", error);

      setScanError(
        error instanceof Error
          ? error.message
          : "Unable to scan for Bluetooth devices.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDevice = async (device: PatelaBluetoothDevice) => {
    try {
      setConnectingDeviceId(device.deviceId);
      setScanError(null);

      await connectPatelaDevice(device.deviceId);

      savePairedPatelaDevice(device);
      setPairedDevice(device);
      setIsConnected(true);

      // Keep this if your current flow moves to the next page after connect.
      // Remove it if you want to stay on this screen.
      // navigate("/device/found");
    } catch (error) {
      console.error("Patela Bluetooth pairing failed", error);

      setIsConnected(false);
      setScanError(
        error instanceof Error
          ? error.message
          : "Unable to connect to this device.",
      );
    } finally {
      setConnectingDeviceId(null);
    }
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
          <RefreshCw
            className={`h-5 w-5 text-foreground ${
              isSearching ? "animate-spin" : ""
            }`}
          />
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

        {/* Paired / Connected Device */}
        {pairedDevice && (
          <div
            className={`rounded-xl border p-4 mb-4 ${
              isConnected
                ? "border-green-200 bg-green-50"
                : "border-yellow-200 bg-yellow-50"
            }`}
          >
            <p
              className={`text-sm font-semibold ${
                isConnected ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {isConnected ? "Device Connected" : "Previously Paired Device"}
            </p>

            <p
              className={`text-sm ${
                isConnected ? "text-green-800" : "text-yellow-800"
              }`}
            >
              {pairedDevice.name}
            </p>

            <p
              className={`text-xs ${
                isConnected ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {pairedDevice.model} • {pairedDevice.signal} signal
            </p>

            {!isConnected && (
              <Button
                onClick={() => handleSelectDevice(pairedDevice)}
                variant="outline"
                size="sm"
                className="mt-3 rounded-lg"
                disabled={connectingDeviceId === pairedDevice.deviceId}
              >
                {connectingDeviceId === pairedDevice.deviceId
                  ? "Reconnecting..."
                  : "Reconnect Device"}
              </Button>
            )}
          </div>
        )}

        {/* Initial State - prompt to scan */}
        {!isSearching && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Bluetooth className="h-10 w-10 text-accent" />
              </div>
            </div>

            <p className="text-foreground font-medium mb-1 text-sm">
              Ready to scan
            </p>

            <p className="text-xs text-muted-foreground text-center max-w-xs mb-4">
              Make sure your FP9320, FP9340, FP9810, FP9800 or FP9310 is turned
              on and nearby
            </p>

            <Button
              onClick={handleRefresh}
              variant="default"
              size="lg"
              className="rounded-lg"
            >
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

            <p className="text-foreground font-medium mb-1 text-sm">
              Searching...
            </p>

            <p className="text-xs text-muted-foreground">
              Looking for Patela devices nearby
            </p>
          </div>
        )}

        {/* Device List */}
        {!isSearching && devices.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted-foreground mb-2">
              {devices.length} device{devices.length > 1 ? "s" : ""} found
            </p>

            {devices.map((device) => {
              const isConnecting = connectingDeviceId === device.deviceId;

              return (
                <button
                  key={device.id}
                  onClick={() => handleSelectDevice(device)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-xl patela-shadow-sm hover:bg-muted/50 transition-colors border border-border disabled:opacity-60"
                  disabled={isConnecting || Boolean(connectingDeviceId)}
                >
                  <div className="w-12 h-12 rounded-xl patela-gradient-primary flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary-foreground" />
                  </div>

                  <div className="flex-1 text-left">
                    <p className="font-bold text-foreground">
                      {device.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isConnecting ? "Connecting..." : device.id}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {getSignalBars(device.signal)}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Battery className="h-3 w-3" />
                      <span>
                        {device.battery >= 0
                          ? `${device.battery}%`
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* No Devices Found */}
        {!isSearching && hasSearched && devices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
              {scanError ? (
                <AlertCircle className="h-8 w-8 text-destructive" />
              ) : (
                <Bluetooth className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <p className="text-foreground font-medium mb-1 text-sm">
              {scanError ? "Bluetooth scan failed" : "No Patela devices found"}
            </p>

            <p className="text-xs text-muted-foreground text-center max-w-xs mb-4">
              {scanError ||
                "Make sure your FP9320, FP9340, FP9810, FP9800 or FP9310 is turned on and nearby"}
            </p>

            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="rounded-lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Help Tips */}
        {!isSearching && hasSearched && (
          <div className="mt-6 p-3 bg-muted/50 rounded-xl">
            <h3 className="font-semibold text-foreground text-sm mb-2">
              Can't find your device?
            </h3>

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
};

export default DeviceBluetooth;