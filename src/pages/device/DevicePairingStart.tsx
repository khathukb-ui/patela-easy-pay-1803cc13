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
      <div className="p-4 pt-8">
        <div className="flex items-center justify-center gap-2 py-4">
          <div className="h-2 w-8 rounded-full bg-accent" />
          <div className="h-2 w-8 rounded-full bg-muted" />
          <div className="h-2 w-8 rounded-full bg-muted" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Device Image */}
        <div className="relative w-36 h-36 mb-6 animate-patela-bounce-in">
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl border-2 border-primary/20">
            <img 
              src={patelaDeviceBox} 
              alt="Patela payment device" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Pulse ring */}
          <div className="absolute -inset-2 rounded-2xl border-2 border-accent/50 animate-ping" style={{ animationDuration: "2s" }} />
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-3">
          {t("pairDevice")}
        </h1>
        
        <p className="text-muted-foreground text-center text-lg mb-6 max-w-xs">
          {t("pairDeviceDesc")}
        </p>

        {/* Clear instruction */}
        <div className="w-full max-w-sm bg-secondary/50 rounded-xl p-4 mb-8">
          <p className="text-sm text-muted-foreground text-center">
            Choose how you'd like to pair your device:
          </p>
        </div>
      </div>

      {/* Bottom Actions - Premium button styling */}
      <div className="p-6 flex flex-col items-center gap-4">
        <Button 
          variant="default"
          size="lg" 
          className="min-w-[220px] shadow-lg hover:shadow-xl border border-primary/10 transition-all duration-200 active:scale-95 hover:scale-[1.02]"
          onClick={() => navigate("/device/qr")}
        >
          <QrCode className="mr-2 h-5 w-5" />
          {t("scanQrCode")}
        </Button>
        
        <Button 
          variant="default" 
          size="lg"
          className="min-w-[220px] shadow-lg hover:shadow-xl border border-primary/10 transition-all duration-200 active:scale-95 hover:scale-[1.02]"
          onClick={() => navigate("/device/bluetooth")}
        >
          {t("useBluetooth")}
        </Button>
      </div>
    </div>
  );
}