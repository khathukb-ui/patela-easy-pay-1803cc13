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

let isInitialized = false;
let isScanning = false;

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
  if (!isScanning) {
    return;
  }

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

  if (!envPrefixes) {
    return DEFAULT_PATELA_PREFIXES.map((prefix) => prefix.toUpperCase());
  }

  return envPrefixes
    .split(",")
    .map((prefix) => prefix.trim().toUpperCase())
    .filter(Boolean);
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
    battery: 0,
    signal: getSignalStrength(result.rssi),
    rssi: result.rssi,
  };
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

      reject(error);
    });
  });
};

export const connectPatelaDevice = async (deviceId: string): Promise<void> => {
  await BleClient.initialize();

  try {
    await BleClient.stopLEScan();
  } catch {
    // Ignore if scan is already stopped.
  }

  console.log("PATELA BLE CONNECTING:", deviceId);

  await BleClient.connect(
    deviceId,
    (disconnectedDeviceId) => {
      console.warn("PATELA BLE DISCONNECTED:", disconnectedDeviceId);
    },
    {
      timeout: 45000,
      skipDescriptorDiscovery: true,
    },
  );

  console.log("PATELA BLE CONNECTED:", deviceId);

  const battery = await readPatelaBatteryLevel(deviceId);

  console.log("PATELA BATTERY AFTER CONNECT:", battery);
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

export const disconnectPatelaDevice = async (
  deviceId: string,
): Promise<void> => {
  try {
    await BleClient.disconnect(deviceId);
    console.log("PATELA BLE DISCONNECTED MANUALLY:", deviceId);
  } catch {
    // Ignore disconnect errors so the UI can recover gracefully.
  }
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