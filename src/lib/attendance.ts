// ============================================================
// ATTENDANCE — data, types, and helpers
// ============================================================

import { EMPLOYEES, type Employee } from "@/lib/constants";

export type AttendanceStatus =
    | "Present"
    | "Late"
    | "Absent"
    | "On Leave"
    | "Remote"
    | "Half Day";

export interface AttendanceRecord {
    id: string;                 // att-EMP-001-2024-03-12
    employeeId: string;
    employeeName: string;
    avatar?: string;
    department: string;
    branch: string;
    date: string;               // YYYY-MM-DD
    clockIn?: string;           // "09:02"
    clockOut?: string;          // "18:14"
    hoursWorked?: number;       // 8.2
    status: AttendanceStatus;
    note?: string;
}

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
    "Present",
    "Late",
    "Remote",
    "Half Day",
    "On Leave",
    "Absent",
];

export const STATUS_META: Record<
    AttendanceStatus,
    { bg: string; text: string; dot: string }
> = {
    Present: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
    Late: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    Remote: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    "Half Day": { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
    "On Leave": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    Absent: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
};

// ---------- Date helpers ----------
export function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export function formatDate(iso: string): string {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

export function formatTime(t?: string): string {
    if (!t) return "—";
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

// ---------- Deterministic pseudo-random generator ----------
// Same seed → same record every time, so the demo feels stable.
function seededRandom(seed: string): number {
    let hash = 2166136261;
    for (let i = 0; i < seed.length; i++) {
        hash ^= seed.charCodeAt(i);
        hash = (hash * 16777619) >>> 0;
    }
    return hash / 0xffffffff;
}

/**
 * Generate a deterministic attendance record for an employee on a given date.
 * Replace this with a real API call later — the UI consumes this shape 1:1.
 */
export function getAttendanceFor(
    employee: Employee,
    dateIso: string
): AttendanceRecord {
    const seed = `${employee.id}-${dateIso}`;
    const r = seededRandom(seed);
    const id = `att-${employee.id}-${dateIso}`;

    // 4% absent, 8% on leave, 6% half-day, 12% late, 20% remote, rest present
    let status: AttendanceStatus = "Present";
    if (r < 0.04) status = "Absent";
    else if (r < 0.12) status = "On Leave";
    else if (r < 0.18) status = "Half Day";
    else if (r < 0.30) status = "Late";
    else if (r < 0.50) status = "Remote";

    // Times
    const baseIn = status === "Late" ? 9.25 + r * 0.75 : 8.75 + r * 0.5;
    const hours =
        status === "Absent" || status === "On Leave"
            ? 0
            : status === "Half Day"
                ? 4 + r * 0.5
                : 7.5 + r * 1.2;
    const inH = Math.floor(baseIn);
    const inM = Math.round((baseIn - inH) * 60);
    const outDecimal = baseIn + hours;
    const outH = Math.floor(outDecimal);
    const outM = Math.round((outDecimal - outH) * 60);

    return {
        id,
        employeeId: employee.id,
        employeeName: employee.name,
        avatar: employee.avatar,
        department: employee.department,
        branch: employee.branch,
        date: dateIso,
        clockIn:
            status === "Absent" || status === "On Leave"
                ? undefined
                : `${String(inH).padStart(2, "0")}:${String(inM).padStart(2, "0")}`,
        clockOut:
            status === "Absent" || status === "On Leave"
                ? undefined
                : `${String(outH).padStart(2, "0")}:${String(outM).padStart(2, "0")}`,
        hoursWorked: hours > 0 ? Number(hours.toFixed(2)) : undefined,
        status,
    };
}

export function getAllAttendance(dateIso: string): AttendanceRecord[] {
    return EMPLOYEES.map((e) => getAttendanceFor(e, dateIso));
}

export function getWeeklyAttendance(endIso: string): AttendanceRecord[] {
    const out: AttendanceRecord[] = [];
    const end = new Date(endIso + "T00:00:00");
    for (let i = 6; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().slice(0, 10);
        out.push(...getAllAttendance(iso));
    }
    return out;
}

// ---------- Aggregates ----------
export interface AttendanceSummary {
    total: number;
    present: number;
    late: number;
    absent: number;
    onLeave: number;
    remote: number;
    halfDay: number;
    attendanceRate: number;    // 0–100
    avgHours: number;
}

export function summarize(records: AttendanceRecord[]): AttendanceSummary {
    const total = records.length;
    const counts = records.reduce(
        (acc, r) => {
            acc[r.status] = (acc[r.status] ?? 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );
    const present = counts.Present ?? 0;
    const late = counts.Late ?? 0;
    const absent = counts.Absent ?? 0;
    const onLeave = counts["On Leave"] ?? 0;
    const remote = counts.Remote ?? 0;
    const halfDay = counts["Half Day"] ?? 0;

    const attended = present + late + remote + halfDay * 0.5;
    const attendanceRate = total > 0 ? (attended / total) * 100 : 0;
    const hours = records
        .map((r) => r.hoursWorked ?? 0)
        .filter((h) => h > 0);
    const avgHours =
        hours.length > 0 ? hours.reduce((a, b) => a + b, 0) / hours.length : 0;

    return {
        total,
        present,
        late,
        absent,
        onLeave,
        remote,
        halfDay,
        attendanceRate: Number(attendanceRate.toFixed(1)),
        avgHours: Number(avgHours.toFixed(1)),
    };
}