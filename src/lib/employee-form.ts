// ============================================================
// Add Employee — form schema, options, and persistence helpers
// ============================================================

export type EmploymentType =
    | "Full Time"
    | "Part Time"
    | "Internship"
    | "Temporary / Fixed Term"
    | "Seasonal"
    | "Contract / Freelance"
    | "Casual / On Call";

export type EmploymentStatus = "Active" | "Probation" | "On Leave" | "Inactive";
export type WorkArrangement = "On-site" | "Remote" | "Hybrid";
export type Gender = "Male" | "Female" | "Other" | "";
export type PayFrequency = "Monthly" | "Bi-Weekly" | "Weekly" | "Semi-Monthly";

export interface EmployeeDraft {
    // Step 1 — Basic
    firstName: string;
    lastName: string;
    employeeId: string;
    phone: string;
    preferredName: string;
    gender: Gender;
    avatar: string;
    manuallyPickedAvatar: boolean;

    // Step 2 — Employment
    employmentStatus: EmploymentStatus;
    employmentType: EmploymentType;
    designation: string;
    department: string;
    reportingManager: string;
    joiningDate: string;
    workLocation: string;
    workArrangement: WorkArrangement | "";
    probationEndDate: string;
    contractEndDate: string;
    employeeCategory: string;

    // Step 3 — Contact
    personalEmail: string;
    dateOfBirth: string;
    residentialAddress: string;
    city: string;
    country: string;
    emergencyName: string;
    emergencyRelation: string;
    emergencyPhone: string;

    // Step 4 — Work & Attendance
    workSchedule: string;
    weeklyWorkingDays: string;
    attendanceLocation: string;
    attendanceMethod: string;
    attendanceEligibility: "Eligible" | "Not Eligible";
    overtimeEligibility: boolean;
    timeZone: string;

    // Step 5 — Compensation
    salaryAmount: string;
    salaryCurrency: string;
    payFrequency: PayFrequency;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    taxIdentifier: string;
    payrollGroup: string;

    // Step 6 — Documents + Account
    nationalId: string;
    hasContract: boolean;
    hasCv: boolean;
    hasIdentityDoc: boolean;
    hasCertificates: boolean;
    hasOtherDocs: boolean;

    createLogin: boolean;
    loginEmail: string;
    systemRole: string;
    sendInvitation: boolean;
}

export const EMPLOYEE_DRAFT_STORAGE_KEY = "wn:employee-draft:v1";

export function createEmptyDraft(generatedId: string, today: string): EmployeeDraft {
    return {
        firstName: "",
        lastName: "",
        employeeId: generatedId,
        phone: "",
        preferredName: "",
        gender: "",
        avatar: "",
        manuallyPickedAvatar: false,

        employmentStatus: "Active",
        employmentType: "Full Time",
        designation: "",
        department: "",
        reportingManager: "",
        joiningDate: today,
        workLocation: "",
        workArrangement: "",
        probationEndDate: "",
        contractEndDate: "",
        employeeCategory: "",

        personalEmail: "",
        dateOfBirth: "",
        residentialAddress: "",
        city: "",
        country: "",
        emergencyName: "",
        emergencyRelation: "",
        emergencyPhone: "",

        workSchedule: "",
        weeklyWorkingDays: "Inherit from company defaults",
        attendanceLocation: "",
        attendanceMethod: "Inherit company default",
        attendanceEligibility: "Eligible",
        overtimeEligibility: false,
        timeZone: "Inherit company or location setting",

        salaryAmount: "",
        salaryCurrency: "USD",
        payFrequency: "Monthly",
        bankAccountName: "",
        bankAccountNumber: "",
        bankName: "",
        taxIdentifier: "",
        payrollGroup: "",

        nationalId: "",
        hasContract: false,
        hasCv: false,
        hasIdentityDoc: false,
        hasCertificates: false,
        hasOtherDocs: false,

        createLogin: false,
        loginEmail: "",
        systemRole: "Employee",
        sendInvitation: false,
    };
}

// ---------- ID Generation ----------
export function generateEmployeeId(prefix = "EMP", sequence = 125): string {
    return `${prefix}-${String(sequence).padStart(5, "0")}`;
}

// ---------- Options ----------
export const EMPLOYMENT_TYPES: EmploymentType[] = [
    "Full Time",
    "Part Time",
    "Internship",
    "Temporary / Fixed Term",
    "Seasonal",
    "Contract / Freelance",
    "Casual / On Call",
];

export const EMPLOYMENT_STATUSES: EmploymentStatus[] = [
    "Active",
    "Probation",
    "On Leave",
    "Inactive",
];

export const WORK_ARRANGEMENTS: WorkArrangement[] = ["On-site", "Remote", "Hybrid"];

export const PAY_FREQUENCIES: PayFrequency[] = [
    "Monthly",
    "Semi-Monthly",
    "Bi-Weekly",
    "Weekly",
];

export const CURRENCIES = ["USD", "EUR", "GBP", "PKR", "INR", "AED", "CAD", "AUD"];

export const SYSTEM_ROLES = ["Admin", "Manager", "HR", "Employee", "Viewer"];

export const DEPARTMENTS = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Support", "Operations"];

export const MANAGERS = [
    "Sarah Jenkins (HR Director)",
    "David Park (Engineering Manager)",
    "Lena Hoffmann (Design Lead)",
    "Marcus Reid (Sales Director)",
];

export const WORK_LOCATIONS = ["New York", "London", "Berlin", "Karachi", "Remote"];
export const EMPLOYEE_CATEGORIES = ["Permanent", "Contractor", "Consultant", "Intern", "Apprentice"];
export const PAYROLL_GROUPS = ["Default", "Executive", "Contractors", "Hourly"];

export const AVATARS: Record<"men" | "women", string[]> = {
    men: Array.from({ length: 12 }, (_, i) => `/avatars/men/m-${i + 1}.png`),
    women: Array.from({ length: 12 }, (_, i) => `/avatars/women/w-${i + 1}.png`),
};

export function pickRandomAvatar(gender: Gender): string {
    const pool =
        gender === "Female" ? AVATARS.women :
            gender === "Male" ? AVATARS.men :
                [...AVATARS.men, ...AVATARS.women];
    return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Validation ----------
export interface StepFieldErrors {
    [field: string]: string;
}

export function validateStep(step: number, d: EmployeeDraft): StepFieldErrors {
    const errors: StepFieldErrors = {};
    if (step === 1) {
        if (!d.firstName.trim()) errors.firstName = "First name is required";
        if (!d.lastName.trim()) errors.lastName = "Last name is required";
        if (!d.phone.trim()) errors.phone = "Phone number is required";
        else if (!/^[\d\s+\-()]{6,}$/.test(d.phone)) errors.phone = "Enter a valid phone number";
        if (!d.gender) errors.gender = "Please select a gender";
    }
    if (step === 2) {
        if (!d.department) errors.department = "Department is required";
        if (!d.employmentType) errors.employmentType = "Employment type is required";
    }
    if (step === 5) {
        if (!d.salaryAmount.trim()) errors.salaryAmount = "Salary amount is required";
        else if (isNaN(Number(d.salaryAmount)) || Number(d.salaryAmount) <= 0)
            errors.salaryAmount = "Enter a valid amount";
    }
    if (step === 6 && d.createLogin && d.sendInvitation) {
        if (!d.loginEmail.trim()) errors.loginEmail = "Email is required when inviting";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.loginEmail)) errors.loginEmail = "Enter a valid email";
    }
    return errors;
}