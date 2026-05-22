import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PinInput } from "@/components/patela/PinInput";
import { toast } from "sonner";
import {
  ArrowLeft, AlertTriangle, CheckCircle2, XCircle, Loader2, Lock, Shield, CreditCard,
} from "lucide-react";
import {
  checkRefundEligibility,
  initiateRefund,
  getRefundsForSale,
  verifyPin,
  type RefundRecord,
} from "@/services/refund-service";

interface RefundModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: {
    id: string;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    note: string | null;
  };
  onRefundComplete: () => void;
}

type Step = "details" | "pin" | "confirm" | "processing" | "result";

const REFUND_REASONS = [
  { value: "wrong_amount", label: "Wrong amount" },
  { value: "customer_returned_item", label: "Customer returned item" },
  { value: "duplicate_charge", label: "Duplicate charge" },
  { value: "customer_dispute", label: "Customer dispute" },
  { value: "other", label: "Other" },
];

const MAX_PIN_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function RefundModal({ open, onOpenChange, sale, onRefundComplete }: RefundModalProps) {
  const [step, setStep] = useState<Step>("details");
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("other");
  const [reasonNote, setReasonNote] = useState("");
  const [pin, setPin] = useState("");
  const [pinAttempts, setPinAttempts] = useState(0);
  const [pinError, setPinError] = useState("");
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; refund?: RefundRecord; error?: string } | null>(null);
  const [eligibility, setEligibility] = useState<{
    eligible: boolean;
    reason?: string;
    totalRefunded: number;
    remainingRefundable: number;
  } | null>(null);
  const [refundHistory, setRefundHistory] = useState<RefundRecord[]>([]);

  const loadEligibility = useCallback(async () => {
    setLoading(true);
    const [elig, history] = await Promise.all([
      checkRefundEligibility(sale.id),
      getRefundsForSale(sale.id),
    ]);
    setEligibility(elig);
    setRefundHistory(history);
    if (elig.eligible) {
      setAmount(elig.remainingRefundable.toFixed(2));
    }
    setLoading(false);
  }, [sale.id]);

  useEffect(() => {
    if (open) {
      setStep("details");
      setRefundType("full");
      setReason("other");
      setReasonNote("");
      setPin("");
      setPinError("");
      setResult(null);
      loadEligibility();
    }
  }, [open, loadEligibility]);

  useEffect(() => {
    if (refundType === "full" && eligibility) {
      setAmount(eligibility.remainingRefundable.toFixed(2));
    }
  }, [refundType, eligibility]);

  const isLocked = lockedUntil && Date.now() < lockedUntil;

  const handlePinSubmit = async () => {
    if (isLocked) return;

    const valid = await verifyPin(pin);
    if (!valid) {
      const attempts = pinAttempts + 1;
      setPinAttempts(attempts);
      setPin("");
      if (attempts >= MAX_PIN_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_DURATION_MS);
        setPinError("Too many attempts. Refund locked for 5 minutes.");
      } else {
        setPinError(`Incorrect PIN (${MAX_PIN_ATTEMPTS - attempts} attempts remaining)`);
      }
      return;
    }

    setPinError("");
    setStep("confirm");
  };

  const handleConfirmRefund = async () => {
    setStep("processing");
    setProcessing(true);

    const refundResult = await initiateRefund({
      saleId: sale.id,
      amount: parseFloat(amount),
      refundType,
      reason,
      reasonNote: reasonNote || undefined,
      paymentMethod: sale.payment_method,
      originalTransactionReference: sale.id,
    });

    setResult(refundResult);
    setProcessing(false);
    setStep("result");
  };

  const refundAmount = parseFloat(amount) || 0;
  const isValidAmount = refundAmount > 0 && refundAmount <= (eligibility?.remainingRefundable || 0);

  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Checking refund eligibility...</p>
        </div>
      );
    }

    if (!eligibility?.eligible) {
      return (
        <div className="flex flex-col items-center py-8 text-center">
          <XCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Refund Not Available</h3>
          <p className="text-sm text-muted-foreground">{eligibility?.reason}</p>
        </div>
      );
    }

    switch (step) {
      case "details":
        return (
          <div className="space-y-5">
            {/* Original transaction info */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original Amount</span>
                <span className="font-semibold text-foreground">R{Number(sale.amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Refunded</span>
                <span className="font-medium text-destructive">-R{eligibility.totalRefunded.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Remaining Refundable</span>
                <span className="font-bold text-foreground">R{eligibility.remainingRefundable.toFixed(2)}</span>
              </div>
            </div>

            {/* Refund type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Refund Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setRefundType("full")}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    refundType === "full"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <p className="font-semibold text-sm">Full Refund</p>
                  <p className="text-xs mt-1">R{eligibility.remainingRefundable.toFixed(2)}</p>
                </button>
                <button
                  onClick={() => setRefundType("partial")}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    refundType === "partial"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <p className="font-semibold text-sm">Partial Refund</p>
                  <p className="text-xs mt-1">Custom amount</p>
                </button>
              </div>
            </div>

            {/* Amount (for partial) */}
            {refundType === "partial" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Refund Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={eligibility.remainingRefundable}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-7"
                    placeholder="0.00"
                  />
                </div>
                {!isValidAmount && amount && (
                  <p className="text-xs text-destructive">
                    Amount must be between R0.01 and R{eligibility.remainingRefundable.toFixed(2)}
                  </p>
                )}
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reason</label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REFUND_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Note (optional)</label>
              <Textarea
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value)}
                placeholder="Additional details..."
                maxLength={500}
                rows={2}
              />
            </div>

            {/* Refund to original method notice */}
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Refund will be returned to the customer's original {sale.payment_method} used for this transaction.
              </p>
            </div>

            {/* Previous refunds */}
            {refundHistory.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Refund History</h4>
                <div className="space-y-2">
                  {refundHistory.map((r) => (
                    <div key={r.id} className="flex justify-between items-center bg-muted/30 rounded-lg px-3 py-2 text-sm">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{r.refund_reference}</p>
                        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-ZA")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">-R{Number(r.amount).toFixed(2)}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          r.status === "successful" ? "bg-success/10 text-success" :
                          r.status === "failed" ? "bg-destructive/10 text-destructive" :
                          "bg-warning/10 text-warning"
                        }`}>{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!isValidAmount}
              onClick={() => setStep("pin")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Continue to PIN Verification
            </Button>
          </div>
        );

      case "pin":
        return (
          <div className="flex flex-col items-center py-4">
            <Lock className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-1">Enter Your PIN</h3>
            <p className="text-sm text-muted-foreground mb-6">Verify your identity to process this refund</p>

            {isLocked ? (
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-3" />
                <p className="text-sm text-destructive font-medium">{pinError}</p>
              </div>
            ) : (
              <>
                <PinInput value={pin} onChange={setPin} error={pinError} />
                <div className="flex gap-3 mt-6 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => { setStep("details"); setPin(""); setPinError(""); }}>
                    <ArrowLeft className="h-4 w-4 mr-1" />Back
                  </Button>
                  <Button className="flex-1" disabled={pin.length < 4} onClick={handlePinSubmit}>
                    Verify
                  </Button>
                </div>
              </>
            )}
          </div>
        );

      case "confirm":
        return (
          <div className="flex flex-col items-center py-4 text-center">
            <AlertTriangle className="h-12 w-12 text-warning mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Confirm Refund</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to refund <strong className="text-foreground">R{refundAmount.toFixed(2)}</strong> to the customer's original card?
            </p>

            <div className="bg-muted/50 rounded-xl p-4 w-full space-y-2 mb-6 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Refund Amount</span>
                <span className="font-bold text-destructive">-R{refundAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium capitalize">{refundType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reason</span>
                <span className="font-medium">{REFUND_REASONS.find(r => r.value === reason)?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium capitalize">{sale.payment_method}</span>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => setStep("pin")}>
                <ArrowLeft className="h-4 w-4 mr-1" />Back
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleConfirmRefund}>
                Process Refund
              </Button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-1">Processing Refund</h3>
            <p className="text-sm text-muted-foreground">Please wait while we process your refund...</p>
          </div>
        );

      case "result":
        return (
          <div className="flex flex-col items-center py-8 text-center">
            {result?.success ? (
              <>
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Refund Processed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  R{refundAmount.toFixed(2)} will be returned to the customer's original card.
                </p>
                {result.refund && (
                  <div className="bg-muted/50 rounded-xl p-3 w-full text-left text-sm space-y-1 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reference</span>
                      <span className="font-mono text-xs">{result.refund.refund_reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-success font-medium capitalize">{result.refund.status}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Refund Failed</h3>
                <p className="text-sm text-muted-foreground mb-4">{result?.error || "An error occurred"}</p>
              </>
            )}

            <Button className="w-full" onClick={() => { onOpenChange(false); onRefundComplete(); }}>
              Done
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {step === "details" ? "Refund Transaction" :
             step === "pin" ? "PIN Verification" :
             step === "confirm" ? "Confirm Refund" :
             step === "processing" ? "Processing..." :
             "Refund Result"}
          </DialogTitle>
        </DialogHeader>
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
}
