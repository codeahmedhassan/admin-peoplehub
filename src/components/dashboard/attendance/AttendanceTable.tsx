"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ATTENDANCE_STATUSES,
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
    onUpdateRow: (id: string, patch: Partial<AttendanceRecord>) => void;
    onSaveRow: (id: string) => void;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export default function AttendanceTable({
    records,
    marking,
    edits,
    savedIds,
    onUpdateRow,
    onSaveRow,
}: Props) {
    const router = useRouter();

    // ---------- Pagination ----------
    const [pageSize, setPageSize] = useState<number>(10);
    const [page, setPage] = useState<number>(1);

    const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
    const safePage = Math.min(page, totalPages);

    const paginated = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return records.slice(start, start + pageSize);
    }, [records, safePage, pageSize]);

    const start = records.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
    const end = Math.min(safePage * pageSize, records.length);

    // Build compact page list: 1 … 4 5 6 … 12
    const pageNumbers: (number | "…")[] = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const list: (number | "…")[] = [1];
        if (safePage > 3) list.push("…");
        for (
            let i = Math.max(2, safePage - 1);
            i <= Math.min(totalPages - 1, safePage + 1);
            i++
        ) {
            list.push(i);
        }
        if (safePage < totalPages - 2) list.push("…");
        list.push(totalPages);
        return list;
    }, [safePage, totalPages]);

    // ---------- Empty state ----------
    if (records.length === 0) {
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
                <table className="w-full text-left border-collapse min-w-245">
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
                            const meta = STATUS_META[r.status];
                            const edited = edits[r.id] && Object.keys(edits[r.id]).length > 0;
                            const saved = savedIds.has(r.id);

                            return (
                                <tr
                                    key={r.id}
                                    onClick={!marking ? () => router.push(`/employees/${r.employeeId}`) : undefined}
                                    className={[
                                        "transition-colors",
                                        marking ? "" : "hover:bg-slate-50/60 cursor-pointer",
                                        edited ? "bg-amber-50/40" : "",
                                    ].join(" ")}
                                >
                                    <td className="py-3 pl-4">
                                        <div className="flex items-center gap-3 min-w-45">
                                            {r.avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={r.avatar}
                                                    alt={r.employeeName}
                                                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {getInitials(r.employeeName)}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-slate-800 truncate">
                                                        {r.employeeName}
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
                                                    {r.employeeId} · {r.department || "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3 pr-3 text-slate-600 font-medium tabular-nums">
                                        {new Date(r.date + "T00:00:00").toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </td>

                                    <td className="py-3 pr-3">
                                        {marking ? (
                                            <input
                                                type="time"
                                                value={r.clockIn ?? ""}
                                                onChange={(e) => onUpdateRow(r.id, { clockIn: e.target.value || undefined })}
                                                className="w-27.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        ) : (
                                            <span className="text-slate-600 font-medium tabular-nums">
                                                {formatTime(r.clockIn)}
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3 pr-3">
                                        {marking ? (
                                            <input
                                                type="time"
                                                value={r.clockOut ?? ""}
                                                onChange={(e) => onUpdateRow(r.id, { clockOut: e.target.value || undefined })}
                                                className="w-27.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            />
                                        ) : (
                                            <span className="text-slate-600 font-medium tabular-nums">
                                                {formatTime(r.clockOut)}
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3 pr-3 text-right font-semibold text-slate-800 tabular-nums">
                                        {r.hoursWorked !== undefined
                                            ? `${r.hoursWorked.toFixed(1)} h`
                                            : computeHours(r.clockIn, r.clockOut)}
                                    </td>

                                    <td className="py-3 pr-3">
                                        {marking ? (
                                            <div className="relative">
                                                <select
                                                    value={r.status}
                                                    onChange={(e) =>
                                                        onUpdateRow(r.id, { status: e.target.value as AttendanceStatus })
                                                    }
                                                    className="appearance-none bg-slate-50 border border-slate-200 pl-2.5 pr-7 py-1.5 rounded-lg text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                                                >
                                                    {ATTENDANCE_STATUSES.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                <svg className="w-2.5 h-2.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                                </svg>
                                            </div>
                                        ) : (
                                            <span
                                                className={[
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                                                    meta.bg,
                                                    meta.text,
                                                ].join(" ")}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                                                {r.status}
                                            </span>
                                        )}
                                    </td>

                                    <td
                                        className="py-3 pr-4 text-right"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {marking ? (
                                            <button
                                                onClick={() => onSaveRow(r.id)}
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
                                                href={`/employees/${r.employeeId}`}
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
            </div>

            {/* Pagination bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-3 py-3 border-t border-slate-100">
                {/* Left: rows per page + range */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="font-medium">Rows per page</span>
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setPage(1); // reset to first page on size change
                            }}
                            className="appearance-none bg-white border border-slate-200 pl-3.5 pr-8 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {PAGE_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <svg className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                    </div>
                    <span className="font-medium tabular-nums">
                        {start}–{end} of {records.length}
                    </span>
                </div>

                {/* Right: page buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage(Math.max(1, safePage - 1))}
                        disabled={safePage === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous page"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {pageNumbers.map((p, i) =>
                        p === "…" ? (
                            <span
                                key={`e-${i}`}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs"
                            >
                                …
                            </span>
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
                        aria-label="Next page"
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

/* Auto-compute hours from clock-in/out HH:MM strings */
function computeHours(inT?: string, outT?: string): string {
    if (!inT || !outT) return "—";
    const [ih, im] = inT.split(":").map(Number);
    const [oh, om] = outT.split(":").map(Number);
    if ([ih, im, oh, om].some((n) => isNaN(n))) return "—";
    const hours = oh + om / 60 - (ih + im / 60);
    return hours > 0 ? `${hours.toFixed(1)} h` : "—";
}