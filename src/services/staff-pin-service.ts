const STAFF_PIN_API_BASE_URL = (
    import.meta.env.VITE_IMS_API_URL ||
    import.meta.env.VITE_NEXT_PUBLIC_API_URL ||
    "http://54.159.110.255:4000"
).replace(/\/$/, "");

const STAFF_PIN_API_KEY =
    import.meta.env.VITE_IMS_API_KEY ||
    import.meta.env.VITE_POS_API_KEY ||
    import.meta.env.VITE_IMS_BEARER_TOKEN;

const STAFF_PIN_STORE_ID =
    import.meta.env.VITE_PATELA_STORE_ID ||
    import.meta.env.VITE_IMS_STORE_ID ||
    import.meta.env.VITE_POS_STORE_ID ||
    "cmipt3ia50000l99u9c0jd0ro";

export interface StaffUser {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    storeId?: string;
}

export interface StaffPinVerifyResult {
    verified: boolean;
    user: StaffUser | null;
    message: string;
    raw?: unknown;
}

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

const getErrorMessage = (payload: unknown, fallback: string) => {
    if (typeof payload === "object" && payload !== null) {
        return (payload as any)?.message || (payload as any)?.error || fallback;
    }

    if (typeof payload === "string" && payload.trim()) {
        return payload;
    }

    return fallback;
};

export const getStaffPinStoreId = () => STAFF_PIN_STORE_ID || "";

export const verifyStaffPin = async (pin: string): Promise<StaffPinVerifyResult> => {
    const cleanPin = pin.replace(/\D/g, "");

    if (!cleanPin) {
        return {
            verified: false,
            user: null,
            message: "Please enter your staff PIN.",
        };
    }

    if (!STAFF_PIN_API_KEY) {
        return {
            verified: false,
            user: null,
            message: "Staff PIN API key is missing. Please set VITE_IMS_BEARER_TOKEN or VITE_IMS_API_KEY.",
        };
    }

    if (!STAFF_PIN_STORE_ID) {
        return {
            verified: false,
            user: null,
            message: "Store ID is missing. Please set VITE_PATELA_STORE_ID.",
        };
    }

    try {
        const response = await fetch(`${STAFF_PIN_API_BASE_URL}/api/pos/verify-pin`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "X-API-Key": STAFF_PIN_API_KEY,
            },
            body: JSON.stringify({
                pin: cleanPin,
                storeId: STAFF_PIN_STORE_ID,
            }),
        });

        const payload = await safeJson(response);

        if (!response.ok) {
            return {
                verified: false,
                user: null,
                message: getErrorMessage(payload, "Incorrect PIN. Please try again."),
                raw: payload,
            };
        }

        const verified = Boolean((payload as any)?.verified);
        const user = ((payload as any)?.user || null) as StaffUser | null;

        if (!verified || !user?.id) {
            return {
                verified: false,
                user: null,
                message: getErrorMessage(payload, "Incorrect PIN. Please try again."),
                raw: payload,
            };
        }

        return {
            verified: true,
            user,
            message: "Staff verified successfully.",
            raw: payload,
        };
    } catch (error) {
        return {
            verified: false,
            user: null,
            message:
                error instanceof TypeError
                    ? "Could not reach staff PIN verification. Please confirm the API URL is reachable from this device."
                    : error instanceof Error
                        ? error.message
                        : "Staff PIN verification failed.",
        };
    }
};
