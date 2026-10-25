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
    options: ApiFetchOptions = {},
    isRetry = false // Internal flag to prevent infinite loops
): Promise<T> {
    const { body, headers, ...rest } = options;

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        credentials: "include",
        cache: "no-store",
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

    // ---------------------------------------------------------
    // SILENT TOKEN REFRESH
    // If we get a 401 and haven't already tried to refresh, try 
    // hitting /auth/refresh and then retry the original request.
    // ---------------------------------------------------------
    if (res.status === 401 && !isRetry && path !== "/auth/refresh") {
        try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: "POST",
                credentials: "include",
                cache: "no-store",
            });

            if (refreshRes.ok) {
                // The refresh worked, cookies are updated. Retry the original request.
                return apiFetch<T>(path, options, true);
            }
        } catch {
            // Refresh failed (network error, etc). Fall through to throw the 401.
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
        // Even if the API call fails, still send the user to signin
    }
    window.location.href = SIGNIN_URL;
}

// -------------------------------------------------------------------
// Employee API — multipart upload. Do NOT send JSON content-type.
// -------------------------------------------------------------------
export const employeeApi = {
    create: async (
        data: unknown,
        files: File[],
        fileMeta: { fileId: string; type: string; label: string }[]
    ) => {
        // Defensive normalization — never send "undefined" or "null" strings.
        const safeFiles = Array.isArray(files) ? files : [];
        const safeMeta = Array.isArray(fileMeta) ? fileMeta : [];

        // Guarantee alignment between files and metadata.
        if (safeMeta.length !== safeFiles.length) {
            throw new ApiError(
                400,
                `Internal error: ${safeFiles.length} file(s) but ${safeMeta.length} metadata entries.`
            );
        }

        const formData = new FormData();
        formData.append("data", JSON.stringify(data ?? {}));
        formData.append("fileMeta", JSON.stringify(safeMeta));
        for (const f of safeFiles) {
            formData.append("files", f);
        }

        const res = await fetch(`${API_BASE_URL}/employees`, {
            method: "POST",
            credentials: "include",
            cache: "no-store",
            body: formData,
        });

        let body: any = null;
        const text = await res.text();
        if (text) {
            try {
                body = JSON.parse(text);
            } catch {
                body = { message: text };
            }
        }
        if (!res.ok) {
            throw new ApiError(
                res.status,
                body?.message || `Request failed (${res.status})`
            );
        }
        return (body?.data ?? body) as { employee: { id: string; employeeId: string } };
    },

    list: () =>
        apiFetch<{ employees: import("./employee-mapper").ApiEmployee[] }>(
            "/employees",
            { method: "GET" }
        ),

    get: (idOrEmployeeId: string) =>
        apiFetch<{ employee: import("./employee-mapper").ApiEmployee }>(
            `/employees/${encodeURIComponent(idOrEmployeeId)}`,
            { method: "GET" }
        ),

    update: (
        idOrEmployeeId: string,
        patch: Record<string, unknown>
    ) =>
        apiFetch<{
            employee: import("./employee-mapper").ApiEmployee;
            removedDocumentCount: number;
        }>(`/employees/${encodeURIComponent(idOrEmployeeId)}`, {
            method: "PATCH",
            body: patch,
        }),

    remove: (idOrEmployeeId: string) =>
        apiFetch<null>(`/employees/${encodeURIComponent(idOrEmployeeId)}`, {
            method: "DELETE",
        }),

    /**
     * Upload new documents to an existing employee.
     * Returns the updated employee record (with the new documents appended).
     */
    addDocuments: async (
        idOrEmployeeId: string,
        files: File[],
        fileMeta: { fileId: string; type: string; label: string }[]
    ) => {
        if (files.length === 0) {
            throw new ApiError(400, "No files selected");
        }
        if (files.length !== fileMeta.length) {
            throw new ApiError(
                400,
                `Internal error: ${files.length} file(s) but ${fileMeta.length} metadata entries.`
            );
        }

        const formData = new FormData();
        // parseMultipartBody middleware expects `data` (may be {} for this route)
        // and `fileMeta` (array). We send both.
        formData.append("data", JSON.stringify({}));
        formData.append("fileMeta", JSON.stringify(fileMeta));
        for (const f of files) {
            formData.append("files", f);
        }

        const res = await fetch(
            `${API_BASE_URL}/employees/${encodeURIComponent(idOrEmployeeId)}/documents`,
            {
                method: "POST",
                credentials: "include",
                cache: "no-store",
                body: formData,
            }
        );

        let body: any = null;
        const text = await res.text();
        if (text) {
            try {
                body = JSON.parse(text);
            } catch {
                body = { message: text };
            }
        }

        if (!res.ok) {
            throw new ApiError(
                res.status,
                body?.message || `Request failed (${res.status})`
            );
        }

        return (body?.data ?? body) as {
            employee: import("./employee-mapper").ApiEmployee;
            addedCount: number;
        };
    },
};

// -------------------------------------------------------------------
// Attendance API
// -------------------------------------------------------------------

export type ApiAttendanceRow = {
    id: string | null;
    employeeId: string;
    employeeObjectId?: string;
    employeeName: string;
    employeeAvatar?: string;
    department?: string;
    designation?: string;
    branch?: string;
    date: string;
    status:
    | "present"
    | "late"
    | "remote"
    | "half-day"
    | "on-leave"
    | "absent"
    | "holiday"
    | "weekend"
    | "unmarked";
    source?: "manual" | "device" | "auto" | "import" | null;
    checkIn?: string | null;
    checkOut?: string | null;
    deviceMarkedPresent?: boolean;
    deviceMarkedAt?: string | null;
    markedBy?: { id: string; fullName: string } | null;
    note?: string;
};

export type ApiAttendanceSummary = {
    range: { from: string; to: string };
    counts: {
        total: number;
        present: number;
        absent: number;
        late: number;
        halfDay: number;
        onLeave: number;
        holiday: number;
        weekend: number;
        unmarked: number;
    };
    series: Array<{
        date: string;
        present: number;
        absent: number;
        late: number;
        halfDay: number;
    }>;
    breakdown: Array<{ status: string; count: number; percent: number }>;
};

export type ApiTodayResponse = {
    date: string;
    employees: ApiAttendanceRow[];
};

export const attendanceApi = {
    today: () =>
        apiFetch<ApiTodayResponse>("/attendance/today", { method: "GET" }),

    summary: (from: string, to: string) =>
        apiFetch<ApiAttendanceSummary>(
            `/attendance/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            { method: "GET" }
        ),

    list: (params: {
        from?: string;
        to?: string;
        status?: string;
        department?: string;
        employeeId?: string;
        q?: string;
        page?: number;
        limit?: number;
    }) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== "") qs.set(k, String(v));
        });
        return apiFetch<{
            records: ApiAttendanceRow[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        }>(`/attendance?${qs.toString()}`, { method: "GET" });
    },

    mark: (records: Array<{
        employeeId: string;
        date: string;
        status: "present" | "late" | "half-day" | "on-leave" | "absent";
        checkIn?: string;
        checkOut?: string;
        note?: string;
    }>) =>
        apiFetch<{
            results: Array<{ employeeId: string; date: string; id: string }>;
            errors: Array<{ employeeId: string; date: string; message: string }>;
        }>("/attendance/mark", {
            method: "POST",
            body: { records },
        }),

    rollup: () =>
        apiFetch<{ skipped: boolean; created?: number; dates?: string[] }>(
            "/attendance/rollup",
            { method: "POST" }
        ),

    /** URL for the browser to hit directly — triggers download. */
    exportUrl: (params: {
        from: string;
        to: string;
        format: "csv" | "xlsx";
        status?: string;
        department?: string;
        q?: string;
    }) => {
        const qs = new URLSearchParams({
            from: params.from,
            to: params.to,
            format: params.format,
        });
        if (params.status) qs.set("status", params.status);
        if (params.department) qs.set("department", params.department);
        if (params.q) qs.set("q", params.q);
        return `${API_BASE_URL}/attendance/export?${qs.toString()}`;
    },
};

// -------------------------------------------------------------------
// Devices API
// -------------------------------------------------------------------
export const deviceApi = {
    list: () => apiFetch<{ devices: any[] }>("/attendance/devices"),

    create: (name: string, location: string) =>
        apiFetch<{ device: { id: string, apiKey: string } }>("/attendance/devices", {
            method: "POST",
            body: { name, location }
        }),

    revoke: (id: string) =>
        apiFetch<null>(`/attendance/devices/${id}`, { method: "DELETE" }),

    getLinks: (deviceId: string) =>
        apiFetch<{ employees: any[] }>(`/attendance/devices/${deviceId}/links`),

    saveLink: (deviceId: string, employeeMongoId: string, deviceUserId: string) =>
        apiFetch<null>(`/attendance/devices/${deviceId}/links`, {
            method: "POST",
            body: { employeeMongoId, deviceUserId }
        }),
};