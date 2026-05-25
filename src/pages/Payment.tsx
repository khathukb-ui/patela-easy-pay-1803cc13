import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Keypad } from "@/components/patela/Keypad";
import { QuickAmountButton } from "@/components/patela/QuickAmountButton";
import { OfflineBanner } from "@/components/patela/OfflineBanner";
import { ItemSelector } from "@/components/patela/ItemSelector";
import {
  PaymentMethodModal,
  PaymentMethod,
} from "@/components/patela/PaymentMethodModal";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  MessageSquare,
  ShoppingCart,
  Calculator,
  X,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCatalog, useCart } from "@/hooks/use-catalog";
import {
  PatelaQpos,
  amountToCents,
  startPatelaQposPaymentWithLogs,
  scanPatelaQposDevices,
} from "@/plugins/patelaQpos";
import { getPairedPatelaDevice } from "@/services/patelaBluetooth";
import { cn } from "@/lib/utils";

type PaymentStep =
  | "amount"
  | "select_method"
  | "processing"
  | "cash_confirm"
  | "success"
  | "failed";

type InputMode = "manual" | "items";

type ToastType = "success" | "error" | "warning" | "info";

interface PaymentToastState {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

const PaymentToast = ({
  toast,
  onClose,
}: {
  toast: PaymentToastState | null;
  onClose: () => void;
}) => {
  if (!toast) {
    return null;
  }

  const toastConfig = {
    success: {
      icon: CheckCircle2,
      wrapper: "border-green-200 bg-green-50 text-green-900",
      iconClass: "text-green-600",
      title: "text-green-900",
      message: "text-green-700",
    },
    error: {
      icon: XCircle,
      wrapper: "border-red-200 bg-red-50 text-red-900",
      iconClass: "text-red-600",
      title: "text-red-900",
      message: "text-red-700",
    },
    warning: {
      icon: AlertTriangle,
      wrapper: "border-amber-200 bg-amber-50 text-amber-900",
      iconClass: "text-amber-600",
      title: "text-amber-900",
      message: "text-amber-700",
    },
    info: {
      icon: Info,
      wrapper: "border-blue-200 bg-blue-50 text-blue-900",
      iconClass: "text-blue-600",
      title: "text-blue-900",
      message: "text-blue-700",
    },
  };

  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div className="fixed left-4 right-4 top-[calc(env(safe-area-inset-top)+12px)] z-[9999] animate-patela-fade-in">
      <div
        className={cn(
          "mx-auto flex max-w-md items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur",
          config.wrapper,
        )}
      >
        <div className="mt-0.5 shrink-0">
          <Icon className={cn("h-5 w-5", config.iconClass)} />
        </div>

        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-bold", config.title)}>
            {toast.title}
          </p>

          {toast.message && (
            <p className={cn("mt-1 text-sm leading-5", config.message)}>
              {toast.message}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function Payment() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [step, setStep] = useState<PaymentStep>("amount");
  const [isOffline] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("manual");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [toast, setToast] = useState<PaymentToastState | null>(null);

  const { items } = useCatalog();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useCart();

  const quickAmounts = [20, 50, 100, 200];

  const showToast = (
    type: ToastType,
    title: string,
    message?: string,
  ): void => {
    setToast({
      id: Date.now(),
      type,
      title,
      message,
    });
  };

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, toast.type === "error" ? 6500 : 4500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toast]);

  useEffect(() => {
    let removeListener: (() => Promise<void>) | undefined;

    const setupQposListener = async () => {
      try {
        const listener = await PatelaQpos.addListener(
          "patelaQposEvent",
          (event) => {
            console.log("PATELA QPOS EVENT FROM IOS:", event);

            if (event.event === "waiting_user") {
              showToast(
                "info",
                "Waiting for customer",
                "Ask the customer to tap, insert, or swipe their card.",
              );
            }

            if (event.event === "pin_entry") {
              showToast(
                "info",
                "PIN required",
                "Please ask the customer to enter their PIN on the device.",
              );
            }

            if (event.event === "display") {
              showToast("info", "Device update", event.message);
            }

            if (event.event === "online_process_required") {
              showToast(
                "warning",
                "Online processing required",
                "The device is waiting for host/acquirer processing.",
              );
            }
          },
        );

        removeListener = listener.remove;
      } catch (error) {
        console.warn("PATELA QPOS EVENT LISTENER NOT AVAILABLE:", error);
      }
    };

    void setupQposListener();

    return () => {
      if (removeListener) {
        void removeListener();
      }
    };
  }, []);

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

  const handleChargeClick = async () => {
    try {
      setIsCharging(true);
      setPaymentError(null);

      const pairedDevice = getPairedPatelaDevice();

      console.log("PATELA SAVED DEVICE:", pairedDevice);

      if (!pairedDevice) {
        const message = "Please pair your Patela device first.";
        setPaymentError(message);
        showToast("error", "Device not paired", message);
        return;
      }

      const numericAmount =
        inputMode === "items" ? cartTotal : Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        const message = "Please enter a valid amount before charging.";
        setPaymentError(message);
        showToast("warning", "Invalid amount", message);
        return;
      }

      const amountInCents = amountToCents(numericAmount);

      console.log("PATELA PAYMENT AMOUNT CHECK:", {
        amount,
        numericAmount,
        amountInCents,
      });

      showToast(
        "info",
        "Searching for device",
        "Looking for your Patela/QPOS payment device nearby.",
      );

      const qposDevices = await scanPatelaQposDevices("MPOS");

      console.log("PATELA QPOS DEVICES AVAILABLE:", qposDevices);

      const qposDeviceName =
        qposDevices.find((deviceName) =>
          deviceName.toUpperCase().includes(pairedDevice.name.toUpperCase()),
        ) ||
        qposDevices.find((deviceName) =>
          deviceName.toUpperCase().includes("MPOS"),
        ) ||
        qposDevices[0];

      if (!qposDeviceName) {
        const message =
          "No Patela/QPOS device found by the QPOS SDK scanner.";
        setPaymentError(message);
        showToast("error", "Device not found", message);
        return;
      }

      console.log("PATELA QPOS SELECTED DEVICE:", qposDeviceName);

      showToast(
        "info",
        "Starting payment",
        "Sending the amount to the payment device.",
      );

      const result = await startPatelaQposPaymentWithLogs({
        bluetoothName: qposDeviceName,
        amountInCents,
        currencyCode: "0710",
        reference: `ORDER-${Date.now()}`,
        autoApproveTestMode: true,
      });

      console.log("PATELA FINAL PAYMENT RESULT:", result);

      if (result.status === "approved") {
        showToast(
          "success",
          "Payment approved",
          result.message || "The customer payment was approved.",
        );

        window.setTimeout(() => {
          navigate("/payment/success", {
            state: {
              amount: numericAmount,
              result,
            },
          });
        }, 800);

        return;
      }

      if (
        result.status === "declined" ||
        result.status === "failed" ||
        result.status === "cancelled" ||
        result.status === "terminated"
      ) {
        const message = result.message || "Payment was not approved.";
        setPaymentError(message);
        showToast("error", "Payment failed", message);
        return;
      }

      const message = result.message || "Payment is still pending.";
      setPaymentError(message);
      showToast("warning", "Payment pending", message);
    } catch (error) {
      console.error("Patela QPOS payment failed:", error);

      const maybeError = error as {
        code?: string;
        message?: string;
        errorMessage?: string;
      };

      const message =
        maybeError?.message ||
        maybeError?.errorMessage ||
        "Unable to start payment on Patela device.";

      setPaymentError(message);
      showToast("error", "Payment error", message);
    } finally {
      setIsCharging(false);
    }
  };

  const handleMethodSelect = async (method: PaymentMethod) => {
    const chargeAmount =
      inputMode === "items" ? cartTotal : parseFloat(amount);

    const itemsNote =
      inputMode === "items" && cart.length > 0
        ? cart.map((c) => `${c.quantity}x ${c.name}`).join(", ")
        : note;

    const cartItems =
      inputMode === "items"
        ? cart.map((c) => ({
            name: c.name,
            sku: c.sku,
            price: c.price,
            quantity: c.quantity,
          }))
        : [];

    if (method === "cash") {
      setStep("cash_confirm");
      return;
    }

    setStep("processing");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const success = Math.random() > 0.2;

    if (success) {
      showToast("success", "Payment approved", "Card payment successful.");

      navigate("/payment/success", {
        state: {
          amount: chargeAmount,
          note: itemsNote,
          method: "card",
          items: cartItems,
        },
      });
    } else {
      showToast("error", "Payment failed", "The card payment was declined.");

      navigate("/payment/failed", {
        state: {
          amount: chargeAmount,
        },
      });
    }
  };

  const handleCashConfirm = () => {
    const chargeAmount =
      inputMode === "items" ? cartTotal : parseFloat(amount);

    const itemsNote =
      inputMode === "items" && cart.length > 0
        ? cart.map((c) => `${c.quantity}x ${c.name}`).join(", ")
        : note;

    const cartItems =
      inputMode === "items"
        ? cart.map((c) => ({
            name: c.name,
            sku: c.sku,
            price: c.price,
            quantity: c.quantity,
          }))
        : [];

    showToast(
      "success",
      "Cash confirmed",
      "Cash payment has been confirmed.",
    );

    navigate("/payment/success", {
      state: {
        amount: chargeAmount,
        note: itemsNote,
        method: "cash",
        items: cartItems,
      },
    });
  };

  const currentAmount =
    inputMode === "items" ? cartTotal : amount ? parseFloat(amount) : 0;

  const formattedAmount = currentAmount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (step === "cash_confirm") {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] items-center justify-center px-6">
        <PaymentToast toast={toast} onClose={() => setToast(null)} />

        <div className="flex flex-col items-center text-center space-y-8 animate-patela-fade-in">
          <div className="h-32 w-32 rounded-full bg-accent flex items-center justify-center patela-shadow-accent">
            <Banknote className="h-16 w-16 text-accent-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">Cash Payment</p>
            <p className="text-5xl font-bold text-foreground">
              R{formattedAmount}
            </p>
          </div>

          <p className="text-muted-foreground max-w-xs">
            Confirm that you have received the cash payment from the customer
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              variant="hero"
              size="xl"
              onClick={handleCashConfirm}
              className="w-full"
            >
              <CheckCircle2 className="h-6 w-6 mr-2" />
              Confirm Cash Received
            </Button>

            <Button
              variant="ghost"
              size="lg"
              onClick={() => setStep("amount")}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="min-h-screen patela-app-bg flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] items-center justify-center px-6">
        <PaymentToast toast={toast} onClose={() => setToast(null)} />

        <div className="flex flex-col items-center text-center space-y-8 animate-patela-fade-in">
          <div className="h-32 w-32 rounded-full bg-primary flex items-center justify-center animate-patela-pulse patela-shadow-primary">
            <CreditCard className="h-16 w-16 text-primary-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground text-lg">{t("processing")}</p>
            <p className="text-5xl font-bold text-foreground">
              R{formattedAmount}
            </p>
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
      <PaymentToast toast={toast} onClose={() => setToast(null)} />

      <OfflineBanner isOffline={isOffline} />

      <PaymentMethodModal
        isOpen={step === "select_method"}
        onClose={() => setStep("amount")}
        onSelect={handleMethodSelect}
        amount={currentAmount}
      />

      <header className="flex items-center justify-between px-4 py-4 pt-[calc(env(safe-area-inset-top)+1rem)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>

          <h1 className="text-xl font-bold text-foreground">
            {t("takePayment")}
          </h1>
        </div>

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
                : "text-muted-foreground hover:text-foreground",
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
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            Items
          </button>
        </div>
      </header>

      <div className="px-6 py-4">
        <div className="text-center mb-4">
          <p className="text-muted-foreground text-sm mb-2">
            {inputMode === "items" ? "Cart Total" : t("enterAmount")}
          </p>

          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-bold text-muted-foreground mr-1">
              R
            </span>

            <span className="text-5xl font-bold text-foreground tracking-tight">
              {formattedAmount}
            </span>
          </div>
        </div>

        {paymentError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {paymentError}
          </div>
        )}

        {inputMode === "items" && cart.length > 0 && (
          <div className="bg-accent/10 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
              </span>

              <button
                onClick={clearCart}
                className="text-xs text-destructive hover:underline flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-1">
              {cart.map((item) => (
                <span
                  key={item.sku}
                  className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full"
                >
                  {item.quantity}× {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {inputMode === "manual" && (
          <button
            onClick={() => {
              const newNote = prompt(t("addNote"), note);
              if (newNote !== null) setNote(newNote);
            }}
            className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">{note || t("addNote")}</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {inputMode === "items" ? (
          <div className="px-4 pb-4 h-full overflow-y-auto">
            <ItemSelector
              items={items}
              cart={cart}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 px-6 mb-4 flex-wrap justify-center">
            {quickAmounts.map((quickAmount) => (
              <QuickAmountButton
                key={quickAmount}
                amount={quickAmount}
                onClick={handleQuickAmount}
              />
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border-t border-border pb-[env(safe-area-inset-bottom)]">
        {inputMode === "manual" && (
          <Keypad
            onKeyPress={handleKeyPress}
            onDelete={handleDelete}
            onClear={() => setAmount("")}
          />
        )}

        <div className="px-4 pb-6">
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            disabled={isCharging || currentAmount <= 0}
            onClick={handleChargeClick}
          >
            {isCharging ? (
              <Loader2 className="h-6 w-6 mr-2 animate-spin" />
            ) : (
              <CreditCard className="h-6 w-6 mr-2" />
            )}

            {isCharging
              ? "Processing..."
              : `${t("chargeCustomer")} R${formattedAmount}`}
          </Button>
        </div>
      </div>
    </div>
  );
}