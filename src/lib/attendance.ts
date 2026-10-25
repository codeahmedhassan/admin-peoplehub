// ============================================================
// ATTENDANCE — types, status meta, formatters, and API types
// ============================================================

export type AttendanceStatus =
    | "Present"
    | "Late"
    | "Remote"
    | "Half Day"
    | "On Leave"
    | "Absent"
    | "Holiday"
    | "Weekend"
    | "Unmarked";

export interface AttendanceRecord {
    /** Mongo _id, or `null` for a "today-unmarked" row with no record yet. */
    id: string | null;

    /** Human-readable employee ID (EMP-00125). */
    employeeId: string;

    /** Mongo _id of the employee — useful if you need to link deeper. */
    employeeObjectId: string;

    employeeName: string;
    avatar?: string;
    department: string;
    branch: string;

    date: string; // YYYY-MM-DD
    clockIn?: string;  // "09:02" (derived from checkIn ISO)
    clockOut?: string; // "18:14" (derived from checkOut ISO)
    hoursWorked?: number;

    status: AttendanceStatus;
    source?: "manual" | "device" | "auto" | "import" | null;
    note?: string;

    /** If device marked present earlier and admin overrode to absent. */
    deviceMarkedPresent?: boolean;
    deviceMarkedAt?: string | null;

    /** Who last touched this row manually. */
    markedBy?: { id: string; fullName: string } | null;
}

/**
 * The statuses the admin can choose when marking manually.
 * Weekend and Holiday are set by rollup, not manually.
 */
export const MANUAL_ATTENDANCE_STATUSES = [
    "Present",
    "Late",
    "Remote",
    "Half Day",
    "On Leave",
    "Absent",
] as const;

export type ManualAttendanceStatus = (typeof MANUAL_ATTENDANCE_STATUSES)[number];

/** All statuses, in display order. */
export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
    "Present",
    "Late",
    "Remote",
    "Half Day",
    "On Leave",
    "Absent",
    "Holiday",
    "Weekend",
    "Unmarked",
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
    Holiday: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
    Weekend: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
    Unmarked: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-300" },
};

// ---------- Date / time helpers ----------
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

/**
 * Convert an ISO datetime (UTC) to "HH:MM" in the browser's local timezone.
 */
export function isoToLocalHHMM(iso?: string | null): string | undefined {
    if (!iso) return undefined;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return undefined;
    const h = d.getHours();
    const m = d.getMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ---------- Aggregates (unchanged shape — feeding the summary cards) ----------
export interface AttendanceSummary {
    total: number;
    present: number;
    late: number;
    absent: number;
    onLeave: number;
    remote: number;
    halfDay: number;
    holiday: number;
    weekend: number;
    unmarked: number;
    attendanceRate: number;
    avgHours: number;
}

export function summarize(records: AttendanceRecord[]): AttendanceSummary {
    const total = records.length;
    const counts: Record<string, number> = {};
    for (const r of records) counts[r.status] = (counts[r.status] ?? 0) + 1;

    const present = counts.Present ?? 0;
    const late = counts.Late ?? 0;
    const absent = counts.Absent ?? 0;
    const onLeave = counts["On Leave"] ?? 0;
    const remote = counts.Remote ?? 0;
    const halfDay = counts["Half Day"] ?? 0;
    const holiday = counts.Holiday ?? 0;
    const weekend = counts.Weekend ?? 0;
    const unmarked = counts.Unmarked ?? 0;

    // Attendance rate = attended / countable. Weekend + Holiday + Unmarked
    // are excluded from the denominator — they aren't "missed" days.
    const countable = total - holiday - weekend - unmarked;
    const attended = present + late + remote + halfDay * 0.5;
    const attendanceRate = countable > 0 ? (attended / countable) * 100 : 0;

    const hours = records.map((r) => r.hoursWorked ?? 0).filter((h) => h > 0);
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
        holiday,
        weekend,
        unmarked,
        attendanceRate: Number(attendanceRate.toFixed(1)),
        avgHours: Number(avgHours.toFixed(1)),
    };
}