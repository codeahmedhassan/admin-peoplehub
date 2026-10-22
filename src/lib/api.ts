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
            body: formData, // browser sets the multipart boundary
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