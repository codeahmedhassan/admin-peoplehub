import { type EmployeeDetail } from "@/lib/employee-detail";
import {
    DEPARTMENTS,
    EMPLOYMENT_TYPES,
    EMPLOYMENT_STATUSES,
    WORK_ARRANGEMENTS,
    WORK_LOCATIONS,
    EMPLOYEE_CATEGORIES,
    PAY_FREQUENCIES,
    CURRENCIES,
    PAYROLL_GROUPS,
    MANAGERS,
    SYSTEM_ROLES,
} from "@/lib/employee-form";

function formatBytes(bytes: number): string {
    if (!Number.isFinite(bytes) || bytes <= 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface EditableDocument {
    /** Temp id used only for React keys and internal diffing. */
    id: string;

    /**
     * Real backend fileId. Present for existing docs, absent for new uploads
     * that haven't been sent yet.
     */
    fileId?: string;

    label: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;

    /** The File object, only present for newly added docs (not yet uploaded). */
    pendingFile?: File;

    isNew?: boolean;
    isRemoved?: boolean;
}

// ---------- Editable subset of the detail record ----------
export interface EditableEmployee {
    // Identity
    firstName: string;
    lastName: string;
    preferredName: string;
    phone: string;
    gender: string;
    personalEmail: string;
    dateOfBirth: string;

    // Address
    address: string;
    city: string;
    country: string;

    // Emergency contact
    emergencyName: string;
    emergencyRelation: string;
    emergencyPhone: string;

    // Employment
    employmentStatus: string;
    employmentType: string;
    designation: string;
    department: string;
    reportingManager: string;
    joiningDate: string;
    workLocation: string;
    workArrangement: string;
    probationEndDate: string;
    contractEndDate: string;
    employeeCategory: string;

    // Compensation
    basicSalary: string;
    grossSalary: string;
    netSalary: string;
    currency: string;
    payFrequency: string;
    bankName: string;
    bankAccountName: string;
    bankAccountNumber: string;
    taxIdentifier: string;
    payrollGroup: string;

    // Access
    systemRole: string;

    documents: EditableDocument[];
}

// ---------- Convert detail → editable form ----------
export function toEditable(emp: EmployeeDetail): EditableEmployee {
    const [firstName = "", ...rest] = emp.name.split(" ");
    const lastName = rest.join(" ");
    return {
        firstName,
        lastName,
        preferredName: emp.preferredName ?? "",
        phone: emp.phone ?? "",
        gender: emp.gender ?? "",
        personalEmail: emp.personalEmail ?? "",
        dateOfBirth: emp.dateOfBirth ?? "",

        address: emp.address ?? "",
        city: emp.city ?? "",
        country: emp.country ?? "",

        emergencyName: emp.emergencyName ?? "",
        emergencyRelation: emp.emergencyRelation ?? "",
        emergencyPhone: emp.emergencyPhone ?? "",

        employmentStatus: emp.status ?? "Active",
        employmentType: emp.employmentType ?? "Full Time",
        designation: emp.designation ?? "",
        department: emp.department ?? "",
        reportingManager: emp.reportingManager ?? "",
        joiningDate: emp.joiningDate ?? "",
        workLocation: emp.workLocation ?? "",
        workArrangement: emp.workArrangement ?? "",
        probationEndDate: emp.probationEndDate ?? "",
        contractEndDate: emp.contractEndDate ?? "",
        employeeCategory: "",

        basicSalary: String(emp.basicSalary ?? ""),
        grossSalary: String(emp.grossSalary ?? ""),
        netSalary: String(emp.netSalary ?? ""),
        currency: emp.currency ?? "USD",
        payFrequency: emp.payFrequency ?? "Monthly",
        bankName: emp.bankName ?? "",
        bankAccountName: emp.bankAccountName ?? "",
        bankAccountNumber: emp.bankAccountNumber ?? "",
        taxIdentifier: emp.taxIdentifier ?? "",
        payrollGroup: emp.payrollGroup ?? "Default",

        systemRole: emp.systemRole ?? "Employee",

        documents: (emp.documents ?? []).map((d) => ({
            id: d.fileId,          // stable per API fileId
            fileId: d.fileId,
            label: d.label,
            fileName: d.fileName,
            fileSize: formatBytes(d.fileSize),
            uploadedAt: d.uploadedAt
                ? d.uploadedAt.slice(0, 10)
                : new Date().toISOString().slice(0, 10),
        })),
    };
}

// ---------- Diff two editable objects ----------
export function diffEditable(a: EditableEmployee, b: EditableEmployee): Partial<EditableEmployee> {
    const diff: Partial<EditableEmployee> = {};
    (Object.keys(a) as (keyof EditableEmployee)[]).forEach((key) => {
        if (key === "documents") {
            // Only diff if the document list actually changed
            const aDocs = a.documents ?? [];
            const bDocs = b.documents ?? [];
            const changed =
                aDocs.length !== bDocs.length ||
                aDocs.some((d, i) => {
                    const other = bDocs[i];
                    return (
                        !other ||
                        d.id !== other.id ||
                        d.label !== other.label ||
                        d.fileName !== other.fileName ||
                        d.isRemoved !== other.isRemoved
                    );
                });
            if (changed) diff.documents = bDocs;
            return;
        }
        if (a[key] !== b[key]) diff[key] = b[key];
    });
    return diff;
}

// ---------- Validation ----------
export interface EditFieldErrors {
    [field: string]: string;
}

export function validateEdit(form: EditableEmployee): EditFieldErrors {
    const errors: EditFieldErrors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^[\d\s+\-()]{6,}$/.test(form.phone)) errors.phone = "Enter a valid phone number";
    if (!form.gender) errors.gender = "Gender is required";
    if (!form.department) errors.department = "Department is required";
    if (!form.basicSalary.trim()) errors.basicSalary = "Basic salary is required";
    else if (isNaN(Number(form.basicSalary)) || Number(form.basicSalary) < 0)
        errors.basicSalary = "Enter a valid amount";
    if (form.personalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.personalEmail))
        errors.personalEmail = "Enter a valid email";
    return errors;
}

export const EDIT_OPTIONS = {
    employmentTypes: EMPLOYMENT_TYPES,
    employmentStatuses: EMPLOYMENT_STATUSES,
    workArrangements: WORK_ARRANGEMENTS,
    workLocations: WORK_LOCATIONS,
    categories: EMPLOYEE_CATEGORIES,
    payFrequencies: PAY_FREQUENCIES,
    currencies: CURRENCIES,
    payrollGroups: PAYROLL_GROUPS,
    managers: MANAGERS,
    systemRoles: SYSTEM_ROLES,
    departments: DEPARTMENTS,
    genders: ["Male", "Female", "Other"],
};