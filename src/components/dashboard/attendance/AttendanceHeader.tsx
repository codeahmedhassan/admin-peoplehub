"use client";

import { useState } from "react";
import { formatDate } from "@/lib/attendance";

interface Props {
    view: "today" | "week";
    onViewChange: (v: "today" | "week") => void;
    /** YYYY-MM-DD; empty string if not yet resolved from the backend. */
    date: string;
    onDateChange: (d: string) => void;
    marking: boolean;
    onToggleMarking: () => void;
    onExport: (format: "csv" | "xlsx") => void;
}

export default function AttendanceHeader({
    view,
    onViewChange,
    date,
    onDateChange,
    marking,
    onToggleMarking,
    onExport,
}: Props) {
    const [exportOpen, setExportOpen] = useState(false);

    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <p className="text-xs text-slate-400 font-medium">People</p>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Attendance
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    {view === "today"
                        ? `Snapshot for ${formatDate(date)}`
                        : `7-day overview ending ${formatDate(date)}`}
                </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {/* View toggle — unchanged */}
                <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-200">
                    <button
                        onClick={() => onViewChange("today")}
                        className={[
                            "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                            view === "today"
                                ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30"
                                : "text-slate-600 hover:text-slate-800",
                        ].join(" ")}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => onViewChange("week")}
                        className={[
                            "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                            view === "week"
                                ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30"
                                : "text-slate-600 hover:text-slate-800",
                        ].join(" ")}
                    >
                        7 days
                    </button>
                </div>

                {/* Date picker — unchanged */}
                <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                    </span>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="bg-white border border-slate-200 pl-9 pr-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    />
                </div>

                {/* Mark attendance toggle — unchanged */}
                <button
                    onClick={onToggleMarking}
                    className={[
                        "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors",
                        marking
                            ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30 hover:bg-primary-700"
                            : "bg-text-dark text-white shadow-sm hover:bg-slate-800",
                    ].join(" ")}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {marking ? "Exit mark mode" : "Mark attendance"}
                </button>

                {/* Export dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setExportOpen((v) => !v)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Export
                        <svg className={`w-3 h-3 text-slate-400 transition-transform ${exportOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                    </button>

                    {exportOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 p-1.5">
                                <button
                                    onClick={() => {
                                        setExportOpen(false);
                                        onExport("csv");
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                                        CSV
                                    </span>
                                    Export as CSV
                                </button>
                                <button
                                    onClick={() => {
                                        setExportOpen(false);
                                        onExport("xlsx");
                                    }}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                                        XLS
                                    </span>
                                    Export as XLSX
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}