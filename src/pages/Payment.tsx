import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Keypad } from "@/components/patela/Keypad";
import { QuickAmountButton } from "@/components/patela/QuickAmountButton";
import { OfflineBanner } from "@/components/patela/OfflineBanner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Loader2, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type PaymentStep = "amount" | "processing" | "success" | "failed";

export default function Payment() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<PaymentStep>("amount");
  const [isOffline] = useState(false);

  const quickAmounts = [20, 50, 100, 200];

  const handleKeyPress = (key: string) => {
    if (key === "." && amount.includes(".")) return;
    if (amount.includes(".") && amount.split(".")[1]?.length >= 2) return;
    
    const newAmount = amount + key;
    if (parseFloat(newAmount) <= 50000) {
      setAmount(newAmount);
    }
  };

  const handleDelete = () => {
    setAmount(amount.slice(0, -1));
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleCharge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setStep("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Random success/fail for demo
    const success = Math.random() > 0.2;
    if (success) {
      navigate("/payment/success", { state: { amount: parseFloat(amount), note } });
    } else {
      navigate("/payment/failed", { state: { amount: parseFloat(amount) } });
    }
  };

  const displayAmount = amount || "0";
  const formattedAmount = parseFloat(displayAmount).toLocaleString("en-ZA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center text-center space-y-8 animate-patela-fade-in">
          <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center animate-patela-pulse patela-shadow-primary">
            <CreditCard className="h-16 w-16 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">{t("processing")}</p>
            <p className="text-5xl font-bold text-foreground">R{formattedAmount}</p>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p>{t("tapInsertSwipe")}</p>
          </div>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => setStep("amount")}
            className="mt-8"
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OfflineBanner isOffline={isOffline} />

      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-4">
        <button
          onClick={() => navigate("/home")}
          className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">{t("takePayment")}</h1>
      </header>

      {/* Amount Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-6">
          <p className="text-muted-foreground text-sm mb-2">{t("enterAmount")}</p>
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold text-muted-foreground mr-1">R</span>
            <span className="text-6xl font-bold text-foreground tracking-tight">
              {formattedAmount}
            </span>
          </div>
        </div>

        {/* Note Input */}
        <button
          onClick={() => {
            const newNote = prompt(t("addNote"), note);
            if (newNote !== null) setNote(newNote);
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm">{note || t("addNote")}</span>
        </button>

        {/* Quick Amounts */}
        <div className="flex items-center gap-3 mb-4 flex-wrap justify-center">
          {quickAmounts.map((quickAmount) => (
            <QuickAmountButton
              key={quickAmount}
              amount={quickAmount}
              onClick={handleQuickAmount}
            />
          ))}
        </div>
      </div>

      {/* Keypad */}
      <div className="bg-card border-t border-border">
        <Keypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onClear={() => setAmount("")}
        />

        {/* Charge Button */}
        <div className="px-4 pb-6">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleCharge}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            <CreditCard className="h-6 w-6 mr-2" />
            {t("chargeCustomer")} R{formattedAmount}
          </Button>
        </div>
      </div>
    </div>
  );
}
