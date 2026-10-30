// lib/employee-mapper.ts (admin)
import type { Employee } from "@/lib/constants";

/**
 * Shape returned by `GET /api/v1/employees`.
 * Mirrors what `Employee.toSafeJSON()` produces server-side (minus documents/bank/tax).
 */
export type ApiEmployee = {
    _id?: string;
    id: string;
    workspace: string;
    employeeId: string;

    firstName: string;
    lastName: string;
    preferredName: string;
    phone: string;
    gender: string;
    avatar: string;

    employmentStatus: string;
    employmentType: string;
    designation: string;
    department: string;
    reportingManager: string;
    joiningDate: string | null;
    workLocation: string;
    workArrangement: string;
    probationEndDate: string | null;
    contractEndDate: string | null;
    employeeCategory: string;

    personalEmail: string;
    dateOfBirth: string | null;
    residentialAddress: string;
    city: string;
    country: string;
    emergencyName: string;
    emergencyRelation: string;
    emergencyPhone: string;

    workSchedule: string;
    weeklyWorkingDays: string;
    attendanceLocation: string;
    attendanceMethod: string;
    attendanceEligibility: string;
    overtimeEligibility: boolean;
    timeZone: string;

    salaryAmount: number;
    payFrequency: string;
    payrollGroup: string;

    nationalId: string;

    createLogin: boolean;
    loginEmail: string;
    systemRole: string;
    sendInvitation: boolean;

    documentCount: number;
    createdAt: string;
    updatedAt: string;
};

/**
 * Map an API employee → the UI `Employee` shape used by the table,
 * stats, and filters.
 *
 * - `branch` is derived from `workLocation` (falls back to "—").
 * - `basicSalary` / `grossSalary` / `netSalary` all map to `salaryAmount`
 *   until payroll is built. That's the real number the user entered, not a fake.
 * - `incomplete` is a heuristic: a record is "incomplete" if any of the
 *   fields users typically fill in later are missing.
 * - `status` maps directly from `employmentStatus`.
 */
export function mapApiEmployeeToUi(e: ApiEmployee): Employee {
    const fullName = [e.firstName, e.lastName].filter(Boolean).join(" ").trim() || "Unnamed";
    const monthlySalary = Number(e.salaryAmount) || 0;

    return {
        // Mongo _id → UI `id` — used for key/selection/delete/URL.
        id: e.id,

        // Human-readable employee ID → shown in the table.
        employeeId: e.employeeId,

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
        incomplete: isIncomplete(e),
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

function isIncomplete(e: ApiEmployee): boolean {
    return (
        !e.department ||
        !e.designation ||
        !e.phone ||
        !e.joiningDate
    );
}