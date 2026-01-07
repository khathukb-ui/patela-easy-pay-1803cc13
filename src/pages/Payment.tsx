import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Keypad } from "@/components/patela/Keypad";
import { QuickAmountButton } from "@/components/patela/QuickAmountButton";
import { OfflineBanner } from "@/components/patela/OfflineBanner";
import { ItemSelector } from "@/components/patela/ItemSelector";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Loader2, MessageSquare, ShoppingCart, Calculator, X, Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCatalog, useCart } from "@/hooks/use-catalog";
import { cn } from "@/lib/utils";

type PaymentStep = "amount" | "processing" | "success" | "failed";
type InputMode = "manual" | "items";

export default function Payment() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<PaymentStep>("amount");
  const [isOffline] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("manual");

  const { items } = useCatalog();
  const { cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount } = useCart();

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
    const chargeAmount = inputMode === "items" ? cartTotal : parseFloat(amount);
    if (!chargeAmount || chargeAmount <= 0) return;

    setStep("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Random success/fail for demo
    const success = Math.random() > 0.2;
    const itemsNote = inputMode === "items" && cart.length > 0
      ? cart.map(c => `${c.quantity}x ${c.name}`).join(", ")
      : note;

    if (success) {
      navigate("/payment/success", { state: { amount: chargeAmount, note: itemsNote } });
    } else {
      navigate("/payment/failed", { state: { amount: chargeAmount } });
    }
  };

  const currentAmount = inputMode === "items" ? cartTotal : (amount ? parseFloat(amount) : 0);
  const formattedAmount = currentAmount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (step === "processing") {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col items-center justify-center px-6">
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
    <div className="min-h-screen patela-app-bg flex flex-col">
      <OfflineBanner isOffline={isOffline} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{t("takePayment")}</h1>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-secondary rounded-xl p-1">
          <button
            onClick={() => {
              setInputMode("manual");
              clearCart();
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              inputMode === "manual"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calculator className="h-4 w-4" />
            Amount
          </button>
          <button
            onClick={() => {
              setInputMode("items");
              setAmount("");
            }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
              inputMode === "items"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Items
          </button>
        </div>
      </header>

      {/* Amount Display */}
      <div className="px-4 py-3">
        <div className="text-center mb-2">
          <p className="text-muted-foreground text-xs mb-1">
            {inputMode === "items" ? "Cart Total" : t("enterAmount")}
          </p>
          <div className="flex items-baseline justify-center">
            <span className="text-2xl font-bold text-muted-foreground mr-1">R</span>
            <span className="text-4xl font-bold text-foreground tracking-tight">
              {formattedAmount}
            </span>
          </div>
        </div>

        {/* Cart Summary (Items Mode) */}
        {inputMode === "items" && cart.length > 0 && (
          <div className="bg-accent/10 rounded-lg p-2 mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-foreground">
                {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
              </span>
              <button
                onClick={clearCart}
                className="text-[10px] text-destructive hover:underline flex items-center gap-0.5"
              >
                <X className="h-2.5 w-2.5" />
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {cart.map((item) => (
                <span
                  key={item.id}
                  className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full"
                >
                  {item.quantity}× {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Note Input (Manual Mode) */}
        {inputMode === "manual" && (
          <button
            onClick={() => {
              const newNote = prompt(t("addNote"), note);
              if (newNote !== null) setNote(newNote);
            }}
            className="flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">{note || t("addNote")}</span>
          </button>
        )}
      </div>

      {/* Main Input Area */}
      <div className="flex-1 overflow-hidden">
        {inputMode === "items" ? (
          <div className="px-3 pb-2 h-full overflow-y-auto">
            <ItemSelector
              items={items}
              cart={cart}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          </div>
        ) : (
          <>
            {/* Quick Amounts */}
            <div className="flex items-center gap-2 px-4 mb-2 flex-wrap justify-center">
              {quickAmounts.map((quickAmount) => (
                <QuickAmountButton
                  key={quickAmount}
                  amount={quickAmount}
                  onClick={handleQuickAmount}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="bg-card border-t border-border">
        {inputMode === "manual" && (
          <Keypad
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onClear={() => setAmount("")}
          />
        )}

        {/* Charge Button */}
        <div className="px-4 pb-4 pt-2">
          <Button
            variant="hero"
            size="lg"
            className="w-full"
            onClick={handleCharge}
            disabled={currentAmount <= 0}
          >
            <CreditCard className="h-5 w-5 mr-1.5" />
            {t("chargeCustomer")} R{formattedAmount}
          </Button>
        </div>
      </div>
    </div>
  );
}
