"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    MANUAL_ATTENDANCE_STATUSES,
    STATUS_META,
    formatTime,
    type AttendanceRecord,
    type AttendanceStatus,
} from "@/lib/attendance";
import { getInitials } from "@/lib/employee-detail";

interface Props {
    records: AttendanceRecord[];
    marking: boolean;
    edits: Record<string, Partial<AttendanceRecord>>;
    savedIds: Set<string>;
    rowKey: (r: AttendanceRecord) => string;
    onUpdateRow: (key: string, patch: Partial<AttendanceRecord>) => void;
    onSaveRow: (r: AttendanceRecord) => void;
    view: "today" | "week";
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/* ---------- Weekly aggregate shape ---------- */
interface WeekRow {
    employeeId: string;
    employeeName: string;
    avatar?: string;
    department: string;
    days: AttendanceRecord[];     // 7 records sorted by date
    presentDays: number;          // Present + Remote + HalfDay*0.5 + Late
    absentDays: number;
    leaveDays: number;
    totalHours: number;
    avgHours: number;
    baseRecord: AttendanceRecord; // for keying + actions
}

export default function AttendanceTable({
    records,
    marking,
    edits,
    savedIds,
    rowKey,
    onUpdateRow,
    onSaveRow,
    view,
}: Props) {
    const router = useRouter();

    const [pageSize, setPageSize] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    // ============================================================
    // Build display rows
    // ============================================================
    const isWeekSummary = view === "week" && !marking;

    const displayRows: (AttendanceRecord | WeekRow)[] = useMemo(() => {
        if (!isWeekSummary) return records;

        // Group by employeeId
        const grouped = new Map<string, AttendanceRecord[]>();
        for (const r of records) {
            const list = grouped.get(r.employeeId) ?? [];
            list.push(r);
            grouped.set(r.employeeId, list);
        }

        return Array.from(grouped.entries()).map(([empId, days]) => {
            days.sort((a, b) => a.date.localeCompare(b.date));
            const presentDays = days.reduce((sum, d) => {
                if (d.status === "Present" || d.status === "Late" || d.status === "Remote") return sum + 1;
                if (d.status === "Half Day") return sum + 0.5;
                return sum;
            }, 0);
            const absentDays = days.filter((d) => d.status === "Absent").length;
            const leaveDays = days.filter((d) => d.status === "On Leave").length;
            const totalHours = days.reduce((sum, d) => sum + (d.hoursWorked ?? 0), 0);
            const workedDays = days.filter((d) => (d.hoursWorked ?? 0) > 0).length;
            const avgHours = workedDays > 0 ? totalHours / workedDays : 0;

            const first = days[0];
            return {
                employeeId: empId,
                employeeName: first.employeeName,
                avatar: first.avatar,
                department: first.department,
                days,
                presentDays,
                absentDays,
                leaveDays,
                totalHours,
                avgHours,
                baseRecord: first,
            } as WeekRow;
        });
    }, [records, isWeekSummary]);

    // ============================================================
    // Pagination
    // ============================================================
    const totalPages = Math.max(1, Math.ceil(displayRows.length / pageSize));
    const safePage = Math.min(page, totalPages);

    const paginated = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return displayRows.slice(start, start + pageSize);
    }, [displayRows, safePage, pageSize]);

    const start = displayRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, displayRows.length);

    const pageNumbers: (number | "…")[] = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const list: (number | "…")[] = [1];
        if (safePage > 3) list.push("…");
        for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) list.push(i);
        if (safePage < totalPages - 2) list.push("…");
        list.push(totalPages);
        return list;
    }, [safePage, totalPages]);

    // ============================================================
    // Empty state
    // ============================================================
    if (displayRows.length === 0) {
        return (
            <div className="bg-white rounded-[28px] p-12 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">No records found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting the date or filters above.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[28px] p-2 mb-10 border border-slate-200/60 shadow-card-sm overflow-hidden">
            <div className="overflow-x-auto">
                {isWeekSummary ? (
                    /* ===================================================
                       7-DAY SUMMARY TABLE
                       =================================================== */
                    <table className="w-full text-left border-collapse min-w-[820px]">
                        <thead>
                            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="py-3 pl-4">Employee</th>
                                <th className="py-3 pr-3">Week at a glance</th>
                                <th className="py-3 pr-3 text-right">Present</th>
                                <th className="py-3 pr-3 text-right">Absent / Leave</th>
                                <th className="py-3 pr-3 text-right">Avg Hours</th>
                                <th className="py-3 pr-4 text-right">Profile</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {paginated.map((row) => {
                                const wr = row as WeekRow;
                                const allPresent = wr.presentDays >= wr.days.length;
                                return (
                                    <tr
                                        key={wr.employeeId}
                                        onClick={() => router.push(`/employees/${wr.employeeId}`)}
                                        className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                                    >
                                        {/* Employee */}
                                        <td className="py-3 pl-4">
                                            <div className="flex items-center gap-3 min-w-[180px]">
                                                {wr.avatar ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={wr.avatar}
                                                        alt={wr.employeeName}
                                                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {getInitials(wr.employeeName)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-semibold text-slate-800 truncate">
                                                        {wr.employeeName}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400 truncate">
                                                        {wr.employeeId} · {wr.department || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 7-day strip */}
                                        <td className="py-3 pr-3">
                                            <div className="flex items-center gap-1.5">
                                                {wr.days.map((day) => {
                                                    const meta = STATUS_META[day.status] ?? STATUS_META.Unmarked;
                                                    return (
                                                        <div
                                                            key={day.date}
                                                            title={`${new Date(day.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}\nStatus: ${day.status}${day.clockIn ? `\nIn: ${day.clockIn}` : ""}${day.clockOut ? `\nOut: ${day.clockOut}` : ""}`}
                                                            className={[
                                                                "flex flex-col items-center justify-center rounded-xl w-12 h-14 border border-slate-100 shrink-0 transition-all hover:scale-105 hover:shadow-sm",
                                                                meta.bg,
                                                            ].join(" ")}
                                                        >
                                                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                                                {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                                                            </span>
                                                            <span className={`w-2 h-2 rounded-full mt-1 ${meta.dot}`} />
                                                            <span className="text-[9px] font-semibold text-slate-600 tabular-nums mt-0.5">
                                                                {new Date(day.date + "T00:00:00").getDate()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>

                                        {/* Present count */}
                                        <td className="py-3 pr-3 text-right">
                                            <span
                                                className={[
                                                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tabular-nums",
                                                    allPresent
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-slate-100 text-slate-700",
                                                ].join(" ")}
                                            >
                                                {wr.presentDays}
                                                <span className="opacity-60">/ {wr.days.length}</span>
                                            </span>
                                        </td>

                                        {/* Absent / leave */}
                                        <td className="py-3 pr-3 text-right">
                                            {wr.absentDays + wr.leaveDays === 0 ? (
                                                <span className="text-[11px] font-semibold text-slate-400">—</span>
                                            ) : (
                                                <div className="flex items-center justify-end gap-1">
                                                    {wr.absentDays > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                                                            {wr.absentDays} A
                                                        </span>
                                                    )}
                                                    {wr.leaveDays > 0 && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
                                                            {wr.leaveDays} L
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>

                                        {/* Avg hours */}
                                        <td className="py-3 pr-3 text-right font-semibold text-slate-800 tabular-nums">
                                            {wr.avgHours > 0 ? `${wr.avgHours.toFixed(1)} h` : "—"}
                                        </td>

                                        {/* Profile */}
                                        <td
                                            className="py-3 pr-4 text-right"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Link
                                                href={`/employees/${wr.employeeId}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-slate-600 hover:bg-primary-50 hover:text-primary transition-colors"
                                            >
                                                View
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    /* ===================================================
                       TODAY / MARKING — FLAT EDITABLE TABLE
                       =================================================== */
                    <table className="w-full text-left border-collapse min-w-[980px]">
                        <thead>
                            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="py-3 pl-4">Employee</th>
                                <th className="py-3 pr-3">Date</th>
                                <th className="py-3 pr-3">Clock in</th>
                                <th className="py-3 pr-3">Clock out</th>
                                <th className="py-3 pr-3 text-right">Hours</th>
                                <th className="py-3 pr-3">Status</th>
                                <th className="py-3 pr-4 text-right">
                                    {marking ? "Action" : "Profile"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {paginated.map((r) => {
                                const rec = r as AttendanceRecord;
                                const key = rowKey(rec);
                                const meta = STATUS_META[rec.status] ?? STATUS_META.Unmarked;
                                const edited = edits[key] && Object.keys(edits[key]).length > 0;
                                const saved = savedIds.has(key);

                                return (
                                    <tr
                                        key={key}
                                        onClick={!marking ? () => router.push(`/employees/${rec.employeeId}`) : undefined}
                                        className={[
                                            "transition-colors",
                                            !marking ? "hover:bg-slate-50/60 cursor-pointer" : "",
                                            edited ? "bg-amber-50/40" : "",
                                        ].join(" ")}
                                    >
                                        <td className="py-3 pl-4">
                                            <div className="flex items-center gap-3 min-w-[180px]">
                                                {rec.avatar ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={rec.avatar}
                                                        alt={rec.employeeName}
                                                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {getInitials(rec.employeeName)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-slate-800 truncate">
                                                            {rec.employeeName}
                                                        </span>
                                                        {saved && (
                                                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                                                                SAVED
                                                            </span>
                                                        )}
                                                        {edited && !saved && (
                                                            <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                                                                EDITED
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-slate-400 truncate">
                                                        {rec.employeeId} · {rec.department || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="py-3 pr-3 text-slate-600 font-medium tabular-nums">
                                            {new Date(rec.date + "T00:00:00").toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </td>

                                        <td className="py-3 pr-3">
                                            {marking ? (
                                                <input
                                                    type="time"
                                                    value={rec.clockIn ?? ""}
                                                    onChange={(e) => onUpdateRow(key, { clockIn: e.target.value || undefined })}
                                                    className="w-[110px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                />
                                            ) : (
                                                <span className="text-slate-600 font-medium tabular-nums">
                                                    {formatTime(rec.clockIn)}
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3 pr-3">
                                            {marking ? (
                                                <input
                                                    type="time"
                                                    value={rec.clockOut ?? ""}
                                                    onChange={(e) => onUpdateRow(key, { clockOut: e.target.value || undefined })}
                                                    className="w-[110px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                />
                                            ) : (
                                                <span className="text-slate-600 font-medium tabular-nums">
                                                    {formatTime(rec.clockOut)}
                                                </span>
                                            )}
                                        </td>

                                        <td className="py-3 pr-3 text-right font-semibold text-slate-800 tabular-nums">
                                            {rec.hoursWorked !== undefined
                                                ? `${rec.hoursWorked.toFixed(1)} h`
                                                : computeHours(rec.clockIn, rec.clockOut)}
                                        </td>

                                        <td className="py-3 pr-3">
                                            {marking ? (
                                                <div className="relative">
                                                    <select
                                                        value={MANUAL_ATTENDANCE_STATUSES.includes(rec.status as any) ? rec.status : "Present"}
                                                        onChange={(e) => onUpdateRow(key, { status: e.target.value as AttendanceStatus })}
                                                        className="appearance-none bg-slate-50 border border-slate-200 pl-2.5 pr-7 py-1.5 rounded-lg text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                                                    >
                                                        {MANUAL_ATTENDANCE_STATUSES.map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                    <svg className="w-2.5 h-2.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <span className={["inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold", meta.bg, meta.text].join(" ")}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                    {rec.status}
                                                </span>
                                            )}
                                        </td>

                                        <td
                                            className="py-3 pr-4 text-right"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {marking ? (
                                                <button
                                                    onClick={() => onSaveRow(rec)}
                                                    disabled={!edited}
                                                    className={[
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors",
                                                        edited
                                                            ? "bg-[#1457DC] text-white hover:bg-primary-700 shadow-sm shadow-blue-500/20"
                                                            : "bg-slate-100 text-slate-400 cursor-not-allowed",
                                                    ].join(" ")}
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    Save
                                                </button>
                                            ) : (
                                                <Link
                                                    href={`/employees/${rec.employeeId}`}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-slate-600 hover:bg-primary-50 hover:text-primary transition-colors"
                                                >
                                                    View
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination bar (unchanged) */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-3 py-3 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium">Rows per page</span>
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="appearance-none bg-white border border-slate-200 pl-3.5 pr-8 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <svg className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                    </div>
                    <span className="font-medium tabular-nums">
                        {start}–{end} of {displayRows.length}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage(Math.max(1, safePage - 1))}
                        disabled={safePage === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {pageNumbers.map((p, i) =>
                        p === "…" ? (
                            <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">…</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={[
                                    "min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-colors",
                                    p === safePage
                                        ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30"
                                        : "text-slate-600 hover:bg-slate-100",
                                ].join(" ")}
                            >
                                {p}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                        disabled={safePage === totalPages}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

function computeHours(inT?: string, outT?: string): string {
    if (!inT || !outT) return "—";
    const [ih, im] = inT.split(":").map(Number);
    const [oh, om] = outT.split(":").map(Number);
    if ([ih, im, oh, om].some((n) => isNaN(n))) return "—";
    const hours = oh + om / 60 - (ih + im / 60);
    return hours > 0 ? `${hours.toFixed(1)} h` : "—";
}