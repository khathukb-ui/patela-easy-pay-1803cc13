import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Smartphone,
  Battery,
  Wifi,
  RefreshCw,
  Unlink,
  Share2,
  AlertTriangle,
  Bluetooth,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

import {
  getPairedPatelaDevice,
  disconnectPatelaDevice,
  type PatelaBluetoothDevice,
} from "@/services/patelaBluetooth";

export default function DeviceManagement() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [device, setDevice] = useState<PatelaBluetoothDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    const savedDevice = getPairedPatelaDevice();

    if (savedDevice) {
      setDevice(savedDevice);

      // Important:
      // LocalStorage means previously paired, not currently connected.
      setIsConnected(false);
    }
  }, []);

  const handleReconnect = () => {
    navigate("/device/bluetooth");
  };

  const handleUnpairLocalDevice = async () => {
    if (!device) {
      return;
    }

    try {
      setIsDisconnecting(true);

      try {
        await disconnectPatelaDevice(device.deviceId);
      } catch {
        // Ignore disconnect errors because the device may already be disconnected.
      }

      localStorage.removeItem("patela-paired-device");

      setDevice(null);
      setIsConnected(false);

      navigate("/device/start");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 flex items-center">
        <button
          onClick={() => navigate("/account")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>

        <h1 className="flex-1 text-center text-lg font-bold text-foreground pr-10">
          {t("deviceManagement")}
        </h1>
      </div>

      {/* No Device State */}
      {!device && (
        <div className="flex-1 px-6 py-8">
          <div className="bg-card rounded-3xl patela-shadow-md p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Bluetooth className="h-10 w-10 text-accent" />
            </div>

            <h2 className="text-lg font-bold text-foreground mb-2">
              No Device Paired
            </h2>

            <p className="text-sm text-muted-foreground mb-5">
              You do not have a Patela device saved on this phone yet.
            </p>

            <Button
              onClick={() => navigate("/device/bluetooth")}
              variant="default"
              className="rounded-xl"
            >
              <Bluetooth className="mr-2 h-4 w-4" />
              Pair Device
            </Button>
          </div>
        </div>
      )}

      {/* Device Card */}
      {device && (
        <>
          <div className="px-6 py-4">
            <div className="bg-card rounded-3xl patela-shadow-md overflow-hidden">
              <div className="patela-gradient-primary p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-primary-foreground" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-primary-foreground">
                      {device.name}
                    </h2>

                    <p className="text-primary-foreground/80">
                      {device.deviceId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Battery className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("battery")}
                    </span>
                  </div>

                  <span
                    className={`font-bold ${
                      device.battery > 20 ? "text-success" : "text-muted-foreground"
                    }`}
                  >
                    {device.battery >= 0 ? `${device.battery}%` : "Unknown"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("status")}
                    </span>
                  </div>

                  <span
                    className={`flex items-center gap-2 font-bold ${
                      isConnected ? "text-success" : "text-yellow-600"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-success" : "bg-yellow-500"
                      }`}
                    />

                    {isConnected ? t("connected") : "Previously Paired"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {t("lastSync")}
                    </span>
                  </div>

                  <span className="font-medium text-foreground">
                    Not synced yet
                  </span>
                </div>

                {!isConnected && (
                  <div className="pt-2">
                    <Button
                      onClick={handleReconnect}
                      variant="default"
                      className="w-full rounded-xl"
                    >
                      <Bluetooth className="mr-2 h-4 w-4" />
                      Reconnect Device
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 px-6 py-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Device Actions
            </h3>

            <div className="space-y-3">
              {/* Transfer Device */}
              <button
                onClick={() => navigate("/device/transfer")}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-accent" />
                </div>

                <div className="flex-1 text-left">
                  <p className="font-semibold text-foreground">
                    {t("transferDevice")}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {t("transferDesc")}
                  </p>
                </div>
              </button>

              {/* Unpair Device */}
              <button
                onClick={handleUnpairLocalDevice}
                disabled={isDisconnecting}
                className="w-full flex items-center gap-4 p-4 bg-card rounded-2xl border border-destructive/20 hover:bg-destructive/5 transition-colors disabled:opacity-60"
              >
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Unlink className="h-6 w-6 text-destructive" />
                </div>

                <div className="flex-1 text-left">
                  <p className="font-semibold text-destructive">
                    {isDisconnecting ? "Unpairing..." : t("unpairDevice")}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {t("unpairDesc")}
                  </p>
                </div>
              </button>
            </div>

            {/* Warning Note */}
            <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />

                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t("warning")}:
                  </p>

                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    <li>• Device is remembered on this phone</li>
                    <li>• Reconnect to confirm the live Bluetooth connection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}