const IMS_API_BASE_URL = (
  import.meta.env.VITE_IMS_API_URL ||
  import.meta.env.VITE_NEXT_PUBLIC_API_URL ||
  "http://107.21.32.197:3000"
).replace(/\/$/, "");

const IMS_AUTH_EMAIL = import.meta.env.VITE_IMS_LOGIN_EMAIL || "lesiba7@gmail.com";
const IMS_AUTH_PASSWORD = import.meta.env.VITE_IMS_LOGIN_PASSWORD || "password";

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

let imsAuthPromise: Promise<IMSAuthResult> | null = null;
let lastIMSAuthResult: IMSAuthResult | null = null;

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

const hasIMSSession = async (): Promise<boolean> => {
  try {
    const response = await fetch(`/ims-api/api/auth/session`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return false;

    const payload = await response.json().catch(() => null);
    return Boolean(payload?.user || payload?.expires);
  } catch {
    return false;
  }
};

const performIMSLogin = async (): Promise<IMSAuthResult> => {
  if (await hasIMSSession()) {
    return {
      status: "authenticated",
      success: true,
      message: "Already signed in to IMS.",
    };
  }

  try {
    const csrfResponse = await fetch(`/ims-api/api/auth/csrf`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const csrfPayload = await safeJson(csrfResponse);
    const csrfToken = typeof csrfPayload === "object" && csrfPayload !== null ? (csrfPayload as any).csrfToken : null;

    if (!csrfResponse.ok || !csrfToken) {
      return {
        status: csrfResponse.status === 401 || csrfResponse.status === 403 ? "unauthorized" : "error",
        success: false,
        message: "Could not get IMS CSRF token. IMS may be blocking cross-app authentication.",
        raw: csrfPayload,
      };
    }

    const loginResponse = await fetch(`/ims-api/api/auth/callback/credentials`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: IMS_AUTH_EMAIL,
        password: IMS_AUTH_PASSWORD,
        csrfToken,
        callbackUrl: `/ims-api/`,
        json: "true",
        redirect: "false",
      }),
    });

    const loginPayload = await safeJson(loginResponse);
    const errorFromUrl =
      typeof (loginPayload as any)?.url === "string"
        ? new URL((loginPayload as any).url, IMS_API_BASE_URL).searchParams.get("error")
        : null;

    if (!loginResponse.ok || errorFromUrl) {
      return {
        status: loginResponse.status === 401 || loginResponse.status === 403 ? "unauthorized" : "error",
        success: false,
        message: errorFromUrl ? `IMS login failed: ${errorFromUrl}` : "IMS login failed. Please confirm the IMS username/password.",
        raw: loginPayload,
      };
    }

    const sessionReady = await hasIMSSession();

    if (!sessionReady) {
      return {
        status: "unauthorized",
        success: false,
        message: "IMS login completed, but the browser did not keep the IMS session cookie. This is usually a CORS/cookie setting issue.",
        raw: loginPayload,
      };
    }

    return {
      status: "authenticated",
      success: true,
      message: "Signed in to IMS successfully.",
      raw: loginPayload,
    };
  } catch (error) {
    return {
      status: "error",
      success: false,
      message:
        error instanceof TypeError
          ? "Could not sign in to IMS from the browser. This is likely a CORS/network issue between Patela and IMS."
          : error instanceof Error
          ? error.message
          : "IMS login failed.",
    };
  }
};

export const loginToIMS = async (force = false): Promise<IMSAuthResult> => {
  if (!force && lastIMSAuthResult?.success) {
    return lastIMSAuthResult;
  }

  if (!force && imsAuthPromise) {
    return imsAuthPromise;
  }

  imsAuthPromise = performIMSLogin();
  lastIMSAuthResult = await imsAuthPromise;
  imsAuthPromise = null;

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

  const authResult = await loginToIMS();

  if (!authResult.success) {
    return {
      status: authResult.status === "unauthorized" ? "unauthorized" : "error",
      message: authResult.message,
      item: null,
      raw: authResult.raw,
    };
  }

  const url = `/ims-api/api/barcodes/items?search=${encodeURIComponent(cleanBarcode)}&limit=1`;

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const payload = await safeJson(response);

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;

      return {
        status: "unauthorized",
        message: "IMS blocked the lookup even after login. Please confirm CORS/cookie settings or login to IMS in this browser.",
        item: null,
        raw: payload,
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        message:
          typeof payload === "object" && payload !== null
            ? (payload as any)?.error || (payload as any)?.message || "IMS lookup failed. Please try again."
            : "IMS lookup failed. Please try again.",
        item: null,
        raw: payload,
      };
    }

    const item = extractFirstItem(payload);

    if (!item) {
      return {
        status: "not_found",
        message: "No IMS item found for this barcode.",
        item: null,
        raw: payload,
      };
    }

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
          ? "Could not reach IMS from the browser. This may be a network or CORS issue."
          : error instanceof Error
          ? error.message
          : "IMS lookup failed.",
      item: null,
    };
  }
};


const extractTaskList = (payload: any): IMSPickingTask[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.tasks)) return payload.tasks;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
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
  const url = `/ims-api/api/picking/tasks${query}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const payload = await safeJson(response);

    if (response.status === 401 || response.status === 403) {
      lastIMSAuthResult = null;

      return {
        success: false,
        message: "IMS blocked the picking tasks request. Please refresh IMS login and try again.",
        tasks: [],
        raw: payload,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message:
          typeof payload === "object" && payload !== null
            ? (payload as any)?.error || (payload as any)?.message || "Failed to fetch IMS picking tasks."
            : "Failed to fetch IMS picking tasks.",
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
          ? "Could not reach IMS picking tasks from the browser. This may be a network or CORS issue."
          : error instanceof Error
          ? error.message
          : "Failed to fetch IMS picking tasks.",
      tasks: [],
    };
  }
};

export const getIMSApiBaseUrl = () => IMS_API_BASE_URL;
export const getIMSLoginEmail = () => IMS_AUTH_EMAIL;
