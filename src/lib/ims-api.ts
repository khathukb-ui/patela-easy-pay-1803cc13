const IMS_API_BASE_URL = (
  import.meta.env.VITE_IMS_API_URL ||
  import.meta.env.VITE_NEXT_PUBLIC_API_URL ||
  "http://107.21.32.197:3000"
).replace(/\/$/, "");

const IMS_BEARER_TOKEN =
  import.meta.env.VITE_IMS_BEARER_TOKEN || import.meta.env.VITE_IMS_API_KEY || import.meta.env.VITE_POS_API_KEY;

const IMS_STORE_ID =
  import.meta.env.VITE_PATELA_STORE_ID ||
  import.meta.env.VITE_IMS_STORE_ID ||
  import.meta.env.VITE_POS_STORE_ID ||
  "";

const IMS_AUTH_CHECK_PATH = import.meta.env.VITE_IMS_AUTH_CHECK_PATH || "/api/barcodes/items?page=1&limit=10";

export type IMSLookupStatus = "found" | "not_found" | "unauthorized" | "error";
export type IMSAuthStatus = "authenticated" | "unauthorized" | "error";

export interface IMSAuthResult {
  status: IMSAuthStatus;
  success: boolean;
  message: string;
  raw?: unknown;
}

export interface IMSProductSummary {
  id?: string;
  sku?: string;
  barcode?: string | null;
  name?: string;
  description?: string | null;
  unitPrice?: number;
  price?: number;
  sellingPrice?: number;
  imageUrl?: string | null;
  category?: {
    id?: string;
    name?: string;
  } | null;
  brand?: {
    id?: string;
    name?: string;
  } | null;
}

export interface IMSWarehouseSummary {
  id?: string;
  name?: string;
  code?: string;
  city?: string | null;
}

export interface IMSBoxSummary {
  id?: string;
  barcode?: string;
  status?: string;
}

export interface IMSBarcodeItem {
  id?: string;
  barcode: string;
  barcodeType?: string;
  barcodeImage?: string | null;
  sku?: string;
  color?: string;
  size?: string;
  status?: string;
  price?: number;
  unitPrice?: number;
  sellingPrice?: number;
  warehouseId?: string | null;
  boxId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  product?: IMSProductSummary | null;
  warehouse?: IMSWarehouseSummary | null;
  box?: IMSBoxSummary | null;
}

export interface IMSLookupResult {
  status: IMSLookupStatus;
  message: string;
  item: IMSBarcodeItem | null;
  raw?: unknown;
  error?: string;
}

export type IMSPickingTaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | string;

export interface IMSPickingTaskItem {
  id?: string;
  quantityRequired?: number;
  quantityPicked?: number;
  isPicked?: boolean;
  product?: IMSProductSummary | null;
  unitPrice?: number;
  lineTotal?: number;
}

export interface IMSPickingTask {
  id: string;
  status: IMSPickingTaskStatus;
  assignedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  zone?: string | null;
  aisle?: string | null;
  bin?: string | null;
  picker?: { id?: string; name?: string; email?: string } | null;
  fulfillment?: {
    id?: string;
    status?: string;
    salesOrder?: {
      id?: string;
      orderNumber?: string;
      priority?: string;
      source?: string;
      customer?: { name?: string; email?: string; phone?: string } | null;
    } | null;
    warehouse?: IMSWarehouseSummary | null;
  } | null;
  items?: IMSPickingTaskItem[];
}

export interface IMSPickingTasksResult {
  success: boolean;
  message: string;
  tasks: IMSPickingTask[];
  raw?: unknown;
}

export interface IMSBarcodeItemsPagination {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface IMSBarcodeItemsResult {
  success: boolean;
  message: string;
  items: IMSBarcodeItem[];
  pagination?: IMSBarcodeItemsPagination;
  raw?: unknown;
}

export type IMSPaymentMethod = "CARD" | "CASH" | "EFT" | "VOUCHER";

export interface IMSCheckoutItemInput {
  barcode: string;
  quantity: number;
}

export interface IMSCheckoutStartResult {
  success: boolean;
  message: string;
  transactionId?: string;
  expiresAt?: string;
  itemCount?: number;
  reservations?: Array<{
    reservationId?: string;
    productId?: string;
    productName?: string;
    sku?: string;
    quantity?: number;
    unitPrice?: number;
  }>;
  raw?: unknown;
}

export interface IMSCheckoutConfirmResult {
  success: boolean;
  message: string;
  transactionId?: string;
  orderId?: string;
  orderNumber?: string;
  total?: number;
  itemCount?: number;
  receipt?: {
    orderNumber?: string;
    date?: string;
    total?: string;
    paymentMethod?: string;
  };
  raw?: unknown;
}

export interface IMSCheckoutCancelResult {
  success: boolean;
  message: string;
  transactionId?: string;
  itemsReleased?: number;
  raw?: unknown;
}

let lastIMSAuthResult: IMSAuthResult | null = null;

const getIMSHeaders = (includeContentType = false): HeadersInit => ({
  "Accept": "application/json",
  ...(includeContentType ? { "Content-Type": "application/json" } : {}),
  "X-API-Key": `${IMS_BEARER_TOKEN}`
});

const safeJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    try {
      return await response.text();
    } catch {
      return null;
    }
  }
};

const extractFirstItem = (payload: any): IMSBarcodeItem | null => {
  if (!payload) return null;

  if (Array.isArray(payload)) return payload[0] ?? null;
  if (Array.isArray(payload.items)) return payload.items[0] ?? null;
  if (Array.isArray(payload.data)) return payload.data[0] ?? null;
  if (payload.item) return payload.item;

  if (payload.barcode || payload.sku || payload.product) return payload;

  return null;
};

const extractTaskList = (payload: any): IMSPickingTask[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.tasks)) return payload.tasks;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (typeof payload === "object" && payload !== null) {
    return (payload as any)?.error || (payload as any)?.message || fallback;
  }

  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  return fallback;
};

const performIMSLogin = async (): Promise<IMSAuthResult> => {
  if (!IMS_BEARER_TOKEN) {
    return {
      status: "unauthorized",
      success: false,
      message: "IMS bearer token is missing.",
    };
  }

  const url = `${IMS_API_BASE_URL}${IMS_AUTH_CHECK_PATH}`;

  try {
    console.log("[IMS] Authenticating with IMS using barcode items:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getIMSHeaders(),
    });

    const payload = await safeJson(response);

    console.log("[IMS] Barcode items authentication response:", {
      status: response.status,
      ok: response.ok,
      payload,
    });

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;

      return {
        status: "unauthorized",
        success: false,
        message: "IMS authentication failed. Please confirm the bearer token is valid.",
        raw: payload,
      };
    }

    if (!response.ok) {
      lastIMSAuthResult = null;

      return {
        status: "error",
        success: false,
        message: getErrorMessage(payload, "IMS authentication failed."),
        raw: payload,
      };
    }

    return {
      status: "authenticated",
      success: true,
      message: "IMS authentication successful using barcode items.",
      raw: payload,
    };
  } catch (error) {
    console.error("[IMS] Authentication failed:", error);
    lastIMSAuthResult = null;

    return {
      status: "error",
      success: false,
      message:
        error instanceof TypeError
          ? "Could not authenticate with IMS. Please confirm the API URL is reachable from this device."
          : error instanceof Error
          ? error.message
          : "IMS authentication failed.",
    };
  }
};

export const loginToIMS = async (force = false): Promise<IMSAuthResult> => {
  if (!force && lastIMSAuthResult?.success) {
    return lastIMSAuthResult;
  }

  lastIMSAuthResult = await performIMSLogin();

  return lastIMSAuthResult;
};

export const lookupIMSBarcodeItem = async (barcode: string): Promise<IMSLookupResult> => {
  const cleanBarcode = barcode.trim();

  if (!cleanBarcode) {
    return {
      status: "error",
      message: "Please scan or enter a barcode first.",
      item: null,
    };
  }

  if (!IMS_STORE_ID) {
    return {
      status: "error",
      message: "IMS store ID is missing. Please set VITE_IMS_STORE_ID.",
      item: null,
    };
  }

  const authResult = await loginToIMS();

  if (!authResult.success) {
    return {
      status: authResult.status === "unauthorized" ? "unauthorized" : "error",
      message: authResult.message,
      item: null,
      raw: authResult.raw,
    };
  }

  const params = new URLSearchParams({
    barcode: cleanBarcode,
    storeId: IMS_STORE_ID,
  });

  const url = `${IMS_API_BASE_URL}/api/pos/scan?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getIMSHeaders(),
    });

    const payload = await safeJson(response);

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;

      return {
        status: "unauthorized",
        message: "IMS blocked the scan. Please confirm the API key is valid.",
        item: null,
        raw: payload,
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message: getErrorMessage(payload, "IMS scan failed. Please try again."),
        item: null,
        raw: payload,
      };
    }

    const payloadAny = payload as any;

    if (payloadAny?.found === false || !payloadAny?.item) {
      return {
        status: "not_found",
        message: getErrorMessage(payload, "Barcode not found at this store."),
        item: null,
        raw: payload,
      };
    }

    if (payloadAny?.available === false || payloadAny?.alreadySold) {
      return {
        status: "error",
        message: getErrorMessage(payload, "This item is not available for sale."),
        item: null,
        raw: payload,
      };
    }

    const item = {
      ...payloadAny.item,
      product: payloadAny.product ?? payloadAny.item?.product ?? null,
      price: payloadAny.item?.price ?? payloadAny.product?.unitPrice,
      unitPrice: payloadAny.item?.unitPrice ?? payloadAny.product?.unitPrice,
      sellingPrice: payloadAny.item?.sellingPrice ?? payloadAny.product?.sellingPrice,
    } as IMSBarcodeItem;

    return {
      status: "found",
      message: "Item found in IMS.",
      item,
      raw: payload,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof TypeError
          ? "Could not reach IMS. Please confirm the API URL is reachable from this device."
          : error instanceof Error
          ? error.message
          : "IMS scan failed.",
      item: null,
    };
  }
};


export const fetchIMSBarcodeItems = async (
  page = 1,
  limit = 10,
  search?: string
): Promise<IMSBarcodeItemsResult> => {
  if (!IMS_BEARER_TOKEN) {
    return {
      success: false,
      message: "IMS bearer token is missing.",
      items: [],
    };
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const url = `${IMS_API_BASE_URL}/api/barcodes/items?${params.toString()}`;

  try {
    console.log("[IMS] Loading barcode items:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: getIMSHeaders(),
    });

    const payload = await safeJson(response);

    console.log("[IMS] Barcode items response:", {
      status: response.status,
      ok: response.ok,
      payload,
    });

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;

      return {
        success: false,
        message: "IMS blocked the barcode items request. Please confirm the bearer token is valid.",
        items: [],
        raw: payload,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: getErrorMessage(payload, "Failed to fetch IMS barcode items."),
        items: [],
        raw: payload,
      };
    }

    const items = Array.isArray((payload as any)?.items)
      ? (payload as any).items
      : Array.isArray((payload as any)?.data)
      ? (payload as any).data
      : Array.isArray(payload)
      ? payload
      : [];

    lastIMSAuthResult = {
      status: "authenticated",
      success: true,
      message: "IMS authentication successful using barcode items.",
      raw: payload,
    };

    return {
      success: true,
      message: items.length ? "IMS barcode items loaded." : "No IMS barcode items returned.",
      items,
      pagination: (payload as any)?.pagination,
      raw: payload,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof TypeError
          ? "Could not reach IMS barcode items. Please confirm the API URL is reachable from this device."
          : error instanceof Error
          ? error.message
          : "Failed to fetch IMS barcode items.",
      items: [],
    };
  }
};


const createPOSTransactionId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `patela-${crypto.randomUUID()}`;
  }

  return `patela-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getIMSApiBaseUrl = () => IMS_API_BASE_URL;
export const getIMSStoreId = () => IMS_STORE_ID;

export const startIMSCheckout = async ({
  staffId,
  items,
  timeoutMinutes = 15,
  storeId,
}: {
  staffId: string;
  items: IMSCheckoutItemInput[];
  timeoutMinutes?: number;
  storeId?: string;
}): Promise<IMSCheckoutStartResult> => {
  if (!IMS_BEARER_TOKEN) {
    return { success: false, message: "IMS API key is missing." };
  }

  const checkoutStoreId = storeId || IMS_STORE_ID;

  if (!checkoutStoreId) {
    return { success: false, message: "IMS store ID is missing. Please set VITE_PATELA_STORE_ID." };
  }

  if (!staffId) {
    return { success: false, message: "Staff verification is required before checkout." };
  }

  const cleanItems = items
    .map((item) => ({ barcode: item.barcode.trim(), quantity: item.quantity || 1 }))
    .filter((item) => item.barcode && item.quantity > 0);

  if (cleanItems.length === 0) {
    return { success: false, message: "Scan at least one item before checkout." };
  }

  const authResult = await loginToIMS();

  if (!authResult.success) {
    return { success: false, message: authResult.message, raw: authResult.raw };
  }

  const transactionId = createPOSTransactionId();

  try {
    const response = await fetch(`${IMS_API_BASE_URL}/api/pos/checkout/start`, {
      method: "POST",
      headers: getIMSHeaders(true),
      body: JSON.stringify({
        transactionId,
        storeId: checkoutStoreId,
        staffId,
        items: cleanItems,
        timeoutMinutes,
      }),
    });

    const payload = await safeJson(response);

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;
    }

    if (!response.ok || !(payload as any)?.locked) {
      return {
        success: false,
        message: getErrorMessage(payload, "Could not lock IMS stock for checkout."),
        transactionId,
        raw: payload,
      };
    }

    return {
      success: true,
      message: (payload as any)?.message || "Stock locked successfully.",
      transactionId: (payload as any)?.transactionId || transactionId,
      expiresAt: (payload as any)?.expiresAt,
      itemCount: (payload as any)?.itemCount,
      reservations: (payload as any)?.reservations,
      raw: payload,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof TypeError
          ? "Could not reach IMS checkout. Please confirm the API URL is reachable from this device."
          : error instanceof Error
          ? error.message
          : "Could not lock IMS stock for checkout.",
      transactionId,
    };
  }
};

export const confirmIMSCheckout = async ({
  transactionId,
  staffId,
  paymentMethod = "CARD",
  customerName = "Walk-in Customer",
  notes,
  storeId,
}: {
  transactionId: string;
  staffId: string;
  paymentMethod?: IMSPaymentMethod;
  customerName?: string;
  notes?: string;
  storeId?: string;
}): Promise<IMSCheckoutConfirmResult> => {
  if (!transactionId) {
    return { success: false, message: "Missing IMS transaction ID." };
  }

  if (!staffId) {
    return { success: false, message: "Staff verification is required before confirming checkout." };
  }

  const checkoutStoreId = storeId || IMS_STORE_ID;

  if (!checkoutStoreId) {
    return { success: false, message: "IMS store ID is missing. Please set VITE_PATELA_STORE_ID." };
  }

  try {
    const response = await fetch(`${IMS_API_BASE_URL}/api/pos/checkout/confirm`, {
      method: "POST",
      headers: getIMSHeaders(true),
      body: JSON.stringify({
        transactionId,
        storeId: checkoutStoreId,
        staffId,
        paymentMethod,
        customerName,
        discount: 0,
        tax: 0,
        notes,
      }),
    });

    const payload = await safeJson(response);

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;
    }

    if (!response.ok || !(payload as any)?.success) {
      return {
        success: false,
        message: getErrorMessage(payload, "Could not confirm IMS checkout."),
        transactionId,
        raw: payload,
      };
    }

    return {
      success: true,
      message: "IMS order completed successfully.",
      transactionId: (payload as any)?.transactionId || transactionId,
      orderId: (payload as any)?.orderId,
      orderNumber: (payload as any)?.orderNumber,
      total: (payload as any)?.total,
      itemCount: (payload as any)?.itemCount,
      receipt: (payload as any)?.receipt,
      raw: payload,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof TypeError
          ? "Could not reach IMS checkout confirmation. Please confirm the API URL is reachable from this device."
          : error instanceof Error
          ? error.message
          : "Could not confirm IMS checkout.",
      transactionId,
    };
  }
};

export const cancelIMSCheckout = async ({
  transactionId,
  reason,
}: {
  transactionId: string;
  reason: string;
}): Promise<IMSCheckoutCancelResult> => {
  if (!transactionId) {
    return { success: false, message: "Missing IMS transaction ID." };
  }

  try {
    const response = await fetch(`${IMS_API_BASE_URL}/api/pos/checkout/cancel`, {
      method: "POST",
      headers: getIMSHeaders(true),
      body: JSON.stringify({
        transactionId,
        storeId: IMS_STORE_ID,
        reason,
      }),
    });

    const payload = await safeJson(response);

    if (!response.ok) {
      return {
        success: false,
        message: getErrorMessage(payload, "Could not cancel IMS checkout."),
        transactionId,
        raw: payload,
      };
    }

    return {
      success: Boolean((payload as any)?.cancelled ?? true),
      message: (payload as any)?.message || "IMS checkout cancelled.",
      transactionId: (payload as any)?.transactionId || transactionId,
      itemsReleased: (payload as any)?.itemsReleased,
      raw: payload,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Could not cancel IMS checkout.",
      transactionId,
    };
  }
};


export const fetchIMSPickingTasks = async (status?: string): Promise<IMSPickingTasksResult> => {
  const authResult = await loginToIMS();

  if (!authResult.success) {
    return {
      success: false,
      message: authResult.message,
      tasks: [],
      raw: authResult.raw,
    };
  }

  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const url = `${IMS_API_BASE_URL}/api/picking/tasks${query}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getIMSHeaders(),
    });

    const payload = await safeJson(response);

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;

      return {
        success: false,
        message: "IMS blocked the picking tasks request. Please confirm the bearer token is valid.",
        tasks: [],
        raw: payload,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: getErrorMessage(payload, "Failed to fetch IMS picking tasks."),
        tasks: [],
        raw: payload,
      };
    }

    const tasks = extractTaskList(payload);

    return {
      success: true,
      message: tasks.length ? "IMS picking tasks loaded." : "No IMS picking tasks returned.",
      tasks,
      raw: payload,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof TypeError
          ? "Could not reach IMS picking tasks. Please confirm the API URL is reachable from this device."
          : error instanceof Error
          ? error.message
          : "Failed to fetch IMS picking tasks.",
      tasks: [],
    };
  }
};

export const getIMSLoginEmail = () => "Bearer token";
