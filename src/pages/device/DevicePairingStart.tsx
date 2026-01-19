import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Bluetooth, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import patelaDeviceBox from "@/assets/patela-device-box.jpg";

export default function DevicePairingStart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-3 pt-6">
        <div className="flex items-center justify-center gap-1.5 py-2">
          <div className="h-1.5 w-6 rounded-full bg-accent" />
          <div className="h-1.5 w-6 rounded-full bg-muted" />
          <div className="h-1.5 w-6 rounded-full bg-muted" />
        </div>
      </div>

      {/* Content - Single connected section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Device Image */}
        <div className="relative w-40 h-40 mb-3 animate-patela-bounce-in">
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
            <img 
              src={patelaDeviceBox} 
              alt="Patela payment device" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Pulse ring */}
          <div className="absolute -inset-2.5 rounded-2xl border-2 border-accent/50 animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        <h1 className="text-3xl font-bold text-foreground text-center mb-1">
          {t("pairDevice")}
        </h1>
        
        <p className="text-muted-foreground text-center text-lg mb-2 max-w-sm">
          {t("pairDeviceDesc")}
        </p>

        <p className="text-base text-muted-foreground text-center mb-4">
          Choose how you'd like to pair your device:
        </p>

        {/* Actions inline with content */}
        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default"
            size="xl" 
            className="w-[300px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
            onClick={() => navigate("/device/qr")}
          >
            <QrCode className="mr-2 h-6 w-6" />
            {t("scanQrCode")}
          </Button>
          
          <Button 
            variant="default" 
            size="xl"
            className="w-[300px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
            onClick={() => navigate("/device/bluetooth")}
          >
            <Bluetooth className="mr-2 h-6 w-6" />
            {t("useBluetooth")}
          </Button>
        </div>

        {/* Skip Option */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleSkip}
          >
            <Clock className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
          <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
            Pair your device later to accept card and tap-to-pay payments. Cash sales work without a device.
          </p>
        </div>
      </div>
    </div>
  );
}