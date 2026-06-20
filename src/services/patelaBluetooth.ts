import { BleClient, type ScanResult } from "@capacitor-community/bluetooth-le";

export type PatelaSignalStrength = "strong" | "medium" | "weak";

export interface PatelaBluetoothDevice {
  id: string;
  deviceId: string;
  name: string;
  model: string;
  battery: number;
  signal: PatelaSignalStrength;
  rssi?: number;
}

export type PatelaPaymentStatus =
  | "sent"
  | "pending"
  | "approved"
  | "declined"
  | "failed"
  | "unknown";

export interface PatelaPaymentRequest {
  amount: number;
  currency?: string;
  reference?: string;
}

export interface PatelaPaymentResult {
  status: PatelaPaymentStatus;
  message: string;
  rawResponse?: unknown;
}

interface PatelaPaymentTransport {
  serviceUuid: string;
  writeCharacteristicUuid: string;
  notifyCharacteristicUuid?: string;
  writeWithoutResponse?: boolean;
}

const DEFAULT_PATELA_PREFIXES = [
  "FP9310",
  "POS",
  "MPOS",
  "PAX",
  "Patela",
  "PATELA",
  "MPOS1011400027",
  "FP9320",
  "FP9340",
  "FP9810",
  "FP9800",
];

const CONNECT_TIMEOUT_MS = 45000;
const PAYMENT_RESPONSE_TIMEOUT_MS = 90000;
const BLE_CHUNK_SIZE = 180;

let isInitialized = false;
let isScanning = false;
let connectPromise: Promise<void> | null = null;

const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
};

const initializeBle = async (): Promise<void> => {
  if (isInitialized) {
    return;
  }

  await BleClient.initialize();
  isInitialized = true;
};

const stopScanSafely = async (): Promise<void> => {
  try {
    await BleClient.stopLEScan();
  } catch {
    // Scan may already be stopped.
  } finally {
    isScanning = false;
  }
};

const getAllowedPrefixes = (): string[] => {
  const envPrefixes = import.meta.env.VITE_PATELA_BLE_NAME_PREFIXES;

  const prefixes = envPrefixes
    ? envPrefixes
        .split(",")
        .map((prefix) => prefix.trim())
        .filter(Boolean)
    : DEFAULT_PATELA_PREFIXES;

  return prefixes.map((prefix) => prefix.toUpperCase());
};

const getDeviceName = (result: ScanResult): string => {
  return result.localName || result.device?.name || "";
};

const getDeviceModel = (name: string): string => {
  const upperName = name.toUpperCase();

  return (
    getAllowedPrefixes().find((prefix) => upperName.includes(prefix)) ||
    "Patela"
  );
};

const isPatelaDevice = (result: ScanResult): boolean => {
  const name = getDeviceName(result).toUpperCase();

  if (!name) {
    return false;
  }

  return getAllowedPrefixes().some((prefix) => name.includes(prefix));
};

const getSignalStrength = (rssi?: number): PatelaSignalStrength => {
  if (typeof rssi !== "number") {
    return "medium";
  }

  if (rssi >= -65) {
    return "strong";
  }

  if (rssi >= -85) {
    return "medium";
  }

  return "weak";
};

const toPatelaDevice = (result: ScanResult): PatelaBluetoothDevice => {
  const name = getDeviceName(result) || "Patela Device";
  const deviceId = result.device.deviceId;

  return {
    id: deviceId,
    deviceId,
    name,
    model: getDeviceModel(name),
    battery: -1,
    signal: getSignalStrength(result.rssi),
    rssi: result.rssi,
  };
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      message?: string;
      errorMessage?: string;
    };

    return (
      maybeError.errorMessage ||
      maybeError.message ||
      "Bluetooth operation failed."
    );
  }

  return "Bluetooth operation failed.";
};

const amountToCents = (amount: number): number => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Payment amount must be greater than 0.");
  }

  return Math.round(amount * 100);
};

const numberToBcdBytes = (numericString: string): number[] => {
  const evenString =
    numericString.length % 2 === 0 ? numericString : `0${numericString}`;

  const bytes: number[] = [];

  for (let i = 0; i < evenString.length; i += 2) {
    bytes.push(parseInt(evenString.slice(i, i + 2), 16));
  }

  return bytes;
};

const amountToAuthorisedAmountBcd = (amount: number): number[] => {
  const cents = amountToCents(amount);
  const twelveDigitAmount = cents.toString().padStart(12, "0");

  return numberToBcdBytes(twelveDigitAmount);
};

const bytesToDataView = (bytes: number[]): DataView => {
  const uint8Array = new Uint8Array(bytes);
  return new DataView(uint8Array.buffer);
};

const bytesToHex = (bytes: number[]): string => {
  return bytes
    .map((byte) => byte.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
};

const dataViewToText = (value: DataView): string => {
  try {
    return new TextDecoder().decode(value.buffer);
  } catch {
    return "";
  }
};

const dataViewToHex = (value: DataView): string => {
  const bytes = new Uint8Array(value.buffer);
  return bytesToHex(Array.from(bytes));
};

const dataViewToChunks = (
  dataView: DataView,
  chunkSize = BLE_CHUNK_SIZE,
): DataView[] => {
  const bytes = new Uint8Array(dataView.buffer);
  const chunks: DataView[] = [];

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.slice(index, index + chunkSize);
    chunks.push(new DataView(chunk.buffer));
  }

  return chunks;
};

const getBooleanEnv = (value: string | undefined, defaultValue: boolean) => {
  if (!value) {
    return defaultValue;
  }

  return value.toLowerCase() === "true";
};

const getEnvPaymentTransport = (): PatelaPaymentTransport | null => {
  const serviceUuid = import.meta.env.VITE_PATELA_PAYMENT_SERVICE_UUID;
  const writeCharacteristicUuid =
    import.meta.env.VITE_PATELA_PAYMENT_WRITE_CHARACTERISTIC_UUID;
  const notifyCharacteristicUuid =
    import.meta.env.VITE_PATELA_PAYMENT_NOTIFY_CHARACTERISTIC_UUID;

  if (!serviceUuid || !writeCharacteristicUuid) {
    return null;
  }

  return {
    serviceUuid,
    writeCharacteristicUuid,
    notifyCharacteristicUuid: notifyCharacteristicUuid || undefined,

    // Default to confirmed write for payment commands.
    // You can set VITE_PATELA_PAYMENT_WRITE_WITHOUT_RESPONSE=true if needed.
    writeWithoutResponse: getBooleanEnv(
      import.meta.env.VITE_PATELA_PAYMENT_WRITE_WITHOUT_RESPONSE,
      false,
    ),
  };
};

const getTransactionDateBcd = (): number[] => {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return numberToBcdBytes(`${year}${month}${day}`);
};

const getTransactionTimeBcd = (): number[] => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return numberToBcdBytes(`${hours}${minutes}${seconds}`);
};

const buildTriggerPaymentPayload = (
  request: PatelaPaymentRequest,
): DataView => {
  const amountBytes = amountToAuthorisedAmountBcd(request.amount);

  const includeDateTime = getBooleanEnv(
    import.meta.env.VITE_PATELA_PAYMENT_INCLUDE_DATE_TIME,
    false,
  );

  const include6AWrapper = getBooleanEnv(
    import.meta.env.VITE_PATELA_PAYMENT_INCLUDE_6A_WRAPPER,
    true,
  );

  /**
   * Dspread/QPOS-style trigger payment attempt.
   *
   * 21      command code
   * 16 30   command ID
   * 9C      transaction type
   * 9F02    authorised amount
   * 5F2A    currency code, ZAR = 0710
   *
   * South Africa:
   * 9F1A = 0710
   * 5F2A = 0710
   *
   * NOTE:
   * This is based on the docs discovered, but if the device still stays quiet,
   * the vendor SDK/proprietary framing is still required.
   */
  const body: number[] = [
    0x21,
    0x16,
    0x30,

    // 9C transaction type: 01 purchase/goods
    0x9c,
    0x01,
    0x01,

    // 9F02 authorised amount, 6 bytes BCD
    0x9f,
    0x02,
    0x06,
    ...amountBytes,

    // 5F2A transaction currency code: South African Rand = 0710
    0x5f,
    0x2a,
    0x02,
    0x07,
    0x10,
  ];

  if (includeDateTime) {
    body.push(
      // 9A transaction date YYMMDD
      0x9a,
      0x03,
      ...getTransactionDateBcd(),

      // 9F21 transaction time HHMMSS
      0x9f,
      0x21,
      0x03,
      ...getTransactionTimeBcd(),
    );
  }

  const bodyLength = body.length;

  const payload = include6AWrapper
    ? [
        0x6a,
        (bodyLength >> 8) & 0xff,
        bodyLength & 0xff,
        ...body,
      ]
    : [
        (bodyLength >> 8) & 0xff,
        bodyLength & 0xff,
        ...body,
      ];

  console.log("PATELA 6A TRIGGER PAYMENT PAYLOAD:", {
    amount: request.amount,
    amountInCents: amountToCents(request.amount),
    amountBytes: bytesToHex(amountBytes),
    include6AWrapper,
    includeDateTime,
    bodyLength,
    hex: bytesToHex(payload),
  });

  return bytesToDataView(payload);
};

export const scanForPatelaDevices = async (
  scanDurationMs = 8000,
): Promise<PatelaBluetoothDevice[]> => {
  const devices = new Map<string, PatelaBluetoothDevice>();

  await initializeBle();
  await stopScanSafely();

  return new Promise<PatelaBluetoothDevice[]>((resolve, reject) => {
    let settled = false;

    const finish = async () => {
      if (settled) {
        return;
      }

      settled = true;

      try {
        await stopScanSafely();
      } catch {
        // Ignore stop scan errors.
      }

      const foundDevices = Array.from(devices.values());

      console.log("PATELA BLE SCAN FINISHED:", foundDevices);

      resolve(foundDevices);
    };

    const timer = window.setTimeout(() => {
      void finish();
    }, scanDurationMs);

    isScanning = true;

    BleClient.requestLEScan(
      {
        allowDuplicates: false,
      },
      (result) => {
        if (!isPatelaDevice(result)) {
          return;
        }

        const device = toPatelaDevice(result);

        console.log("PATELA BLE DEVICE FOUND:", {
          deviceId: device.deviceId,
          name: device.name,
          model: device.model,
          rssi: device.rssi,
        });

        devices.set(device.deviceId, device);
      },
    ).catch((error) => {
      window.clearTimeout(timer);
      settled = true;
      isScanning = false;

      console.error("PATELA BLE SCAN FAILED:", error);

      reject(new Error(getErrorMessage(error)));
    });
  });
};

export const connectPatelaDevice = async (deviceId: string): Promise<void> => {
  if (connectPromise) {
    console.log("PATELA BLE CONNECT ALREADY IN PROGRESS");
    return connectPromise;
  }

  connectPromise = (async () => {
    await initializeBle();
    await stopScanSafely();

    await delay(1000);

    console.log("PATELA BLE CONNECTING:", deviceId);

    try {
      await BleClient.connect(
        deviceId,
        (disconnectedDeviceId) => {
          console.warn("PATELA BLE DISCONNECTED:", disconnectedDeviceId);
        },
        {
          timeout: CONNECT_TIMEOUT_MS,

          // Keep this false for payment because we need services/characteristics.
          skipDescriptorDiscovery: false,
        },
      );

      console.log("PATELA BLE CONNECTED:", deviceId);
    } catch (error) {
      console.error("PATELA BLE CONNECT FAILED:", error);
      throw new Error(getErrorMessage(error));
    }
  })();

  try {
    await connectPromise;
  } finally {
    connectPromise = null;
  }
};

export const readPatelaBatteryLevel = async (
  deviceId: string,
): Promise<number | null> => {
  try {
    const batteryValue = await BleClient.read(
      deviceId,
      "0000180f-0000-1000-8000-00805f9b34fb",
      "00002a19-0000-1000-8000-00805f9b34fb",
    );

    const dataView = new DataView(batteryValue.buffer);
    const batteryLevel = dataView.getUint8(0);

    console.log("PATELA BLE BATTERY LEVEL:", batteryLevel);

    return batteryLevel;
  } catch (error) {
    console.warn("PATELA BLE BATTERY READ FAILED:", error);
    return null;
  }
};

export const discoverPatelaPaymentTransport = async (
  deviceId: string,
): Promise<PatelaPaymentTransport> => {
  const envTransport = getEnvPaymentTransport();

  if (envTransport) {
    console.log("PATELA PAYMENT USING ENV UUIDS:", envTransport);
    return envTransport;
  }

  await connectPatelaDevice(deviceId);

  console.log("PATELA PAYMENT UUIDS NOT FOUND IN ENV. DISCOVERING SERVICES...");

  const services = await BleClient.getServices(deviceId);

  let writeCandidate: PatelaPaymentTransport | null = null;
  let notifyCandidate:
    | {
        serviceUuid: string;
        notifyCharacteristicUuid: string;
      }
    | null = null;

  for (const service of services) {
    for (const characteristic of service.characteristics) {
      const properties = characteristic.properties;

      console.log("PATELA BLE CHARACTERISTIC:", {
        serviceUuid: service.uuid,
        characteristicUuid: characteristic.uuid,
        properties,
      });

      if (!notifyCandidate && (properties.notify || properties.indicate)) {
        notifyCandidate = {
          serviceUuid: service.uuid,
          notifyCharacteristicUuid: characteristic.uuid,
        };
      }

      if (
        !writeCandidate &&
        (properties.write || properties.writeWithoutResponse)
      ) {
        writeCandidate = {
          serviceUuid: service.uuid,
          writeCharacteristicUuid: characteristic.uuid,

          // Confirmed write by default. Use env if you need without response.
          writeWithoutResponse: false,
        };
      }
    }
  }

  if (!writeCandidate) {
    throw new Error("No writable BLE characteristic found on the Patela device.");
  }

  const sameServiceNotify = services
    .find((service) => service.uuid === writeCandidate?.serviceUuid)
    ?.characteristics.find(
      (characteristic) =>
        characteristic.properties.notify || characteristic.properties.indicate,
    );

  if (sameServiceNotify) {
    writeCandidate.notifyCharacteristicUuid = sameServiceNotify.uuid;
  } else if (notifyCandidate) {
    writeCandidate.notifyCharacteristicUuid =
      notifyCandidate.notifyCharacteristicUuid;
  }

  console.log("PATELA BLE SELECTED PAYMENT TRANSPORT:", writeCandidate);

  return writeCandidate;
};

const startPaymentNotifications = async (
  deviceId: string,
  transport: PatelaPaymentTransport,
): Promise<PatelaPaymentResult> => {
  if (!transport.notifyCharacteristicUuid) {
    return {
      status: "sent",
      message:
        "Payment request was sent to the device. No notify characteristic was configured.",
    };
  }

  return new Promise<PatelaPaymentResult>((resolve) => {
    let settled = false;

    const finish = (result: PatelaPaymentResult) => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(result);
    };

    const timeout = window.setTimeout(() => {
      finish({
        status: "pending",
        message:
          "Payment was sent to the device, but no approved/declined response was received yet.",
      });
    }, PAYMENT_RESPONSE_TIMEOUT_MS);

    BleClient.startNotifications(
      deviceId,
      transport.serviceUuid,
      transport.notifyCharacteristicUuid,
      (value) => {
        const responseText = dataViewToText(value);
        const responseHex = dataViewToHex(value);
        const upperResponse = responseText.toUpperCase();

        console.log("PATELA PAYMENT RESPONSE RECEIVED:", {
          raw: value,
          text: responseText,
          hex: responseHex,
        });

        window.clearTimeout(timeout);

        if (
          upperResponse.includes("APPROVED") ||
          upperResponse.includes("SUCCESS")
        ) {
          finish({
            status: "approved",
            message: "Payment approved.",
            rawResponse: responseText || responseHex,
          });
          return;
        }

        if (
          upperResponse.includes("DECLINED") ||
          upperResponse.includes("FAILED")
        ) {
          finish({
            status: "declined",
            message: "Payment declined.",
            rawResponse: responseText || responseHex,
          });
          return;
        }

        finish({
          status: "unknown",
          message: "Payment response received from device.",
          rawResponse: responseText || responseHex,
        });
      },
    ).catch((error) => {
      window.clearTimeout(timeout);

      finish({
        status: "sent",
        message: `Payment was sent, but notifications could not be started: ${getErrorMessage(
          error,
        )}`,
      });
    });
  });
};

const writePaymentPayload = async (
  deviceId: string,
  transport: PatelaPaymentTransport,
  payload: DataView,
): Promise<void> => {
  const chunks = dataViewToChunks(payload);

  console.log("PATELA PAYMENT WRITING CHUNKS:", {
    chunkCount: chunks.length,
    serviceUuid: transport.serviceUuid,
    writeCharacteristicUuid: transport.writeCharacteristicUuid,
    writeWithoutResponse: transport.writeWithoutResponse,
    payloadHex: dataViewToHex(payload),
  });

  for (const chunk of chunks) {
    console.log("PATELA PAYMENT WRITING CHUNK:", dataViewToHex(chunk));

    if (transport.writeWithoutResponse) {
      await BleClient.writeWithoutResponse(
        deviceId,
        transport.serviceUuid,
        transport.writeCharacteristicUuid,
        chunk,
      );
    } else {
      await BleClient.write(
        deviceId,
        transport.serviceUuid,
        transport.writeCharacteristicUuid,
        chunk,
      );
    }

    await delay(80);
  }
};

export const sendPatelaPaymentRequest = async (
  deviceId: string,
  request: PatelaPaymentRequest,
): Promise<PatelaPaymentResult> => {
  await connectPatelaDevice(deviceId);

  const transport = await discoverPatelaPaymentTransport(deviceId);

  const paymentPayload = buildTriggerPaymentPayload(request);

  const responsePromise = startPaymentNotifications(deviceId, transport);

  console.log("PATELA PAYMENT SENDING TO DEVICE:", {
    deviceId,
    serviceUuid: transport.serviceUuid,
    writeCharacteristicUuid: transport.writeCharacteristicUuid,
    notifyCharacteristicUuid: transport.notifyCharacteristicUuid,
    amount: request.amount,
    currency: request.currency || "ZAR",
    reference: request.reference,
  });

  await writePaymentPayload(deviceId, transport, paymentPayload);

  console.log("PATELA PAYMENT WRITE COMPLETE");

  return responsePromise;
};

export const startPatelaPayment = async (
  request: PatelaPaymentRequest,
): Promise<PatelaPaymentResult> => {
  const pairedDevice = getPairedPatelaDevice();

  if (!pairedDevice) {
    throw new Error("No Patela device is paired. Please pair a device first.");
  }

  return sendPatelaPaymentRequest(pairedDevice.deviceId, request);
};

export const disconnectPatelaDevice = async (
  deviceId: string,
): Promise<void> => {
  try {
    await BleClient.disconnect(deviceId);
    console.log("PATELA BLE DISCONNECTED MANUALLY:", deviceId);
  } catch {
    // Ignore disconnect errors so the UI can recover gracefully.
  }

  await delay(1200);
};

export const savePairedPatelaDevice = (
  device: PatelaBluetoothDevice,
): void => {
  localStorage.setItem("patela-paired-device", JSON.stringify(device));
};

export const getPairedPatelaDevice = (): PatelaBluetoothDevice | null => {
  try {
    const stored = localStorage.getItem("patela-paired-device");
    return stored ? (JSON.parse(stored) as PatelaBluetoothDevice) : null;
  } catch {
    return null;
  }
};

export const clearPairedPatelaDevice = (): void => {
  localStorage.removeItem("patela-paired-device");
};