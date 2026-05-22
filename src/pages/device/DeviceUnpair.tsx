import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PinInput } from "@/components/patela/PinInput";
import { ArrowLeft, Unlink, AlertTriangle, Loader2 } from "lucide-react";

export default function DeviceUnpair() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePinComplete = (value: string) => {
    setPin(value);
    setError("");
  };

  const handleUnpair = () => {
    // Mock PIN validation (correct PIN is "1234")
    if (pin !== "1234") {
      setError("Wrong PIN. Please try again.");
      setPin("");
      return;
    }

    setIsProcessing(true);
    // Simulate unpair process
    setTimeout(() => {
      navigate("/device/unpair-success");
    }, 2000);
  };

  return (
    <div className="min-h-screen patela-app-bg flex flex-col">
      {/* Header */}
      <div className="p-4 pt-8 flex items-center">
        <button 
          onClick={() => navigate("/device/manage")}
          className="w-10 h-10 rounded-full bg-card flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-foreground pr-10">
          Unpair Device
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-4">
        {/* Warning Icon */}
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
          <Unlink className="h-10 w-10 text-destructive" />
        </div>

        <h2 className="text-2xl font-bold text-foreground text-center mb-1">
          Unpair Patela Pro?
        </h2>
        <p className="text-muted-foreground text-base text-center mb-4 max-w-xs">
          This device will be disconnected from your account. You can pair it again later.
        </p>

        {/* Warning Box */}
        <div className="w-full max-w-sm p-3 bg-destructive/5 border border-destructive/20 rounded-xl mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive text-sm">Warning</p>
              <p className="text-xs text-muted-foreground">
                The device cannot process payments after unpairing until it's paired again.
              </p>
            </div>
          </div>
        </div>

        {/* PIN Entry */}
        <div className="w-full max-w-sm">
          <p className="text-center text-foreground font-medium text-sm mb-3">
            Enter your PIN to confirm
          </p>
          
          <PinInput
            value={pin}
            onChange={handlePinComplete}
            error={error}
          />

          {error && (
            <p className="text-center text-destructive text-sm mt-2">
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <Button 
            variant="destructive"
            size="xl" 
            className="w-[300px]"
            onClick={handleUnpair}
            disabled={pin.length !== 4 || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Unpairing...
              </>
            ) : (
              <>
                <Unlink className="mr-2 h-5 w-5" />
                Confirm Unpair
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="xl"
            className="w-[300px] text-muted-foreground"
            onClick={() => navigate("/device/manage")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
