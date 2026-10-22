"use client";

import {
    ATTENDANCE_STATUSES,
    type AttendanceStatus,
} from "@/lib/attendance";

interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    status: AttendanceStatus | "";
    onStatusChange: (v: AttendanceStatus | "") => void;
    department: string;
    onDepartmentChange: (v: string) => void;
    departments: string[];
    onReset: () => void;
}

export default function AttendanceFilters({
    search,
    onSearchChange,
    status,
    onStatusChange,
    department,
    onDepartmentChange,
    departments,
    onReset,
}: Props) {
    const hasFilter = !!(search || status || department);

    return (
        <div className="bg-white rounded-[28px] p-4 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-55">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" strokeWidth={2} />
                            <line strokeWidth={2} x1="21" x2="16.65" y1="21" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name or ID…"
                        className="w-full bg-slate-50 border-0 py-2.5 pl-11 pr-4 rounded-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                </div>

                {/* Status filter */}
                <div className="relative">
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value as AttendanceStatus | "")}
                        className="appearance-none bg-white border border-slate-200 pl-3.5 pr-8 py-2 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">Any status</option>
                        {ATTENDANCE_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <svg className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </div>

                {/* Department filter */}
                <div className="relative">
                    <select
                        value={department}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 pl-3.5 pr-8 py-2 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <option value="">All departments</option>
                        {departments.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                    <svg className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </div>

                {hasFilter && (
                    <button
                        onClick={onReset}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors px-1"
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}