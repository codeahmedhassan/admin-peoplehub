// lib/api.ts (admin app)
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000/api/v1";

const SIGNIN_URL =
    process.env.NEXT_PUBLIC_MARKETING_URL + "/signin" || "http://localhost:3001/signin";

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
    body?: unknown;
};

export async function apiFetch<T = unknown>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<T> {
    const { body, headers, ...rest } = options;

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(headers || {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    let data: unknown = null;
    const text = await res.text();
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!res.ok) {
        throw new ApiError(
            res.status,
            (data as { message?: string })?.message ||
            `Request failed with status ${res.status}`
        );
    }

    return ((data as { data?: unknown })?.data ?? data) as T;
}

export async function logout() {
    try {
        await apiFetch("/auth/logout", { method: "POST" });
    } catch {
        // Even if the API call fails, still send the user to signin —
        // the backend clears cookies on its side; worst case they get a 401
        // on the next request and are bounced back here.
    }
    window.location.href = SIGNIN_URL;
}
