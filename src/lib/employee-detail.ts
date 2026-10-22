// lib/employee-detail.ts (admin)
//
// Detail-page types + mappers + formatting helpers.
//
// Important: there is no fake data here anymore. The detail page fetches
// from `GET /api/v1/employees/:id` and pipes the response through
// `mapApiEmployeeToDetail()` below.

import type { Employee } from "@/lib/constants";
import type { ApiEmployee } from "./employee-mapper";

// ---------------------------------------------------------------------------
// API shape additions
// ---------------------------------------------------------------------------
//
// `GET /employees/:id` returns the same fields as the list endpoint
// PLUS the full `documents` array (metadata only — no blobs, no encryption
// details) and, when the caller has elevated permissions, potentially the
// sensitive fields (bank account, tax id).
//
// We keep `bankAccountNumber` and `taxIdentifier` optional because the
// current backend intentionally omits them from `toSafeJSON()`.
// ---------------------------------------------------------------------------

export type ApiDocument = {
    fileId: string;
    type: string;
    label: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    uploadedAt?: string | null;
};

export type ApiEmployeeDetail = ApiEmployee & {
    documents?: ApiDocument[];
    // Present only if the backend later exposes them via an elevated endpoint.
    bankAccountNumber?: string;
    taxIdentifier?: string;
};

// ---------------------------------------------------------------------------
// UI detail type
// ---------------------------------------------------------------------------
//
// Extends the base `Employee` used by the list page. The detail page shows
// more fields, all optional so partial records still render.
// ---------------------------------------------------------------------------

export interface EmployeeDetail extends Employee {
    // Personal / contact
    preferredName?: string;
    phone?: string;
    gender?: string;
    personalEmail?: string;
    dateOfBirth?: string | null;
    city?: string;
    country?: string;
    address?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;

    // Employment
    employmentType?: string;
    reportingManager?: string;
    joiningDate?: string | null;
    workLocation?: string;
    workArrangement?: string;
    probationEndDate?: string | null;
    contractEndDate?: string | null;

    // Compensation & payroll
    currency?: string;
    payFrequency?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    taxIdentifier?: string;
    payrollGroup?: string;

    // Account
    hasLogin?: boolean;
    systemRole?: string;

    // Documents — flat shape, no encryption metadata exposed
    documents?: {
        fileId: string;
        type: string;
        label: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        uploadedAt?: string;
    }[];

    // Activity — placeholder until we wire real activity tracking
    activity?: {
        id: string;
        label: string;
        at: string;
        type: "created" | "updated" | "login" | "document";
    }[];
}

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

/**
 * Convert the API shape into the UI detail shape.
 * Pure function — no side effects, no fetching.
 */
export function mapApiEmployeeToDetail(e: ApiEmployeeDetail): EmployeeDetail {
    const fullName =
        [e.firstName, e.lastName].filter(Boolean).join(" ").trim() || "Unnamed";
    const monthlySalary = Number(e.salaryAmount) || 0;

    const fullAddress = [e.residentialAddress, e.city, e.country]
        .filter(Boolean)
        .join(", ");

    return {
        // ---- Base Employee fields (list-page shape) ----
        id: e.id, // Mongo _id
        employeeId: e.employeeId, // EMP-00125 — what we show
        name: fullName,
        email: e.loginEmail || e.personalEmail || "",
        avatar: e.avatar || "",
        branch: e.workLocation || "—",
        department: e.department || "",
        designation: e.designation || "",

        basicSalary: monthlySalary,
        grossSalary: monthlySalary,
        netSalary: monthlySalary,

        status: normalizeStatus(e.employmentStatus),
        incomplete:
            !e.department ||
            !e.designation ||
            !e.phone ||
            !e.joiningDate,

        // ---- Detail-only fields ----
        preferredName: e.preferredName || "",
        phone: e.phone || "",
        gender: e.gender || "",
        personalEmail: e.personalEmail || "",
        dateOfBirth: e.dateOfBirth ?? null,
        city: e.city || "",
        country: e.country || "",
        address: fullAddress,
        emergencyName: e.emergencyName || "",
        emergencyRelation: e.emergencyRelation || "",
        emergencyPhone: e.emergencyPhone || "",

        employmentType: e.employmentType || "",
        reportingManager: e.reportingManager || "",
        joiningDate: e.joiningDate ?? null,
        workLocation: e.workLocation || "",
        workArrangement: e.workArrangement || "",
        probationEndDate: e.probationEndDate ?? null,
        contractEndDate: e.contractEndDate ?? null,

        currency: e.salaryCurrency || "USD",
        payFrequency: e.payFrequency || "",
        bankName: e.bankName || "",
        bankAccountNumber: e.bankAccountNumber || "",
        bankAccountName: e.bankAccountName || "",
        taxIdentifier: e.taxIdentifier || "",
        payrollGroup: e.payrollGroup || "",

        hasLogin: Boolean(e.createLogin),
        systemRole: e.systemRole || "",

        documents: (e.documents ?? []).map((d) => ({
            fileId: d.fileId,
            type: d.type,
            label: d.label,
            fileName: d.fileName,
            fileSize: d.fileSize,
            mimeType: d.mimeType,
            uploadedAt: d.uploadedAt ?? undefined,
        })),

        activity: [], // wired later
    };
}

function normalizeStatus(s: string): Employee["status"] {
    switch (s) {
        case "Active":
        case "On Leave":
        case "Probation":
        case "Inactive":
            return s;
        default:
            return "Active";
    }
}

// ---------------------------------------------------------------------------
// Formatting helpers (unchanged API surface)
// ---------------------------------------------------------------------------

export function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function getTenure(joiningDate?: string | null): string {
    if (!joiningDate) return "—";
    const start = new Date(joiningDate);
    if (isNaN(start.getTime())) return "—";
    const now = new Date();
    let months =
        (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth());
    if (now.getDate() < start.getDate()) months -= 1;
    if (months < 1) return "Less than a month";
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem} month${rem > 1 ? "s" : ""}`;
    if (rem === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years}y ${rem}m`;
}

export function formatDate(iso?: string | null): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatMoney(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}