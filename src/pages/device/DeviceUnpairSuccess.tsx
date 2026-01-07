import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Smartphone } from "lucide-react";

export default function DeviceUnpairSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-foreground mb-1">
          Device Unpaired
        </h1>
        <p className="text-muted-foreground text-sm mb-4 max-w-xs">
          Your Patela Pro has been disconnected from your account.
        </p>

        {/* Info Card */}
        <div className="w-full max-w-sm bg-muted/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Need a new device?</p>
              <p className="text-xs text-muted-foreground">You can pair a new device anytime</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default"
            size="default" 
            className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => navigate("/device/start")}
          >
            <Smartphone className="mr-1.5 h-4 w-4" />
            Pair New Device
          </Button>
          
          <Button 
            variant="outline" 
            size="default"
            className="w-[220px]"
            onClick={() => navigate("/home")}
          >
            <Home className="mr-1.5 h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
