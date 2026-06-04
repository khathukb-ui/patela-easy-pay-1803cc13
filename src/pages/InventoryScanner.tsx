import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/patela/BottomNav";
import { PatelaLogo } from "@/components/patela/PatelaLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { fetchIMSPickingTasks, getIMSApiBaseUrl, getIMSLoginEmail, IMSBarcodeItem, IMSPickingTask, loginToIMS, lookupIMSBarcodeItem } from "@/lib/ims-api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Barcode,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Package,
  RefreshCcw,
  ScanBarcode,
  Search,
  ShieldAlert,
  Warehouse,
  XCircle,
} from "lucide-react";

type ScanStep = "scan" | "pending" | "inProgress" | "completed";

type LocalScanItem = {
  barcode: string;
  productName: string;
  status?: string;
  movedAt: string;
};
type NativeBarcodeDetector = {
  detect: (source: CanvasImageSource) => Promise<Array<{ rawValue?: string }>>;
};

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => NativeBarcodeDetector;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

const scannerFormats = [
  "aztec",
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "data_matrix",
  "ean_13",
  "ean_8",
  "itf",
  "pdf417",
  "qr_code",
  "upc_a",
  "upc_e",
];

const getProductName = (item: IMSBarcodeItem | null) =>
  item?.product?.name || item?.sku || item?.barcode || "IMS Item";

const getStatusClass = (status?: string) => {
  const value = status?.toUpperCase();
  if (value === "IN_STOCK") return "bg-success/10 text-success border-success/20";
  if (value === "SOLD" || value === "REMOVED") return "bg-destructive/10 text-destructive border-destructive/20";
  return "bg-secondary text-muted-foreground border-border";
};

export default function InventoryScanner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<NativeBarcodeDetector | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastDetectedRef = useRef<string>("");

  const [step, setStep] = useState<ScanStep>("scan");
  const [manualBarcode, setManualBarcode] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [imsAuthLoading, setImsAuthLoading] = useState(false);
  const [imsAuthMessage, setImsAuthMessage] = useState<string | null>(null);
  const [imsAuthReady, setImsAuthReady] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [lookupStatus, setLookupStatus] = useState<"idle" | "found" | "not_found" | "unauthorized" | "error">("idle");
  const [item, setItem] = useState<IMSBarcodeItem | null>(null);
  const [imsTasksLoading, setImsTasksLoading] = useState(false);
  const [imsTasksMessage, setImsTasksMessage] = useState<string | null>(null);
  const [imsPendingTasks, setImsPendingTasks] = useState<IMSPickingTask[]>([]);
  const [imsInProgressTasks, setImsInProgressTasks] = useState<IMSPickingTask[]>([]);
  const [imsCompletedTasks, setImsCompletedTasks] = useState<IMSPickingTask[]>([]);
  const [inProgressItems, setInProgressItems] = useState<LocalScanItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("patela-ims-in-progress") || "[]");
    } catch {
      return [];
    }
  });

  const [queuedItems, setQueuedItems] = useState<LocalScanItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("patela-ims-removal-queue") || "[]");
    } catch {
      return [];
    }
  });

  const supportsCameraScan = typeof window !== "undefined" && "BarcodeDetector" in window;

  const ensureIMSAuth = useCallback(async (force = false) => {
    setImsAuthLoading(true);
    setImsAuthMessage("Signing in to IMS...");

    const result = await loginToIMS(force);

    setImsAuthLoading(false);
    setImsAuthReady(result.success);
    setImsAuthMessage(result.message);

    if (result.success) {
      toast.success("IMS login ready");
    } else {
      toast.error(result.message);
    }

    return result;
  }, []);

  const loadIMSPickingTasks = useCallback(async () => {
    setImsTasksLoading(true);
    setImsTasksMessage("Loading IMS picking tasks...");

    const [pendingResult, inProgressResult, completedResult] = await Promise.all([
      fetchIMSPickingTasks("PENDING"),
      fetchIMSPickingTasks("IN_PROGRESS"),
      fetchIMSPickingTasks("COMPLETED"),
    ]);

    setImsPendingTasks(pendingResult.tasks);
    setImsInProgressTasks(inProgressResult.tasks);
    setImsCompletedTasks(completedResult.tasks);

    const failed = [pendingResult, inProgressResult, completedResult].find((result) => !result.success);
    const totalTasks = pendingResult.tasks.length + inProgressResult.tasks.length + completedResult.tasks.length;

    setImsTasksMessage(
      failed
        ? failed.message
        : totalTasks > 0
        ? `${totalTasks} IMS picking task${totalTasks === 1 ? "" : "s"} loaded.`
        : "No IMS picking tasks returned."
    );
    setImsTasksLoading(false);
  }, []);

  const stopCamera = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraActive(false);
  }, []);

  const lookupBarcode = useCallback(
    async (barcode: string) => {
      const cleanBarcode = barcode.trim();
      if (!cleanBarcode) {
        toast.error("Please scan or enter a barcode first");
        return;
      }

      stopCamera();
      setLookupLoading(true);
      setLookupStatus("idle");
      setLookupMessage(null);
      setItem(null);
      setScannedBarcode(cleanBarcode);

      const result = await lookupIMSBarcodeItem(cleanBarcode);

      setLookupLoading(false);
      setLookupStatus(result.status);
      setLookupMessage(result.message);
      setItem(result.item);
      setStep("pending");

      if (result.status === "found") {
        toast.success("IMS item found");
      } else if (result.status === "not_found") {
        toast.warning("Barcode not found in IMS");
      } else if (result.status === "unauthorized") {
        toast.error("IMS authorization required");
      } else {
        toast.error(result.message);
      }
    },
    [stopCamera]
  );

  const scanFrame = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;

    if (!video || !canvas || !detector || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const barcodes = await detector.detect(canvas);
      const detected = barcodes[0]?.rawValue?.trim();

      if (detected && detected !== lastDetectedRef.current) {
        lastDetectedRef.current = detected;
        setManualBarcode(detected);
        await lookupBarcode(detected);
        return;
      }
    } catch (error) {
      console.error("Barcode scan failed", error);
    }

    rafRef.current = requestAnimationFrame(scanFrame);
  }, [lookupBarcode]);

  const startCamera = async () => {
    setCameraError(null);
    setLookupMessage(null);
    setLookupStatus("idle");

    if (!supportsCameraScan || !window.BarcodeDetector) {
      setCameraError("Camera barcode scanning is not supported in this browser. Use Chrome or enter the barcode manually for now.");
      return;
    }

    try {
      detectorRef.current = new window.BarcodeDetector({ formats: scannerFormats });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      lastDetectedRef.current = "";
      setIsCameraActive(true);
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (error) {
      setCameraError(
        error instanceof Error
          ? error.message
          : "Unable to open camera. Please check camera permissions."
      );
      stopCamera();
    }
  };

  const resetFlow = () => {
    stopCamera();
    setStep("scan");
    setManualBarcode("");
    setScannedBarcode("");
    setItem(null);
    setLookupStatus("idle");
    setLookupMessage(null);
    setCameraError(null);
    lastDetectedRef.current = "";
  };

  const movePendingToInProgress = () => {
    if (!scannedBarcode) return;

    const nextItem: LocalScanItem = {
      barcode: scannedBarcode,
      productName: getProductName(item),
      status: item?.status,
      movedAt: new Date().toISOString(),
    };

    const alreadyExists = inProgressItems.some((progressItem) => progressItem.barcode === nextItem.barcode);
    const nextInProgress = alreadyExists
      ? inProgressItems
      : [nextItem, ...inProgressItems].slice(0, 25);

    setInProgressItems(nextInProgress);
    localStorage.setItem("patela-ims-in-progress", JSON.stringify(nextInProgress));
    setItem(null);
    setScannedBarcode("");
    setManualBarcode("");
    setLookupStatus("idle");
    setLookupMessage(null);
    setStep("inProgress");
    toast.success("Item moved to In Progress");
  };

  const markCompleted = (progressItem: LocalScanItem) => {
    const completedItem: LocalScanItem = {
      ...progressItem,
      movedAt: new Date().toISOString(),
    };

    const nextInProgress = inProgressItems.filter((item) => item.barcode !== progressItem.barcode);
    const nextQueue = [completedItem, ...queuedItems].slice(0, 25);

    setInProgressItems(nextInProgress);
    setQueuedItems(nextQueue);
    localStorage.setItem("patela-ims-in-progress", JSON.stringify(nextInProgress));
    localStorage.setItem("patela-ims-removal-queue", JSON.stringify(nextQueue));
    setStep("completed");
    toast.success("Item moved to Completed");
  };

  useEffect(() => {
    ensureIMSAuth().then((result) => {
      if (result.success) {
        loadIMSPickingTasks();
      }
    });
  }, [ensureIMSAuth, loadIMSPickingTasks]);

  useEffect(() => stopCamera, [stopCamera]);

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
            <h1 className="text-lg font-bold text-primary-foreground">Barcode Scanner</h1>
          </div>

          <PatelaLogo size="sm" variant="icon" />
        </div>
      </header>

      <main className="px-5 py-5 space-y-5">
        <section className="bg-card rounded-2xl border border-primary/10 p-4 patela-shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <ScanBarcode className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Scan IMS barcode</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Patela signs in to IMS, scans a barcode, shows the item under Pending, then moves it to In Progress and Completed after you confirm each step. No IMS stock is removed yet.
              </p>
            </div>
          </div>
        </section>

        <section className={cn("rounded-2xl border p-4 patela-shadow-sm", imsAuthReady ? "bg-success/10 border-success/25" : "bg-card border-primary/10")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">IMS session</p>
              <h2 className="font-bold text-foreground mt-1">{imsAuthReady ? "Signed in to IMS" : imsAuthLoading ? "Signing in to IMS" : "IMS login required"}</h2>
              <p className="text-xs text-muted-foreground mt-1">Using IMS user: {getIMSLoginEmail()}</p>
              {imsAuthMessage && <p className="text-sm text-muted-foreground mt-2">{imsAuthMessage}</p>}
            </div>
            <Button variant={imsAuthReady ? "outline" : "hero"} size="sm" onClick={() => ensureIMSAuth(true).then((result) => result.success && loadIMSPickingTasks())} disabled={imsAuthLoading}>
              {imsAuthLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
              {imsAuthReady ? "Refresh" : "Login"}
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-2">
          {[
            { id: "scan" as const, label: "Scan", icon: Barcode, count: null },
            { id: "pending" as const, label: "Pending", icon: ClipboardCheck, count: (item ? 1 : 0) + imsPendingTasks.length },
            { id: "inProgress" as const, label: "In-Progress", icon: Package, count: inProgressItems.length + imsInProgressTasks.length },
            { id: "completed" as const, label: "Completed", icon: CheckCircle2, count: queuedItems.length + imsCompletedTasks.length },
          ].map((flowStep, index) => {
            const Icon = flowStep.icon;
            const active = step === flowStep.id;
            const complete =
              index === 0
                ? !!scannedBarcode
                : index === 1
                ? !!item || imsPendingTasks.length > 0
                : index === 2
                ? inProgressItems.length > 0 || imsInProgressTasks.length > 0
                : queuedItems.length > 0 || imsCompletedTasks.length > 0;

            return (
              <button
                key={flowStep.id}
                type="button"
                onClick={() => setStep(flowStep.id)}
                className={cn(
                  "rounded-xl border p-3 text-center transition-colors",
                  active && "border-accent bg-accent/10",
                  !active && complete && "border-success/30 bg-success/10",
                  !active && !complete && "border-border bg-card"
                )}
              >
                <Icon className={cn("h-5 w-5 mx-auto mb-1", active ? "text-accent" : complete ? "text-success" : "text-muted-foreground")} />
                <div className="flex items-center justify-center gap-1">
                  <p className="text-xs font-semibold">{flowStep.label}</p>
                  {typeof flowStep.count === "number" && flowStep.count > 0 && (
                    <span className="text-[10px] rounded-full bg-accent/10 text-accent px-1.5 py-0.5 font-bold">
                      {flowStep.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </section>

        <section className="rounded-2xl border border-primary/10 bg-card p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">IMS picking tasks</p>
            <p className="text-sm text-muted-foreground mt-1">{imsTasksMessage || "Pending, In-Progress and Completed tasks will load from IMS."}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadIMSPickingTasks} disabled={imsTasksLoading || !imsAuthReady}>
            {imsTasksLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </section>

        {step === "scan" && (
          <section className="space-y-4">
            <div className="bg-card rounded-2xl border border-primary/10 overflow-hidden patela-shadow-sm">
              <div className="relative aspect-[4/5] bg-primary/95 flex items-center justify-center">
                {isCameraActive ? (
                  <>
                    <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" playsInline muted />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-44 border-2 border-accent rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur rounded-xl px-4 py-3 text-center">
                      <p className="text-sm font-semibold text-foreground">Point camera at the IMS barcode</p>
                      <p className="text-xs text-muted-foreground">Detection will continue automatically</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center px-8">
                    <div className="h-20 w-20 rounded-3xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-10 w-10 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-foreground">Ready to scan</h3>
                    <p className="text-sm text-primary-foreground/70 mt-2">
                      Use your camera or enter the barcode manually below.
                    </p>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {cameraError && (
              <div className="rounded-xl border border-warning/30 bg-warning/10 p-3 flex gap-3">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-warning">{cameraError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button variant="hero" onClick={isCameraActive ? stopCamera : startCamera}>
                {isCameraActive ? <XCircle className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                {isCameraActive ? "Stop Scan" : "Start Scan"}
              </Button>
              <Button variant="outline" onClick={resetFlow}>
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
                  onKeyDown={(event) => {
                    if (event.key === "Enter") lookupBarcode(manualBarcode);
                  }}
                />
                <Button size="icon" onClick={() => lookupBarcode(manualBarcode)} disabled={lookupLoading}>
                  {lookupLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">IMS API: {getIMSApiBaseUrl()}</p>
            </div>
          </section>
        )}

        {step === "pending" && (
          <section className="space-y-4">
            {!lookupLoading && !item && lookupStatus === "idle" && imsPendingTasks.length === 0 && (
              <div className="bg-card rounded-2xl border border-primary/10 p-6 text-center patela-shadow-sm">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h2 className="text-lg font-bold text-foreground">No pending item yet</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Scan an IMS barcode first. Once the item is found, it will appear here as Pending.
                </p>
                <Button variant="hero" onClick={() => setStep("scan")} className="w-full mt-5">
                  <ScanBarcode className="h-5 w-5" />
                  Go to Scan
                </Button>
              </div>
            )}

            {imsPendingTasks.length > 0 && (
              <TaskList
                title="IMS Pending tasks"
                description="These pending items are coming directly from IMS."
                tasks={imsPendingTasks}
                emptyMessage="No pending IMS tasks returned."
              />
            )}

            {lookupLoading && (
              <div className="bg-card rounded-2xl border border-primary/10 p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                <p className="font-semibold">Checking IMS...</p>
              </div>
            )}

            {!lookupLoading && lookupStatus === "found" && item && (
              <div className="bg-card rounded-2xl border border-success/30 overflow-hidden patela-shadow-sm">
                <div className="bg-success/10 p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                  <div>
                    <p className="font-bold text-foreground">Item found in IMS</p>
                    <p className="text-sm text-muted-foreground">This item is pending confirmation before it moves to In Progress.</p>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Product</p>
                    <h2 className="text-xl font-bold text-foreground mt-1">{getProductName(item)}</h2>
                    {item.product?.description && <p className="text-sm text-muted-foreground mt-1">{item.product.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <InfoTile label="Barcode" value={item.barcode} />
                    <InfoTile label="SKU" value={item.sku || item.product?.sku} />
                    <InfoTile label="Colour" value={item.color} />
                    <InfoTile label="Size" value={item.size} />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={cn("inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold", getStatusClass(item.status))}>
                      {item.status || "UNKNOWN"}
                    </span>
                    {item.warehouse?.name && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                        <Warehouse className="h-3 w-3" />
                        {item.warehouse.name}
                      </span>
                    )}
                    {item.box?.barcode && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                        <Package className="h-3 w-3" />
                        Box {item.box.barcode}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl bg-accent/10 border border-accent/20 p-3">
                    <p className="text-sm text-accent font-semibold">Test mode</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This button will move the item from Pending to In Progress in Patela for testing. It will not change IMS stock yet.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={resetFlow}>Scan Again</Button>
                    <Button variant="success" onClick={movePendingToInProgress}>Move to In Progress</Button>
                  </div>
                </div>
              </div>
            )}

            {!lookupLoading && lookupStatus !== "idle" && lookupStatus !== "found" && (
              <div className="bg-card rounded-2xl border border-destructive/20 p-5 text-center">
                {lookupStatus === "unauthorized" ? (
                  <ShieldAlert className="h-12 w-12 text-warning mx-auto mb-3" />
                ) : (
                  <XCircle className="h-12 w-12 text-destructive mx-auto mb-3" />
                )}
                <h2 className="text-lg font-bold text-foreground mb-2">
                  {lookupStatus === "not_found" ? "No IMS item found" : lookupStatus === "unauthorized" ? "IMS authorization needed" : "No IMS item returned"}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">{lookupMessage || "IMS did not return an item for this barcode."}</p>
                <div className="rounded-xl bg-secondary p-3 mb-4 text-left">
                  <p className="text-xs text-muted-foreground">Scanned barcode</p>
                  <p className="font-mono font-bold break-all">{scannedBarcode}</p>
                </div>
                <Button onClick={resetFlow} className="w-full">
                  <ScanBarcode className="h-5 w-5" />
                  Scan Another Item
                </Button>
              </div>
            )}
          </section>
        )}

        {step === "inProgress" && (
          <section className="space-y-4">
            {inProgressItems.length > 0 || imsInProgressTasks.length > 0 ? (
              <>
                <div className="bg-card rounded-2xl border border-accent/30 p-5 text-center patela-shadow-sm">
                  <Package className="h-14 w-14 text-accent mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-foreground">In Progress items</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    These items have been reviewed and are waiting to be completed locally in Patela. IMS inventory is not updated yet.
                  </p>
                  <Button variant="hero" onClick={() => setStep("scan")} className="w-full mt-5">
                    <ScanBarcode className="h-5 w-5" />
                    Scan Another Item
                  </Button>
                </div>

                {imsInProgressTasks.length > 0 && (
                  <TaskList
                    title="IMS In-Progress tasks"
                    description="These are live IMS picking tasks with status IN_PROGRESS."
                    tasks={imsInProgressTasks}
                    emptyMessage="No IMS In-Progress tasks returned."
                  />
                )}

                <div className="bg-card rounded-2xl border border-primary/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-foreground">Local In-Progress list</h2>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-bold">{inProgressItems.length}</span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {inProgressItems.map((progressItem, index) => (
                      <div key={`${progressItem.barcode}-${progressItem.movedAt}-${index}`} className="rounded-xl bg-secondary p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{progressItem.productName}</p>
                            <p className="font-mono text-xs text-muted-foreground truncate">{progressItem.barcode}</p>
                            {progressItem.status && <p className="text-[10px] text-muted-foreground mt-1">IMS status: {progressItem.status}</p>}
                          </div>
                          <Button size="sm" variant="success" onClick={() => markCompleted(progressItem)}>
                            Complete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-2xl border border-primary/10 p-6 text-center patela-shadow-sm">
                <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h2 className="text-lg font-bold text-foreground">No items in progress</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Items will appear here after you scan an IMS barcode and move it from Pending.
                </p>
                <Button variant="hero" onClick={() => setStep("scan")} className="w-full mt-5">
                  <ScanBarcode className="h-5 w-5" />
                  Start Scanning
                </Button>
              </div>
            )}
          </section>
        )}

        {step === "completed" && (
          <section className="space-y-4">
            {queuedItems.length > 0 || imsCompletedTasks.length > 0 ? (
              <>
                <div className="bg-card rounded-2xl border border-success/30 p-5 text-center patela-shadow-sm">
                  <CheckCircle2 className="h-14 w-14 text-success mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-foreground">Completed items</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    These items were completed locally in Patela for testing. IMS inventory was not updated.
                  </p>
                  {queuedItems[0] && (
                    <div className="rounded-xl bg-secondary p-3 my-5 text-left">
                      <p className="text-xs text-muted-foreground">Latest completed local item</p>
                      <p className="font-bold">{queuedItems[0]?.productName}</p>
                      <p className="font-mono text-sm text-muted-foreground break-all">{queuedItems[0]?.barcode}</p>
                    </div>
                  )}
                  <Button variant="hero" onClick={resetFlow} className="w-full">
                    <ScanBarcode className="h-5 w-5" />
                    Scan Next Item
                  </Button>
                </div>

                {imsCompletedTasks.length > 0 && (
                  <TaskList
                    title="IMS Completed tasks"
                    description="These are completed picking tasks returned by IMS."
                    tasks={imsCompletedTasks}
                    emptyMessage="No completed IMS tasks returned."
                  />
                )}

                <div className="bg-card rounded-2xl border border-primary/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-foreground">Local completed scan history</h2>
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-bold">{queuedItems.length}</span>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {queuedItems.map((queuedItem, index) => (
                      <div key={`${queuedItem.barcode}-${queuedItem.movedAt}-${index}`} className="rounded-xl bg-secondary p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{queuedItem.productName}</p>
                            <p className="font-mono text-xs text-muted-foreground truncate">{queuedItem.barcode}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(queuedItem.movedAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-2xl border border-primary/10 p-6 text-center patela-shadow-sm">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h2 className="text-lg font-bold text-foreground">No completed items yet</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Completed items will appear here after you scan and confirm an IMS item.
                </p>
                <Button variant="hero" onClick={() => setStep("scan")} className="w-full mt-5">
                  <ScanBarcode className="h-5 w-5" />
                  Start Scanning
                </Button>
              </div>
            )}
          </section>
        )}

        <section className="rounded-2xl border border-primary/10 bg-card p-4">
          <p className="text-xs text-muted-foreground">
            Logged in as <span className="font-semibold text-foreground">{user?.full_name || user?.email || "Patela user"}</span>. Pending shows the scanned IMS item before confirmation. In Progress shows locally reviewed items. Completed shows locally completed test removals. Later, when IMS removal endpoint is ready, we will send this Patela user as audit data.
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function TaskList({
  title,
  description,
  tasks,
  emptyMessage,
}: {
  title: string;
  description: string;
  tasks: IMSPickingTask[];
  emptyMessage: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-primary/10 p-4 patela-shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-bold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-bold">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {tasks.map((task) => {
            const orderNumber = task.fulfillment?.salesOrder?.orderNumber || "No order number";
            const customerName = task.fulfillment?.salesOrder?.customer?.name || "No customer";
            const warehouseName = task.fulfillment?.warehouse?.name || "No warehouse";
            const items = task.items || [];
            const totalRequired = items.reduce((sum, item) => sum + Number(item.quantityRequired || 0), 0);
            const totalPicked = items.reduce((sum, item) => sum + Number(item.quantityPicked || 0), 0);
            const firstItems = items.slice(0, 3);

            return (
              <div key={task.id} className="rounded-xl bg-secondary p-3 border border-border/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{orderNumber}</p>
                    <p className="text-xs text-muted-foreground truncate">{customerName}</p>
                  </div>
                  <span className={cn("text-[10px] rounded-full border px-2 py-1 font-bold whitespace-nowrap", getStatusClass(task.status))}>
                    {task.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <InfoTile label="Warehouse" value={warehouseName} />
                  <InfoTile label="Picked" value={`${totalPicked}/${totalRequired}`} />
                  <InfoTile label="Zone" value={task.zone || "—"} />
                  <InfoTile label="Aisle" value={task.aisle || "—"} />
                </div>

                {firstItems.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {firstItems.map((taskItem) => (
                      <div key={taskItem.id} className="rounded-lg bg-background/70 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{taskItem.product?.name || taskItem.product?.sku || "IMS item"}</p>
                            <p className="text-[10px] text-muted-foreground truncate">SKU: {taskItem.product?.sku || "—"}</p>
                          </div>
                          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                            {taskItem.quantityPicked || 0}/{taskItem.quantityRequired || 0}
                          </span>
                        </div>
                      </div>
                    ))}
                    {items.length > firstItems.length && (
                      <p className="text-[11px] text-muted-foreground">+{items.length - firstItems.length} more item{items.length - firstItems.length === 1 ? "" : "s"}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
