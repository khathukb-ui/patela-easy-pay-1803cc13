import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { QrCode, Bluetooth, Shield, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import patelaDeviceBox from "@/assets/patela-device-box.jpg";

export default function DevicePairingStart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
        <div className="relative w-32 h-32 mb-3 animate-patela-bounce-in">
          <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg border-2 border-primary/20">
            <img 
              src={patelaDeviceBox} 
              alt="Patela payment device" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Pulse ring */}
          <div className="absolute -inset-2 rounded-xl border-2 border-accent/50 animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-1">
          {t("pairDevice")}
        </h1>
        
        <p className="text-muted-foreground text-center text-base mb-2 max-w-xs">
          {t("pairDeviceDesc")}
        </p>

        <p className="text-sm text-muted-foreground text-center mb-4">
          Choose how you'd like to pair your device:
        </p>

        {/* Actions inline with content */}
        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default"
            size="lg" 
            className="w-[260px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
            onClick={() => navigate("/device/qr")}
          >
            <QrCode className="mr-2 h-5 w-5" />
            {t("scanQrCode")}
          </Button>
          
          <Button 
            variant="default" 
            size="lg"
            className="w-[260px] shadow-md hover:shadow-lg border border-primary/10 transition-all duration-200 active:scale-95"
            onClick={() => navigate("/device/bluetooth")}
          >
            {t("useBluetooth")}
          </Button>
        </div>
      </div>
    </div>
  );
}