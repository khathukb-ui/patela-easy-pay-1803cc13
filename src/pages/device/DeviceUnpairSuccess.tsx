import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Smartphone } from "lucide-react";

export default function DeviceUnpairSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Device Unpaired
        </h1>
        <p className="text-muted-foreground text-base mb-4 max-w-xs">
          Your Patela Pro has been disconnected from your account.
        </p>

        {/* Info Card */}
        <div className="w-full max-w-sm bg-muted/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground text-base">Need a new device?</p>
              <p className="text-sm text-muted-foreground">You can pair a new device anytime</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Button 
            variant="default"
            size="xl" 
            className="w-[300px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            onClick={() => navigate("/device/start")}
          >
            <Smartphone className="mr-2 h-5 w-5" />
            Pair New Device
          </Button>
          
          <Button 
            variant="outline" 
            size="xl"
            className="w-[300px]"
            onClick={() => navigate("/home")}
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
