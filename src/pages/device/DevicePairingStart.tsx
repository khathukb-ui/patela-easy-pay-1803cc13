import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smartphone, QrCode, Bluetooth, Shield, ArrowRight } from "lucide-react";

export default function DevicePairingStart() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8">
        <div className="flex items-center justify-center gap-2 py-4">
          <div className="h-2 w-8 rounded-full patela-gradient-primary" />
          <div className="h-2 w-8 rounded-full bg-muted" />
          <div className="h-2 w-8 rounded-full bg-muted" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="w-20 h-20 rounded-full patela-gradient-primary flex items-center justify-center mb-6 patela-shadow-md animate-fade-in">
          <Smartphone className="h-10 w-10 text-primary-foreground" />
        </div>

        <h1 className="text-2xl font-bold text-foreground text-center mb-3">
          Pair Your Patela Device
        </h1>
        
        <p className="text-muted-foreground text-center text-lg mb-8 max-w-xs">
          Connect your card machine to start accepting payments
        </p>

        {/* Pairing Methods */}
        <div className="w-full max-w-sm space-y-4 mb-8">
          <div className="flex items-center gap-4 p-4 bg-card rounded-2xl patela-shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">QR Code Scan</p>
              <p className="text-sm text-muted-foreground">Fast & easy pairing</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-card rounded-2xl patela-shadow-sm">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Bluetooth className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Bluetooth</p>
              <p className="text-sm text-muted-foreground">If QR code doesn't work</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-card rounded-2xl patela-shadow-sm">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Secure Connection</p>
              <p className="text-sm text-muted-foreground">Your device is protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <Button 
          size="xl" 
          className="w-full patela-gradient-primary text-lg font-bold h-16 rounded-2xl patela-shadow-md"
          onClick={() => navigate("/device/qr")}
        >
          <QrCode className="mr-3 h-6 w-6" />
          Scan QR Code
          <ArrowRight className="ml-auto h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="w-full text-base h-14 rounded-2xl"
          onClick={() => navigate("/device/bluetooth")}
        >
          <Bluetooth className="mr-2 h-5 w-5" />
          Use Bluetooth Instead
        </Button>
      </div>
    </div>
  );
}
