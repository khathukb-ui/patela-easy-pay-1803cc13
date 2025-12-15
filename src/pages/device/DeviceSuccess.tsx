import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, CreditCard, ArrowRight, Smartphone } from "lucide-react";

export default function DeviceSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Success Animation */}
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-14 w-14 text-success" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-success animate-ping opacity-20" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Device Paired!
        </h1>
        <p className="text-muted-foreground mb-8 max-w-xs text-lg">
          Your Patela machine is connected and ready to accept payments
        </p>

        {/* Device Summary Card */}
        <div className="w-full max-w-sm bg-card rounded-3xl patela-shadow-md overflow-hidden mb-8">
          <div className="patela-gradient-primary p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-primary-foreground/80 text-sm">Paired Device</p>
                <p className="text-primary-foreground font-bold text-lg">Patela Pro</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="flex items-center gap-2 text-success font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="w-full max-w-sm mb-8">
          <h3 className="font-semibold text-foreground mb-3 text-left">Ready to go!</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <span className="text-foreground">Phone verified</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <span className="text-foreground">Bank account linked</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <span className="text-foreground">Device connected</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Button 
            size="xl" 
            className="w-full patela-gradient-primary text-lg font-bold h-16 rounded-2xl patela-shadow-md"
            onClick={() => navigate("/home")}
          >
            <CreditCard className="mr-3 h-5 w-5" />
            Start Taking Payments
            <ArrowRight className="ml-auto h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
