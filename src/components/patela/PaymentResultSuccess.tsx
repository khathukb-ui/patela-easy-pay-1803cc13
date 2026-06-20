import { Check, MessageSquare, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/patela/BottomNav";

interface PaymentResultSuccessProps {
  amount: number;
  note?: string;
  title?: string;
  subtitle?: string;
  amountLabel?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  showReceiptOptions?: boolean;
  showBottomNav?: boolean;
  onSendReceipt?: (method: "sms" | "whatsapp" | "email") => void;
  onNoReceipt?: () => void;
  onDone: () => void;
  onSecondaryAction?: () => void;
}

export function PaymentResultSuccess({
  amount,
  note,
  title = "Payment Received",
  subtitle,
  amountLabel,
  primaryActionLabel = "Done",
  secondaryActionLabel,
  showReceiptOptions = true,
  showBottomNav = false,
  onSendReceipt,
  onNoReceipt,
  onDone,
  onSecondaryAction,
}: PaymentResultSuccessProps) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 patela-gradient-success ${showBottomNav ? "pb-24" : ""}`}>
      <div className="flex flex-col items-center text-center space-y-6 animate-patela-bounce-in w-full">
        {/* Success Icon */}
        <div className="h-28 w-28 rounded-full bg-success-foreground/20 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-success-foreground flex items-center justify-center">
            <Check className="h-12 w-12 text-success" strokeWidth={3} />
          </div>
        </div>

        {/* Amount / Summary */}
        <div className="space-y-2">
          <p className="text-success-foreground/80 text-lg font-medium">{title}</p>
          {subtitle && <p className="text-success-foreground/70 text-sm">{subtitle}</p>}
          {amountLabel && <p className="text-success-foreground/70 text-xs uppercase tracking-wide pt-2">{amountLabel}</p>}
          <p className="text-5xl font-bold text-success-foreground">R{amount.toFixed(2)}</p>
          {note && (
            <p className="text-success-foreground/70 text-sm mt-2">{note}</p>
          )}
        </div>

        {/* Receipt Options */}
        {showReceiptOptions && onSendReceipt && onNoReceipt && (
          <div className="w-full max-w-sm space-y-3 mt-8">
            <p className="text-success-foreground/80 text-sm font-medium">Send Receipt</p>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="ghost"
                className="flex-col h-auto py-4 bg-success-foreground/10 hover:bg-success-foreground/20 text-success-foreground"
                onClick={() => onSendReceipt("sms")}
              >
                <MessageSquare className="h-6 w-6 mb-1" />
                <span className="text-xs">SMS</span>
              </Button>
              <Button
                variant="ghost"
                className="flex-col h-auto py-4 bg-success-foreground/10 hover:bg-success-foreground/20 text-success-foreground"
                onClick={() => onSendReceipt("whatsapp")}
              >
                <MessageSquare className="h-6 w-6 mb-1" />
                <span className="text-xs">WhatsApp</span>
              </Button>
              <Button
                variant="ghost"
                className="flex-col h-auto py-4 bg-success-foreground/10 hover:bg-success-foreground/20 text-success-foreground"
                onClick={() => onSendReceipt("email")}
              >
                <Mail className="h-6 w-6 mb-1" />
                <span className="text-xs">Email</span>
              </Button>
            </div>
            
            <Button
              variant="ghost"
              className="w-full text-success-foreground/60 hover:text-success-foreground hover:bg-success-foreground/10"
              onClick={onNoReceipt}
            >
              <X className="h-4 w-4 mr-2" />
              No Receipt
            </Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-3 mt-6">
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="ghost"
              size="xl"
              className="w-full bg-success-foreground/10 text-success-foreground hover:bg-success-foreground/20"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}

          <Button
            variant="secondary"
            size="xl"
            className="w-full bg-success-foreground text-success hover:bg-success-foreground/90"
            onClick={onDone}
          >
            {primaryActionLabel}
          </Button>
        </div>
      </div>

      {showBottomNav && <BottomNav />}
    </div>
  );
}
