/**
 * Patela API Client
 * Connects the React frontend to the FastAPI backend.
 * All mock/demo data is removed — real errors are shown when backend is unavailable.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface TokenPair {
  access_token: string;
  refresh_token: string;
}

function getTokens(): TokenPair | null {
  const access = localStorage.getItem("patela_access_token");
  const refresh = localStorage.getItem("patela_refresh_token");
  if (access && refresh) return { access_token: access, refresh_token: refresh };
  return null;
}

function setTokens(tokens: TokenPair) {
  localStorage.setItem("patela_access_token", tokens.access_token);
  localStorage.setItem("patela_refresh_token", tokens.refresh_token);
}

function clearTokens() {
  localStorage.removeItem("patela_access_token");
  localStorage.removeItem("patela_refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: tokens.refresh_token }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data: TokenPair = await res.json();
    setTokens(data);
    return data.access_token;
  } catch {
    clearTokens();
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (tokens) {
    headers["Authorization"] = `Bearer ${tokens.access_token}`;
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && tokens) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(res.status, error.detail || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

// ============================
// Auth API
// ============================

export interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: "admin" | "manager" | "cashier";
  is_active: boolean;
}

export const authApi = {
  register: async (data: { full_name: string; email?: string; phone?: string; password: string; role?: string }) => {
    const tokens = await apiFetch<TokenPair>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setTokens(tokens);
    return tokens;
  },

  login: async (identifier: string, password: string) => {
    const tokens = await apiFetch<TokenPair>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    setTokens(tokens);
    return tokens;
  },

  logout: () => {
    clearTokens();
  },

  me: () => apiFetch<UserProfile>("/api/auth/me"),

  isAuthenticated: () => !!getTokens(),
};

// ============================
// Catalog API (reads from IMS via backend)
// ============================

export interface CatalogItem {
  sku: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  in_stock: boolean;
  available_qty: number;
}

export interface StockAvailability {
  sku: string;
  available_qty: number;
  in_stock: boolean;
}

export const catalogApi = {
  getItems: () => apiFetch<CatalogItem[]>("/api/catalog/items"),
  getItem: (sku: string) => apiFetch<CatalogItem>(`/api/catalog/items/${sku}`),
  getAvailability: (sku: string) => apiFetch<StockAvailability>(`/api/catalog/items/${sku}/availability`),
};

// ============================
// Cart API
// ============================

export interface CartItemResponse {
  id: string;
  sku: string;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  qty: number;
  line_total: number;
}

export interface CartResponse {
  id: string;
  customer_id: string;
  status: string;
  items: CartItemResponse[];
  total: number;
}

export const cartApi = {
  create: (customer_id: string) =>
    apiFetch<CartResponse>("/api/cart", { method: "POST", body: JSON.stringify({ customer_id }) }),

  get: (cartId: string) => apiFetch<CartResponse>(`/api/cart/${cartId}`),

  addItem: (cartId: string, sku: string, qty: number = 1) =>
    apiFetch<CartItemResponse>(`/api/cart/${cartId}/items`, {
      method: "POST",
      body: JSON.stringify({ sku, qty }),
    }),

  updateItem: (cartId: string, itemId: string, qty: number) =>
    apiFetch<CartItemResponse>(`/api/cart/${cartId}/items/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ qty }),
    }),

  removeItem: (cartId: string, itemId: string) =>
    apiFetch<void>(`/api/cart/${cartId}/items/${itemId}`, { method: "DELETE" }),
};

// ============================
// Checkout API
// ============================

export interface OrderResponse {
  id: string;
  order_no: string;
  customer_id: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  ims_order_ref: string | null;
  created_at: string;
  items: {
    id: string;
    sku: string;
    item_name_snapshot: string;
    unit_price_snapshot: number;
    qty: number;
    line_total: number;
  }[];
}

export const checkoutApi = {
  checkout: (cart_id: string, delivery_fee: number = 0) =>
    apiFetch<OrderResponse>("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ cart_id, delivery_fee }),
    }),
};

// ============================
// Orders API
// ============================

export const ordersApi = {
  list: () => apiFetch<OrderResponse[]>("/api/orders"),
  get: (orderId: string) => apiFetch<OrderResponse>(`/api/orders/${orderId}`),
};

// ============================
// Payments API
// ============================

export interface PaymentResponse {
  id: string;
  order_id: string;
  provider: string;
  provider_ref: string | null;
  amount: number;
  status: string;
  initiated_at: string;
  completed_at: string | null;
}

export const paymentsApi = {
  initiate: (order_id: string, provider?: string) =>
    apiFetch<PaymentResponse>("/api/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ order_id, provider }),
    }),

  getByOrder: (orderId: string) => apiFetch<PaymentResponse>(`/api/payments/${orderId}`),
};

// ============================
// Admin API
// ============================

export const adminApi = {
  syncHealth: () => apiFetch<{ status: string; item_count?: number; error?: string }>("/api/admin/sync/health"),
  syncCatalog: () => apiFetch<{ status: string; items_synced: number }>("/api/admin/sync/catalog", { method: "POST" }),
};
