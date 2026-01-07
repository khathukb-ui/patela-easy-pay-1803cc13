import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, CreditCard, ArrowRight, Smartphone } from "lucide-react";

export default function DeviceSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Success Animation */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-success animate-ping opacity-20" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-1">
          Device Paired!
        </h1>
        <p className="text-muted-foreground text-sm mb-4 max-w-xs">
          Your Patela machine is connected and ready to accept payments
        </p>

        {/* Device Summary Card */}
        <div className="w-full max-w-sm bg-card rounded-xl patela-shadow-md overflow-hidden mb-4">
          <div className="patela-gradient-primary p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-primary-foreground/80 text-xs">Paired Device</p>
                <p className="text-primary-foreground font-bold">Patela Pro</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Status</span>
              <span className="flex items-center gap-2 text-success font-semibold text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="w-full max-w-sm mb-4">
          <h3 className="font-semibold text-foreground mb-2 text-left text-sm">Ready to go!</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-success" />
              </div>
              <span className="text-foreground text-sm">Phone verified</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-success" />
              </div>
              <span className="text-foreground text-sm">Bank account linked</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-success" />
              </div>
              <span className="text-foreground text-sm">Device connected</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <Button 
          variant="default"
          size="default" 
          className="w-[220px] shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          onClick={() => navigate("/home")}
        >
          <CreditCard className="mr-1.5 h-4 w-4" />
          Start Taking Payments
        </Button>
      </div>
    </div>
  );
}
