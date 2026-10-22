"use client";

import { useMemo, useState } from "react";
import {
    getAllAttendance,
    getWeeklyAttendance,
    summarize,
    todayIso,
    type AttendanceStatus,
    type AttendanceRecord,
} from "@/lib/attendance";
import { EMPLOYEES } from "@/lib/constants";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceStats from "./AttendanceStats";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import AttendanceWeekChart from "./AttendanceWeekChart";
import AttendanceBreakdown from "./AttendanceBreakdown";

type View = "today" | "week";

export default function AttendancePage() {
    const [view, setView] = useState<View>("week");
    const [date, setDate] = useState<string>(todayIso());
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<AttendanceStatus | "">("");
    const [department, setDepartment] = useState("");

    // Manual mark mode
    const [marking, setMarking] = useState(false);
    const [edits, setEdits] = useState<Record<string, Partial<AttendanceRecord>>>({});
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    const records = useMemo(() => {
        return view === "today" ? getAllAttendance(date) : getWeeklyAttendance(date);
    }, [view, date]);

    const filtered = useMemo(() => {
        return records.filter((r) => {
            if (status && r.status !== status) return false;
            if (department && r.department !== department) return false;
            if (search) {
                const q = search.toLowerCase();
                const hay = `${r.employeeName} ${r.employeeId}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [records, status, department, search]);

    // Merge staged edits on top of records for display
    const displayed = useMemo(() => {
        return filtered.map((r) => ({
            ...r,
            ...(edits[r.id] ?? {}),
        }));
    }, [filtered, edits]);

    const summary = useMemo(() => summarize(displayed), [displayed]);

    const departments = useMemo(() => {
        const set = new Set(EMPLOYEES.map((e) => e.department).filter(Boolean));
        return Array.from(set).sort();
    }, []);

    // Toggle manual mode
    const handleToggleMarking = () => {
        if (marking) {
            // exiting
            if (Object.keys(edits).length > 0) {
                const ok = confirm(
                    "You have unsaved changes. Discard them and exit mark mode?"
                );
                if (!ok) return;
            }
            setEdits({});
            setSavedIds(new Set());
        }
        setMarking((m) => !m);
    };

    // Stage a field change on a row
    const updateRow = (id: string, patch: Partial<AttendanceRecord>) => {
        setEdits((prev) => ({
            ...prev,
            [id]: { ...(prev[id] ?? {}), ...patch },
        }));
    };

    // Save a single row (stage to backend)
    const saveRow = (id: string) => {
        console.log("Save row:", id, edits[id]);
        setSavedIds((prev) => new Set(prev).add(id));
        setEdits((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    // Save all staged edits
    const saveAll = () => {
        console.log("Save all:", edits);
        setSavedIds((prev) => {
            const next = new Set(prev);
            Object.keys(edits).forEach((id) => next.add(id));
            return next;
        });
        setEdits({});
    };

    // Discard all
    const discardAll = () => {
        setEdits({});
        setSavedIds(new Set());
    };

    return (
        <div className="flex flex-col gap-6">
            <AttendanceHeader
                view={view}
                onViewChange={setView}
                date={date}
                onDateChange={setDate}
                marking={marking}
                onToggleMarking={handleToggleMarking}
            />

            <AttendanceStats summary={summary} />

            {/* Equal-height grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                <div className="xl:col-span-2 flex flex-col">
                    <AttendanceWeekChart records={records} date={date} />
                </div>
                <div className="flex flex-col">
                    <AttendanceBreakdown summary={summary} />
                </div>
            </div>

            <AttendanceFilters
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                department={department}
                onDepartmentChange={setDepartment}
                departments={departments}
                onReset={() => {
                    setSearch("");
                    setStatus("");
                    setDepartment("");
                }}
            />

            <AttendanceTable
                records={displayed}
                marking={marking}
                edits={edits}
                savedIds={savedIds}
                onUpdateRow={updateRow}
                onSaveRow={saveRow}
            />

            {/* Floating save bar in mark mode */}
            {marking && (
                <MarkBar
                    editedCount={Object.keys(edits).length}
                    savedCount={savedIds.size}
                    onSaveAll={saveAll}
                    onDiscardAll={discardAll}
                />
            )}
        </div>
    );
}

/* ---------- Floating action bar ---------- */

function MarkBar({
    editedCount,
    savedCount,
    onSaveAll,
    onDiscardAll,
}: {
    editedCount: number;
    savedCount: number;
    onSaveAll: () => void;
    onDiscardAll: () => void;
}) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl">
            <div className="flex items-center justify-between gap-3 rounded-2xl pl-4 pr-2 py-2 shadow-2xl bg-text-dark border border-slate-800 text-white shadow-slate-900/30">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                    <span className="text-xs font-semibold truncate">
                        {editedCount > 0
                            ? `${editedCount} row${editedCount === 1 ? "" : "s"} edited`
                            : savedCount > 0
                                ? `${savedCount} row${savedCount === 1 ? "" : "s"} marked · add more`
                                : "Mark attendance mode"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={onDiscardAll}
                        disabled={editedCount === 0 && savedCount === 0}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onSaveAll}
                        disabled={editedCount === 0}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-text-dark hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Save {editedCount > 0 ? `(${editedCount})` : ""}
                    </button>
                </div>
            </div>
        </div>
    );
}