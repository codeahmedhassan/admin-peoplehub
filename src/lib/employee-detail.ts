import { EMPLOYEES, type Employee } from "@/lib/constants";

export interface EmployeeDetail extends Employee {
    preferredName?: string;
    phone?: string;
    gender?: string;
    personalEmail?: string;
    dateOfBirth?: string;
    city?: string;
    country?: string;
    address?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    employmentType?: string;
    reportingManager?: string;
    joiningDate?: string;
    workLocation?: string;
    workArrangement?: "On-site" | "Remote" | "Hybrid";
    probationEndDate?: string;
    contractEndDate?: string;
    currency?: string;
    payFrequency?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    taxIdentifier?: string;
    payrollGroup?: string;
    hasLogin?: boolean;
    systemRole?: string;
    documents?: { id: string; label: string; uploadedAt?: string; size?: string }[];
    activity?: { id: string; label: string; at: string; type: "created" | "updated" | "login" | "document" }[];
}

/**
 * Fetch an employee by empId.
 * Looks up list data first, then overlays any extra fields
 * that the detail page needs (fallbacks below).
 */
export function getEmployeeById(id: string): EmployeeDetail | null {
    const base = EMPLOYEES.find((e) => e.id === id);
    if (!base) return null;

    // Fallback detail fields (replace with a real API call later)
    const extra: Partial<EmployeeDetail> = {
        preferredName: base.name.split(" ")[0],
        phone: "+1 555 0100",
        personalEmail: `${base.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        dateOfBirth: "1994-06-18",
        city: base.branch,
        country: base.branch === "New York" ? "USA" : base.branch === "London" ? "UK" : base.branch === "Berlin" ? "Germany" : "Pakistan",
        address: "123 Maple Street, Apt 4B",
        emergencyName: "Alex Carter",
        emergencyRelation: "Sibling",
        emergencyPhone: "+1 555 0199",
        employmentType: "Full Time",
        reportingManager: "Sarah Jenkins (HR Director)",
        joiningDate: "2022-03-14",
        workLocation: base.branch,
        workArrangement: base.branch === "Karachi" ? "On-site" : "Hybrid",
        probationEndDate: "",
        contractEndDate: "",
        currency: "USD",
        payFrequency: "Monthly",
        bankName: "Chase Bank",
        bankAccountName: base.name,
        bankAccountNumber: "•••• 4821",
        taxIdentifier: "TIN-4821-A",
        payrollGroup: "Default",
        hasLogin: true,
        systemRole: "Employee",
        documents: [
            { id: "d1", label: "Employment Contract", uploadedAt: "2022-03-14", size: "412 KB" },
            { id: "d2", label: "National ID", uploadedAt: "2022-03-14", size: "198 KB" },
        ],
        activity: [
            { id: "a1", label: "Employee record created", at: "2022-03-14", type: "created" },
            { id: "a2", label: "Salary updated", at: "2023-01-02", type: "updated" },
            { id: "a3", label: "Signed in from a new device", at: "2023-05-11", type: "login" },
        ],
    };

    return { ...base, ...extra };
}

export function getInitials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function getTenure(joiningDate?: string): string {
    if (!joiningDate) return "—";
    const start = new Date(joiningDate);
    const now = new Date();
    let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (now.getDate() < start.getDate()) months -= 1;
    if (months < 1) return "Less than a month";
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (years === 0) return `${rem} month${rem > 1 ? "s" : ""}`;
    if (rem === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years}y ${rem}m`;
}

export function formatDate(iso?: string): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatMoney(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(amount);
}