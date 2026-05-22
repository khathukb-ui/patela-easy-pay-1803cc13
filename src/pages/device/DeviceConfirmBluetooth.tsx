import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { connectPatelaDevice, savePairedPatelaDevice, type PatelaBluetoothDevice } from "@/services/patelaBluetooth";
import { ArrowLeft, Smartphone, Battery, Bluetooth, CheckCircle2, Loader2 } from "lucide-react";

export default function DeviceConfirmBluetooth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPairing, setIsPairing] = useState(false);
  const [pairingError, setPairingError] = useState<string | null>(null);
  
  const { deviceName, deviceId, battery, device } = location.state || {
    deviceName: "Patela Pro",
    deviceId: "PTL-2024-7842",
    battery: 0,
    device: null,
  };

  const handlePair = async () => {
    setIsPairing(true);
    setPairingError(null);

    try {
      await connectPatelaDevice(deviceId);

      const pairedDevice: PatelaBluetoothDevice = device || {
        id: deviceId,
        deviceId,
        name: deviceName,
        model: deviceName,
        battery,
        signal: "medium",
      };

      savePairedPatelaDevice(pairedDevice);

      navigate("/device/found", { 
        state: { deviceName, deviceId, battery, method: "bluetooth", device: pairedDevice } 
      });
    } catch (error) {
      console.error("Patela Bluetooth pairing failed", error);
      setPairingError(
        error instanceof Error
          ? error.message
          : "Could not connect to the Patela device. Please try again."
      );
    } finally {
      setIsPairing(false);
    }
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
            <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground mb-1">{deviceName}</h2>
            <p className="text-primary-foreground/80 text-base">{deviceId}</p>
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
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-base mb-0.5">Press the green button</p>
              <p className="text-sm text-muted-foreground">
                On your Patela device to confirm pairing
              </p>
            </div>
          </div>
        </div>

        {pairingError && (
          <div className="w-full max-w-sm bg-destructive/10 border border-destructive/20 rounded-xl p-3 mb-4">
            <p className="text-sm text-destructive text-center">{pairingError}</p>
          </div>
        )}

        {/* Action */}
        <Button 
          variant="default"
          size="xl" 
          className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          onClick={handlePair}
          disabled={isPairing}
        >
          {isPairing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Waiting for confirmation...
            </>
          ) : (
            <>
              <Bluetooth className="mr-2 h-5 w-5" />
              Pair This Device
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
