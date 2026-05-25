import { Capacitor, registerPlugin } from "@capacitor/core";

export type PatelaQposPaymentStatus =
  | "approved"
  | "declined"
  | "cancelled"
  | "terminated"
  | "failed"
  | "test"
  | "unknown";

export interface PatelaQposScanDevicesOptions {
  timeout?: number;
  nameFilter?: string;
}

export interface PatelaQposScanDevicesResult {
  devices: string[];
  count: number;
}

export interface PatelaQposBatteryOptions {
  bluetoothName: string;
}

export interface PatelaQposBatteryResult {
  battery: number;
  batteryPercentage?: string;
  batteryLevel?: string;
  isCharging?: string;
  raw?: Record<string, unknown>;
}

export interface PatelaQposStartPaymentOptions {
  bluetoothName: string;
  amountInCents: number;
  currencyCode?: string;
  reference?: string;
  autoApproveTestMode?: boolean;
}

export interface PatelaQposPaymentResult {
  status: PatelaQposPaymentStatus;
  message: string;
  transactionResult?: number;
}

export interface PatelaQposEvent {
  event: string;
  message?: string;
  code?: number;
  tlv?: string;
}

export interface PatelaQposPlugin {
  ping(): Promise<{
    ok: boolean;
    message: string;
  }>;

  scanDevices(
    options?: PatelaQposScanDevicesOptions,
  ): Promise<PatelaQposScanDevicesResult>;

  getBattery(options: PatelaQposBatteryOptions): Promise<PatelaQposBatteryResult>;

  startPayment(
    options: PatelaQposStartPaymentOptions,
  ): Promise<PatelaQposPaymentResult>;

  disconnect(): Promise<{ disconnected: boolean }>;

  addListener(
    eventName: "patelaQposEvent",
    listenerFunc: (event: PatelaQposEvent) => void,
  ): Promise<{ remove: () => Promise<void> }>;
}

export const PatelaQpos = registerPlugin<PatelaQposPlugin>("PatelaQpos");

export const amountToCents = (amount: number): number => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than 0.");
  }

  return Math.round(amount * 100);
};

export const scanPatelaQposDevices = async (
  nameFilter = "",
): Promise<string[]> => {
  console.log("PATELA QPOS SCAN START:", { nameFilter });

  const result = await PatelaQpos.scanDevices({
    timeout: 15,
    nameFilter,
  });

  console.log("PATELA QPOS SCAN RESULT:", result);

  return result.devices || [];
};

export const getPatelaQposBattery = async (
  bluetoothName: string,
): Promise<number> => {
  console.log("PATELA QPOS BATTERY REQUEST:", { bluetoothName });

  const result = await PatelaQpos.getBattery({
    bluetoothName,
  });

  console.log("PATELA QPOS BATTERY RESULT:", result);

  return typeof result.battery === "number" ? result.battery : -1;
};

export const startPatelaQposPaymentWithLogs = async (
  options: PatelaQposStartPaymentOptions,
): Promise<PatelaQposPaymentResult> => {
  console.log("PATELA QPOS ENV CHECK:", {
    platform: Capacitor.getPlatform(),
    isNative: Capacitor.isNativePlatform(),
    isPluginAvailable: Capacitor.isPluginAvailable("PatelaQpos"),
    pluginName: "PatelaQpos",
    pluginObject: PatelaQpos,
  });

  console.log("PATELA QPOS START PAYMENT REQUEST:", options);

  if (!Capacitor.isNativePlatform()) {
    throw new Error("Patela QPOS only works on native iOS.");
  }

  const result = await PatelaQpos.startPayment({
    bluetoothName: options.bluetoothName,
    amountInCents: options.amountInCents,
    currencyCode: options.currencyCode || "0710",
    reference: options.reference || `ORDER-${Date.now()}`,
    autoApproveTestMode: options.autoApproveTestMode ?? true,
  });

  console.log("PATELA QPOS PAYMENT RESULT:", result);

  return result;
};