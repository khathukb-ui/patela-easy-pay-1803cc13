import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { PaymentResultSuccess } from "@/components/patela/PaymentResultSuccess";
import { StaffPinScreen } from "@/components/patela/StaffPinScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
    confirmIMSCheckout,
    getIMSApiBaseUrl,
    getIMSStoreId,
    IMSBarcodeItem,
    IMSPaymentMethod,
    loginToIMS,
    lookupIMSBarcodeItem,
    startIMSCheckout,
} from "@/lib/ims-api";
import { cn } from "@/lib/utils";
import { StaffUser } from "@/services/staff-pin-service";
import { toast } from "sonner";
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    ClipboardCheck,
    Loader2,
    Package,
    RefreshCcw,
    ScanBarcode,
    Search,
    ShieldAlert,
    Trash2,
    XCircle,
} from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

type BarcodeScannerModule = typeof import("@capacitor/barcode-scanner");

const barcodeScannerModules = import.meta.glob<BarcodeScannerModule>(
    "/node_modules/@capacitor/barcode-scanner/dist/esm/index.js"
);

const loadBarcodeScannerModule = async (): Promise<BarcodeScannerModule> => {
    const loader = barcodeScannerModules["/node_modules/@capacitor/barcode-scanner/dist/esm/index.js"];

    if (!loader) {
        throw new Error("Barcode scanner module was not found in the Vite bundle.");
    }

    return await loader();
};

type PickingStep = "ready" | "staff-pin" | "active" | "completed" | "rejected";

type ScannedPickingItem = {
    barcode: string;
    productName: string;
    sku?: string;
    status?: string;
    price: number | null;
    quantity: number;
    scannedAt: string;
    item: IMSBarcodeItem | null;
};

type CompletedSaleSummary = {
    orderNumber?: string;
    transactionId?: string;
    staffName?: string;
    paymentMethod: IMSPaymentMethod;
    completedAt: string;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getProductName = (item: IMSBarcodeItem | null, barcode: string) =>
    item?.product?.name || item?.sku || item?.barcode || barcode || "IMS Item";

const getSku = (item: IMSBarcodeItem | null) => item?.sku || item?.product?.sku || undefined;

const toNumberOrNull = (value: unknown): number | null => {
    if (value === null || value === undefined || value === "") return null;

    const numberValue = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
    return Number.isFinite(numberValue) ? numberValue : null;
};

const getItemPrice = (item: IMSBarcodeItem | null): number | null => {
    if (!item) return null;

    const itemAny = item as any;
    const productAny = item.product as any;

    return (
        toNumberOrNull(itemAny.price) ??
        toNumberOrNull(itemAny.unitPrice) ??
        toNumberOrNull(itemAny.sellingPrice) ??
        toNumberOrNull(itemAny.retailPrice) ??
        toNumberOrNull(productAny?.unitPrice) ??
        toNumberOrNull(productAny?.price) ??
        toNumberOrNull(productAny?.sellingPrice) ??
        toNumberOrNull(productAny?.retailPrice)
    );
};

const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Price not available";

    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
    }).format(amount);
};

const getStatusClass = (status?: string) => {
    const value = status?.toUpperCase();

    if (value === "IN_STOCK") return "bg-success/10 text-success border-success/20";
    if (value === "SOLD" || value === "REMOVED") return "bg-destructive/10 text-destructive border-destructive/20";
    if (value === "IN_PROGRESS") return "bg-accent/10 text-accent border-accent/20";
    if (value === "COMPLETED") return "bg-success/10 text-success border-success/20";
    if (value === "PENDING") return "bg-warning/10 text-warning border-warning/20";

    return "bg-secondary text-muted-foreground border-border";
};

const orderRejectionReasons = [
    { value: "card_declined", label: "Card declined" },
    { value: "insufficient_funds", label: "Insufficient funds" },
    { value: "payment_timeout", label: "Payment timeout" },
    { value: "customer_cancelled", label: "Customer cancelled" },
    { value: "stock_unavailable", label: "Stock unavailable" },
    { value: "incorrect_items", label: "Incorrect items picked" },
    { value: "price_mismatch", label: "Price mismatch" },
    { value: "duplicate_order", label: "Duplicate order" },
    { value: "other", label: "Other" },
];

const getRejectReasonText = (reason: string, otherReason: string) => {
    if (reason === "other") return otherReason.trim();

    return orderRejectionReasons.find((item) => item.value === reason)?.label || "Order rejected";
};

const IMS_ACCESS_STORAGE_KEY = "patela-ims-access-ready";

const getStoredIMSAccessReady = () => {
    if (typeof window === "undefined") return false;

    try {
        return window.localStorage.getItem(IMS_ACCESS_STORAGE_KEY) === "true";
    } catch {
        return false;
    }
};

const setStoredIMSAccessReady = (isReady: boolean) => {
    if (typeof window === "undefined") return;

    try {
        if (isReady) {
            window.localStorage.setItem(IMS_ACCESS_STORAGE_KEY, "true");
        } else {
            window.localStorage.removeItem(IMS_ACCESS_STORAGE_KEY);
        }
    } catch {
        // Ignore storage errors.
    }
};

const restoreIOSStatusBar = async () => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") return;

    try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Light });
        await StatusBar.setBackgroundColor({ color: "#6D28D9" });
        await StatusBar.show();
    } catch (error) {
        console.warn("[StatusBar] Failed to restore status bar:", error);
    }
};

export default function InventoryScanner() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [step, setStep] = useState<PickingStep>("ready");
    const [manualBarcode, setManualBarcode] = useState("");
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isProcessingBarcode, setIsProcessingBarcode] = useState(false);
    const [processingMessage, setProcessingMessage] = useState<string | null>(null);
    const [imsAuthLoading, setImsAuthLoading] = useState(false);
    const storedIMSAccessReady = getStoredIMSAccessReady();
    const imsAccessCheckedOnViewRef = useRef(false);
    const [imsAuthMessage, setImsAuthMessage] = useState<string | null>(
        storedIMSAccessReady ? "IMS access ready." : null
    );
    const [imsAuthReady, setImsAuthReady] = useState(storedIMSAccessReady);
    const [scanMessage, setScanMessage] = useState<string | null>(null);
    const [scanStatus, setScanStatus] = useState<"idle" | "success" | "warning" | "error">("idle");
    const [scannedItems, setScannedItems] = useState<ScannedPickingItem[]>([]);
    const [completedAt, setCompletedAt] = useState<string | null>(null);
    const [showRejectOptions, setShowRejectOptions] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [rejectOtherReason, setRejectOtherReason] = useState("");
    const [rejectedAt, setRejectedAt] = useState<string | null>(null);
    const [verifiedStaff, setVerifiedStaff] = useState<StaffUser | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<IMSPaymentMethod>("CARD");
    const [isCompletingOrder, setIsCompletingOrder] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
    const [completedSale, setCompletedSale] = useState<CompletedSaleSummary | null>(null);

    const itemCount = useMemo(
        () => scannedItems.reduce((sum, item) => sum + item.quantity, 0),
        [scannedItems]
    );

    const totalAmount = useMemo(
        () => scannedItems.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0),
        [scannedItems]
    );

    const ensureIMSAuth = useCallback(async (force = false) => {
        setImsAuthLoading(true);
        setImsAuthMessage("Checking IMS access...");

        try {
            console.log("[IMS] Calling loginToIMS/access check...");
            const result = await loginToIMS(force);
            console.log("[IMS] loginToIMS/access check result:", result);

            setImsAuthReady(result.success);
            setStoredIMSAccessReady(result.success);
            setImsAuthMessage(result.success ? "IMS access ready." : result.message);

            if (result.success) {
                toast.success("IMS access ready");
            } else {
                toast.error(result.message);
            }

            return result;
        } finally {
            setImsAuthLoading(false);
        }
    }, []);

    const resetMessages = () => {
        setCameraError(null);
        setScanMessage(null);
        setScanStatus("idle");
        setProcessingMessage(null);
    };

    const startPicking = async () => {
        resetMessages();

        setScannedItems([]);
        setManualBarcode("");
        setCompletedAt(null);
        setShowRejectOptions(false);
        setRejectReason("");
        setRejectOtherReason("");
        setRejectedAt(null);
        setCompletedSale(null);
        setCheckoutMessage(null);
        setVerifiedStaff(null);

        if (!imsAuthReady) {
            const result = await ensureIMSAuth();

            if (!result.success) {
                return;
            }
        }

        setStep("staff-pin");
    };

    const handleStaffVerified = (staffUser: StaffUser) => {
        setVerifiedStaff(staffUser);
        setCheckoutMessage(null);
        setStep("active");
        toast.success(`${staffUser.name || "Staff member"} verified`);
    };

    const logOutStaffSession = () => {
        setVerifiedStaff(null);
        setCheckoutMessage(null);
    };

    const startNewPicking = () => {
        setScannedItems([]);
        setManualBarcode("");
        setCompletedAt(null);
        setShowRejectOptions(false);
        setRejectReason("");
        setRejectOtherReason("");
        setRejectedAt(null);
        setCompletedSale(null);
        setCheckoutMessage(null);
        logOutStaffSession();
        resetMessages();
        setStep("ready");
    };

    const addScannedItem = (barcode: string, item: IMSBarcodeItem | null) => {
        const cleanBarcode = barcode.trim();
        const price = getItemPrice(item);

        setScannedItems((currentItems) => {
            const existingItem = currentItems.find((scanItem) => scanItem.barcode === cleanBarcode);

            if (existingItem) {
                return currentItems.map((scanItem) =>
                    scanItem.barcode === cleanBarcode
                        ? {
                              ...scanItem,
                              quantity: scanItem.quantity + 1,
                              scannedAt: new Date().toISOString(),
                          }
                        : scanItem
                );
            }

            const nextItem: ScannedPickingItem = {
                barcode: cleanBarcode,
                productName: getProductName(item, cleanBarcode),
                sku: getSku(item),
                status: item?.status,
                price,
                quantity: 1,
                scannedAt: new Date().toISOString(),
                item,
            };

            return [nextItem, ...currentItems];
        });
    };

    const processBarcode = useCallback(
        async (barcode: string) => {
            const cleanBarcode = barcode.trim();

            if (!cleanBarcode) {
                toast.error("Please scan or enter a barcode first");
                return;
            }

            if (isProcessingBarcode) return;

            setIsProcessingBarcode(true);
            setProcessingMessage("Processing barcode...");
            setScanMessage(null);
            setScanStatus("idle");
            setCameraError(null);

            try {
                await wait(1100);

                setProcessingMessage("Checking item in IMS...");
                const result = await lookupIMSBarcodeItem(cleanBarcode);

                if (result.status === "found") {
                    addScannedItem(cleanBarcode, result.item);
                    setManualBarcode("");
                    setScanStatus("success");
                    setScanMessage(`${getProductName(result.item, cleanBarcode)} added to the picking list.`);
                    toast.success("Item added to picking list");
                    return;
                }

                if (result.message !== "") {
                    setScanStatus("warning");
                    setScanMessage("Barcode not found in IMS. Please check the barcode and try again.");
                    toast.warning(result.message);
                    return;
                }

                setScanStatus("error");
                setScanMessage(result.message || "IMS lookup failed. Please try again.");
                toast.error(result.message || "IMS lookup failed");
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unable to process barcode.";
                setScanStatus("error");
                setScanMessage(message);
                toast.error(message);
            } finally {
                setProcessingMessage(null);
                setIsProcessingBarcode(false);
            }
        },
        [isProcessingBarcode]
    );

    const startCamera = async () => {
        resetMessages();

        console.log("[Scanner] Start scan clicked");
        console.log("[Scanner] Platform:", Capacitor.getPlatform());
        console.log("[Scanner] Is native:", Capacitor.isNativePlatform());

        if (!Capacitor.isNativePlatform()) {
            const message = "Camera scanning only works inside the installed mobile app. Please enter the barcode manually for now.";
            console.error("[Scanner] Not native platform:", message);
            setCameraError(message);
            return;
        }

        try {
            setIsCameraActive(true);

            console.log("[Scanner] Loading official @capacitor/barcode-scanner module...");

            const {
                CapacitorBarcodeScanner,
                CapacitorBarcodeScannerCameraDirection,
                CapacitorBarcodeScannerScanOrientation,
                CapacitorBarcodeScannerTypeHint,
            } = await loadBarcodeScannerModule();

            console.log("[Scanner] Official scanner module loaded");

            const result = await CapacitorBarcodeScanner.scanBarcode({
                hint: CapacitorBarcodeScannerTypeHint.ALL,
                scanInstructions: "Align the barcode within the frame",
                scanText: "Scan Barcode",
                cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
                scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
            });

            console.log("[Scanner] Raw scan result:", result);

            const scanResult = result as unknown as {
                ScanResult?: string;
                value?: string;
                content?: string;
                text?: string;
            };

            const detected =
                scanResult.ScanResult?.trim?.() ||
                scanResult.value?.trim?.() ||
                scanResult.content?.trim?.() ||
                scanResult.text?.trim?.() ||
                "";

            console.log("[Scanner] Detected barcode:", detected);

            if (!detected) {
                setCameraError("No barcode was detected. Please try again or enter the barcode manually.");
                return;
            }

            setManualBarcode(detected);
            await processBarcode(detected);
        } catch (error) {
            console.error("[Scanner] Failed to scan:", error);

            let message = "Unable to open barcode scanner.";

            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === "object" && error !== null) {
                message = JSON.stringify(error);
            }

            setCameraError(message);
        } finally {
          console.log("[Scanner] Scan finished");

          await restoreIOSStatusBar();

          setTimeout(() => {
              restoreIOSStatusBar();
          }, 300);

          setIsCameraActive(false);
        }
    };

    const removeScannedItem = (barcode: string) => {
        setScannedItems((currentItems) => currentItems.filter((item) => item.barcode !== barcode));
        toast.success("Item removed");
    };

    const reduceQuantity = (barcode: string) => {
        setScannedItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.barcode === barcode
                        ? {
                              ...item,
                              quantity: Math.max(0, item.quantity - 1),
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const increaseQuantity = (barcode: string) => {
        setScannedItems((currentItems) =>
            currentItems.map((item) =>
                item.barcode === barcode
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                          scannedAt: new Date().toISOString(),
                      }
                    : item
            )
        );
    };

    const completeOrder = async () => {
        if (scannedItems.length === 0) {
            toast.error("Scan at least one item before completing the order");
            return;
        }

        if (!verifiedStaff?.id) {
            toast.error("Please verify the staff PIN before completing this order");
            setStep("staff-pin");
            return;
        }

        if (isCompletingOrder) return;

        setIsCompletingOrder(true);
        setCheckoutMessage("Locking stock in IMS...");

        try {
            const checkoutItems = scannedItems.map((item) => ({
                barcode: item.barcode,
                quantity: item.quantity,
            }));

            const checkoutStoreId = getIMSStoreId();

            const startResult = await startIMSCheckout({
                staffId: verifiedStaff.id,
                items: checkoutItems,
                storeId: checkoutStoreId,
            });

            if (!startResult.success || !startResult.transactionId) {
                setCheckoutMessage(startResult.message);
                toast.error(startResult.message);
                return;
            }

            setCheckoutMessage("Stock locked. Completing IMS order...");

            const confirmResult = await confirmIMSCheckout({
                transactionId: startResult.transactionId,
                staffId: verifiedStaff.id,
                paymentMethod,
                customerName: "Walk-in Customer",
                notes: `Patela shared counter checkout by ${verifiedStaff.name || verifiedStaff.email || verifiedStaff.id}`,
                storeId: checkoutStoreId,
            });

            if (!confirmResult.success) {
                setCheckoutMessage(confirmResult.message);
                toast.error(confirmResult.message);
                return;
            }

            const completedTime = new Date().toISOString();

            setCompletedAt(completedTime);
            setCompletedSale({
                orderNumber: confirmResult.orderNumber || confirmResult.receipt?.orderNumber,
                transactionId: confirmResult.transactionId || startResult.transactionId,
                staffName: verifiedStaff.name || verifiedStaff.email || "Staff member",
                paymentMethod,
                completedAt: completedTime,
            });
            setShowRejectOptions(false);
            setRejectReason("");
            setRejectOtherReason("");
            setRejectedAt(null);
            logOutStaffSession();
            setStep("completed");
            toast.success("Order completed in IMS. Staff session logged out.");
        } finally {
            setIsCompletingOrder(false);
            setCheckoutMessage(null);
        }
    };

    const rejectOrder = () => {
        if (scannedItems.length === 0) {
            toast.error("Scan at least one item before rejecting the order");
            return;
        }

        if (!rejectReason) {
            toast.error("Please select a rejection reason");
            return;
        }

        if (rejectReason === "other" && !rejectOtherReason.trim()) {
            toast.error("Please type the rejection reason");
            return;
        }

        setRejectedAt(new Date().toISOString());
        setCompletedAt(null);
        logOutStaffSession();
        setStep("rejected");
        toast.error(`Order rejected: ${getRejectReasonText(rejectReason, rejectOtherReason)}. Staff session logged out.`);
    };

    useEffect(() => {
        if (imsAccessCheckedOnViewRef.current || imsAuthReady) return;

        imsAccessCheckedOnViewRef.current = true;
        ensureIMSAuth();
    }, [ensureIMSAuth, imsAuthReady]);

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            console.error("[App Runtime Error]", event.message, event.error);
        };

        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            console.error("[App Promise Error]", event.reason);
        };

        window.addEventListener("error", handleError);
        window.addEventListener("unhandledrejection", handleUnhandledRejection);

        return () => {
            window.removeEventListener("error", handleError);
            window.removeEventListener("unhandledrejection", handleUnhandledRejection);
        };
    }, []);

    return (
        <div className="min-h-screen patela-app-bg pb-24">
            <header className="sticky top-0 z-40 bg-primary px-5 py-4 patela-shadow-md">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="h-11 w-11 rounded-xl bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-primary-foreground/70">IMS Inventory</p>
                        <h1 className="text-lg font-bold text-primary-foreground">Start Picking</h1>
                    </div>

                    <PatelaLogo size="sm" variant="icon" />
                </div>
            </header>

            <main className="px-5 py-5 space-y-5">
                <section className={cn("rounded-2xl border p-4 patela-shadow-sm", imsAuthReady ? "bg-success/10 border-success/25" : "bg-card border-primary/10")}>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">IMS access</p>
                            <h2 className="font-bold text-foreground mt-1">
                                {imsAuthReady
                                    ? "IMS access ready"
                                    : imsAuthLoading
                                        ? "Checking IMS access"
                                        : "IMS access not checked"}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Using secure IMS bearer access</p>
                            {imsAuthMessage && <p className="text-sm text-muted-foreground mt-2">{imsAuthMessage}</p>}
                        </div>

                        <Button
                            variant={imsAuthReady ? "outline" : "hero"}
                            size="sm"
                            onClick={() => ensureIMSAuth(true)}
                            disabled={imsAuthLoading}
                        >
                            {imsAuthLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                            {imsAuthReady ? "Refresh" : "Check Access"}
                        </Button>
                    </div>
                </section>

                {step === "ready" && (
                    <section className="space-y-4">
                        <div className="bg-card rounded-2xl border border-primary/10 p-6 text-center patela-shadow-sm">
                            <div className="h-20 w-20 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                                <ClipboardCheck className="h-10 w-10 text-accent" />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Ready to start picking</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                                Start a new counter session. The staff member will enter their IMS PIN before scanning starts.
                            </p>

                            <Button variant="hero" size="xl" onClick={startPicking} className="w-full mt-6">
                                <ScanBarcode className="h-6 w-6" />
                                Verify Staff & Start
                            </Button>
                        </div>

                        <div className="rounded-2xl border border-primary/10 bg-card p-4">
                            <p className="text-xs text-muted-foreground">
                                IMS API: <span className="font-semibold text-foreground">{getIMSApiBaseUrl()}</span>
                                {getIMSStoreId() && (
                                    <>
                                        <br />
                                        Store: <span className="font-semibold text-foreground">{getIMSStoreId()}</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </section>
                )}

                {step === "staff-pin" && (
                    <StaffPinScreen
                        onVerified={handleStaffVerified}
                        onCancel={() => {
                            logOutStaffSession();
                            setStep("ready");
                        }}
                    />
                )}

                {step === "active" && (
                    <section className="space-y-4">
                        {verifiedStaff && (
                            <div className="rounded-2xl border border-success/20 bg-success/10 p-4 flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-wide text-success font-bold">Staff verified</p>
                                    <h2 className="font-bold text-foreground">{verifiedStaff.name || verifiedStaff.email || "Staff member"}</h2>
                                    <p className="text-xs text-muted-foreground">This session will log out after completion.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setStep("staff-pin")} disabled={isProcessingBarcode || isCompletingOrder}>
                                    Change
                                </Button>
                            </div>
                        )}

                        <div className="bg-card rounded-2xl border border-primary/10 overflow-hidden patela-shadow-sm">
                            <div className="relative bg-primary/95 flex items-center justify-center overflow-hidden p-6">
                                <div className="text-center px-8">
                                    <div className="h-20 w-20 rounded-3xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                                        {isProcessingBarcode ? (
                                            <Loader2 className="h-10 w-10 text-accent animate-spin" />
                                        ) : (
                                            <Camera className="h-10 w-10 text-accent" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-primary-foreground">
                                        {isProcessingBarcode ? processingMessage || "Processing barcode..." : "Active picking"}
                                    </h3>
                                    <p className="text-sm text-primary-foreground/70 mt-2">
                                        Scan multiple barcodes. Items will appear below with prices and total when IMS returns a price.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {cameraError && (
                            <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-warning">{cameraError}</p>
                            </div>
                        )}

                        {scanMessage && (
                            <div
                                className={cn(
                                    "rounded-xl border p-3 flex gap-3",
                                    scanStatus === "success" && "border-success/30 bg-success/10",
                                    scanStatus === "warning" && "border-warning/30 bg-warning/10",
                                    scanStatus === "error" && "border-destructive/30 bg-destructive/10"
                                )}
                            >
                                {scanStatus === "success" ? (
                                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                                ) : scanStatus === "warning" ? (
                                    <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                )}
                                <p className="text-sm text-muted-foreground">{scanMessage}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="hero" onClick={startCamera} disabled={isCameraActive || isProcessingBarcode}>
                                {isCameraActive || isProcessingBarcode ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                                {isProcessingBarcode ? "Processing..." : isCameraActive ? "Opening..." : "Scan Item"}
                            </Button>

                            <Button variant="outline" onClick={startNewPicking} disabled={isProcessingBarcode}>
                                <RefreshCcw className="h-5 w-5" />
                                Reset
                            </Button>
                        </div>

                        <div className="bg-card rounded-2xl border border-primary/10 p-4 space-y-3">
                            <label className="text-sm font-semibold text-foreground">Manual barcode entry</label>

                            <div className="flex gap-2">
                                <Input
                                    value={manualBarcode}
                                    onChange={(event) => setManualBarcode(event.target.value)}
                                    placeholder="Enter or paste barcode"
                                    className="h-12"
                                    disabled={isProcessingBarcode}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") processBarcode(manualBarcode);
                                    }}
                                />

                                <Button size="icon" onClick={() => processBarcode(manualBarcode)} disabled={isProcessingBarcode}>
                                    {isProcessingBarcode ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>

                        <div className="bg-card rounded-2xl border border-primary/10 p-4 patela-shadow-sm">
                            <div className="flex items-center justify-between gap-3 mb-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Picking list</p>
                                    <h2 className="font-bold text-foreground">Scanned items</h2>
                                </div>
                                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-bold">
                                    {itemCount} item{itemCount === 1 ? "" : "s"}
                                </span>
                            </div>

                            {scannedItems.length === 0 ? (
                                <div className="rounded-xl bg-secondary p-5 text-center">
                                    <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                    <p className="font-semibold text-foreground">No items scanned yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">Tap Scan Item to add the first barcode.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                                    {scannedItems.map((scannedItem) => {
                                        const lineTotal = scannedItem.price === null ? null : scannedItem.price * scannedItem.quantity;

                                        return (
                                            <div key={scannedItem.barcode} className="rounded-xl bg-secondary p-3 border border-border/50">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-foreground truncate">{scannedItem.productName}</p>
                                                        <p className="font-mono text-xs text-muted-foreground truncate">{scannedItem.barcode}</p>
                                                        {scannedItem.sku && <p className="text-[11px] text-muted-foreground mt-1">SKU: {scannedItem.sku}</p>}
                                                    </div>

                                                    <button
                                                        onClick={() => removeScannedItem(scannedItem.barcode)}
                                                        className="h-9 w-9 rounded-lg bg-background flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                                                        disabled={isProcessingBarcode}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 mt-3">
                                                    <InfoTile label="Price" value={formatCurrency(scannedItem.price)} />
                                                    <InfoTile label="Line total" value={formatCurrency(lineTotal)} />
                                                </div>

                                                {/* <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => reduceQuantity(scannedItem.barcode)} disabled={isProcessingBarcode}>
                                                            -
                                                        </Button>
                                                        <span className="min-w-8 text-center font-bold">{scannedItem.quantity}</span>
                                                        <Button variant="outline" size="sm" onClick={() => increaseQuantity(scannedItem.barcode)} disabled={isProcessingBarcode}>
                                                            +
                                                        </Button>
                                                    </div>

                                                    {scannedItem.status && (
                                                        <span className={cn("inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold", getStatusClass(scannedItem.status))}>
                                                            {scannedItem.status}
                                                        </span>
                                                    )}
                                                </div> */}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="bg-card rounded-2xl border border-success/20 p-4 patela-shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Order total</p>
                                    <h2 className="text-2xl font-bold text-foreground mt-1">{formatCurrency(totalAmount)}</h2>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {itemCount} scanned item{itemCount === 1 ? "" : "s"}. Items without price are counted as R0.00.
                                    </p>
                                </div>
                                <CheckCircle2 className="h-10 w-10 text-success" />
                            </div>

                            <div className="mt-4 space-y-2">
                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-bold">Payment method</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {(["CARD", "CASH", "EFT", "VOUCHER"] as IMSPaymentMethod[]).map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method)}
                                            disabled={isProcessingBarcode || isCompletingOrder}
                                            className={cn(
                                                "rounded-xl border px-2 py-3 text-xs font-black transition-colors disabled:opacity-60",
                                                paymentMethod === method
                                                    ? "border-accent bg-accent text-accent-foreground"
                                                    : "border-border bg-background text-foreground hover:bg-secondary"
                                            )}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {checkoutMessage && (
                                <div className="mt-4 rounded-xl border border-accent/25 bg-accent/10 p-3 text-sm font-semibold text-accent">
                                    {checkoutMessage}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-3 mt-4">
                                <Button variant="success" className="w-full" onClick={completeOrder} disabled={isProcessingBarcode || isCompletingOrder || scannedItems.length === 0}>
                                    {isCompletingOrder ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                                    {isCompletingOrder ? "Completing in IMS..." : "Complete Order"}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
                                    onClick={() => setShowRejectOptions((currentValue) => !currentValue)}
                                    disabled={isProcessingBarcode || isCompletingOrder || scannedItems.length === 0}
                                >
                                    <XCircle className="h-5 w-5" />
                                    Reject Order
                                </Button>
                            </div>

                            {showRejectOptions && (
                                <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 space-y-3">
                                    <div>
                                        <p className="text-xs text-destructive uppercase tracking-wide font-bold">Order rejected</p>
                                        <h3 className="font-bold text-foreground mt-1">Select rejection reason</h3>
                                        <p className="text-xs text-muted-foreground mt-1">This is local only for now. No endpoint is called.</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        {orderRejectionReasons.map((reason) => {
                                            const isSelected = rejectReason === reason.value;

                                            return (
                                                <button
                                                    key={reason.value}
                                                    type="button"
                                                    onClick={() => setRejectReason(reason.value)}
                                                    className={cn(
                                                        "w-full rounded-xl border px-3 py-3 text-left text-sm font-semibold transition-colors",
                                                        isSelected
                                                            ? "border-destructive bg-destructive/10 text-destructive"
                                                            : "border-border bg-background text-foreground hover:bg-secondary"
                                                    )}
                                                >
                                                    {reason.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {rejectReason === "other" && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-foreground">Other reason</label>
                                            <Input
                                                value={rejectOtherReason}
                                                onChange={(event) => setRejectOtherReason(event.target.value)}
                                                placeholder="Type rejection reason"
                                                className="h-12"
                                            />
                                        </div>
                                    )}

                                    <Button variant="destructive" className="w-full" onClick={rejectOrder}>
                                        Confirm Rejection
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {step === "completed" && (
                    <PaymentResultSuccess
                        amount={totalAmount}
                        title="Order Done"
                        subtitle="IMS order completed. The staff member has been logged out so the next attendant can use this device."
                        amountLabel="Order Total"
                        note={`${itemCount} scanned item${itemCount === 1 ? "" : "s"}${completedSale?.orderNumber ? ` • ${completedSale.orderNumber}` : ""}${completedAt ? ` • Completed at ${new Date(completedAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}` : ""}`}
                        showReceiptOptions={false}
                        showBottomNav
                        secondaryActionLabel="View Inventory"
                        primaryActionLabel="Next Staff"
                        onSecondaryAction={() => navigate("/items")}
                        onDone={startNewPicking}
                    />
                )}

                {step === "rejected" && (
                    <section className="bg-card rounded-2xl border border-destructive/20 p-6 text-center patela-shadow-sm">
                        <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                            <XCircle className="h-10 w-10 text-destructive" />
                        </div>

                        <p className="text-xs text-destructive uppercase tracking-wide font-bold">Order rejected</p>
                        <h2 className="text-2xl font-bold text-foreground mt-1">Picking Rejected</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            This order was rejected locally. No endpoint has been called yet.
                        </p>

                        <div className="grid grid-cols-1 gap-3 mt-5 text-left">
                            <InfoTile label="Reason" value={getRejectReasonText(rejectReason, rejectOtherReason)} />
                            <InfoTile label="Order total" value={formatCurrency(totalAmount)} />
                            <InfoTile label="Items scanned" value={itemCount} />
                            <InfoTile
                                label="Rejected at"
                                value={
                                    rejectedAt
                                        ? new Date(rejectedAt).toLocaleTimeString("en-ZA", {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "—"
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-6">
                            <Button variant="hero" className="w-full" onClick={startNewPicking}>
                                Start New Picking
                            </Button>

                            <Button variant="outline" className="w-full" onClick={() => navigate("/items")}>
                                View Inventory
                            </Button>
                        </div>
                    </section>
                )}

                <section className="rounded-2xl border border-primary/10 bg-card p-4">
                    <p className="text-xs text-muted-foreground">
                        Logged in as{" "}
                        <span className="font-semibold text-foreground">
                            {user?.full_name || user?.email || "Patela user"}
                        </span>
                        . Start Picking verifies the IMS staff PIN first, scans unique item barcodes, completes the IMS order, and logs the staff session out for the next attendant.
                    </p>
                </section>
            </main>

            <BottomNav />
        </div>
    );
}

function InfoTile({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="rounded-xl bg-secondary p-3 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
            <p className="text-sm font-bold text-foreground break-words mt-1">{value || "—"}</p>
        </div>
    );
}
