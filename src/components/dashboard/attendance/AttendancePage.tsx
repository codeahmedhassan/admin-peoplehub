"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
    summarize,
    todayIso,
    isoToLocalHHMM,
    type AttendanceStatus,
    type AttendanceRecord,
} from "@/lib/attendance";
import { attendanceApi, ApiError, type ApiAttendanceRow } from "@/lib/api";
import { DEPARTMENTS } from "@/lib/employee-form";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceStats from "./AttendanceStats";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceTable from "./AttendanceTable";
import AttendanceWeekChart from "./AttendanceWeekChart";
import AttendanceBreakdown from "./AttendanceBreakdown";

type View = "today" | "week";
type LoadState = "loading" | "ready" | "error";

function mapStatus(raw: ApiAttendanceRow["status"]): AttendanceStatus {
    switch (raw) {
        case "present": return "Present";
        case "late": return "Late";
        case "remote": return "Remote";
        case "half-day": return "Half Day";
        case "on-leave": return "On Leave";
        case "absent": return "Absent";
        case "holiday": return "Holiday";
        case "weekend": return "Weekend";
        case "unmarked": return "Unmarked";
        default: return "Unmarked";
    }
}

function reverseStatus(s: AttendanceStatus):
    | "present" | "late" | "remote" | "half-day" | "on-leave" | "absent" {
    switch (s) {
        case "Present": return "present";
        case "Late": return "late";
        case "Remote": return "remote";
        case "Half Day": return "half-day";
        case "On Leave": return "on-leave";
        case "Absent": return "absent";
        default: return "present";
    }
}

function toUiRecord(row: ApiAttendanceRow): AttendanceRecord {
    const clockIn = isoToLocalHHMM(row.checkIn ?? undefined);
    const clockOut = isoToLocalHHMM(row.checkOut ?? undefined);
    const hoursWorked = clockIn && clockOut ? computeHours(clockIn, clockOut) : undefined;

    return {
        id: row.id,
        employeeId: row.employeeId,
        employeeObjectId: row.employeeObjectId ?? "",
        employeeName: row.employeeName,
        avatar: row.employeeAvatar,
        department: row.department ?? "",
        branch: row.branch ?? "",
        date: row.date,
        clockIn,
        clockOut,
        hoursWorked,
        status: mapStatus(row.status),
        source: row.source ?? null,
        note: row.note ?? "",
        deviceMarkedPresent: row.deviceMarkedPresent,
        deviceMarkedAt: row.deviceMarkedAt ?? null,
        markedBy: row.markedBy ?? null,
    };
}

function computeHours(inT?: string, outT?: string): number | undefined {
    if (!inT || !outT) return undefined;
    const [ih, im] = inT.split(":").map(Number);
    const [oh, om] = outT.split(":").map(Number);
    if ([ih, im, oh, om].some((n) => isNaN(n))) return undefined;
    const hours = oh + om / 60 - (ih + im / 60);
    return hours > 0 ? Number(hours.toFixed(2)) : undefined;
}

function computeRange(view: View, date: string): { from: string; to: string } {
    if (view === "today") return { from: date, to: date };
    const end = new Date(date + "T00:00:00");
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return {
        from: start.toISOString().slice(0, 10),
        to: end.toISOString().slice(0, 10),
    };
}

export default function AttendancePage() {
    const [view, setView] = useState<View>("today");
    const [date, setDate] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<AttendanceStatus | "">("");
    const [department, setDepartment] = useState("");

    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loadState, setLoadState] = useState<LoadState>("loading");
    const [loadError, setLoadError] = useState<string | null>(null);

    const [marking, setMarking] = useState(false);
    const [edits, setEdits] = useState<Record<string, Partial<AttendanceRecord>>>({});
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoadState("loading");
        setLoadError(null);
        try {
            if (view === "today") {
                const today = await attendanceApi.today();
                // If no date is selected yet, OR the selected date matches today,
                // we use the synthesized /today payload. This ensures unmarked employees
                // are shown even if they don't have a DB record yet.
                if (!date || date === today.date) {
                    if (date !== today.date) setDate(today.date);
                    setRecords(today.employees.map(toUiRecord));
                } else {
                    // User explicitly picked a past/future date.
                    const { records: rows } = await attendanceApi.list({
                        from: date,
                        to: date,
                        limit: 200,
                    });
                    setRecords(rows.map(toUiRecord));
                }
            } else {
                const anchor = date ?? todayIso();
                const { from, to } = computeRange("week", anchor);
                const { records: rows } = await attendanceApi.list({
                    from,
                    to,
                    limit: 500,
                });
                setRecords(rows.map(toUiRecord));
            }
            setLoadState("ready");
        } catch (err) {
            setLoadError(err instanceof ApiError ? err.message : "Failed to load attendance.");
            setLoadState("error");
        }
    }, [view, date]);

    useEffect(() => {
        void load();
    }, [load]);

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

    const displayed = useMemo(() => {
        return filtered.map((r) => {
            const key = r.id ?? `${r.employeeId}:${r.date}`;
            const patch = edits[key];
            return patch ? { ...r, ...patch } : r;
        });
    }, [filtered, edits]);

    const summary = useMemo(() => summarize(displayed), [displayed]);

    const departments = useMemo(() => {
        const set = new Set(records.map((r) => r.department).filter(Boolean) as string[]);
        if (set.size === 0) return DEPARTMENTS as unknown as string[];
        return Array.from(set).sort();
    }, [records]);

    const handleToggleMarking = () => {
        if (marking) {
            if (Object.keys(edits).length > 0) {
                if (!confirm("You have unsaved changes. Discard them and exit mark mode?")) return;
            }
            setEdits({});
            setSavedIds(new Set());
        }
        setMarking((m) => !m);
    };

    const rowKey = (r: AttendanceRecord) => r.id ?? `${r.employeeId}:${r.date}`;

    const updateRow = (key: string, patch: Partial<AttendanceRecord>) => {
        setEdits((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), ...patch } }));
    };

    const saveRow = async (r: AttendanceRecord) => {
        const key = rowKey(r);
        const patch = edits[key];
        if (!patch) return; // Allow if any field was edited (time or status)

        setSaving(true);
        try {
            await attendanceApi.mark([{
                employeeId: r.employeeId,
                date: r.date,
                // Fallback to the current record status if it wasn't changed
                status: reverseStatus(patch.status ?? r.status),
                checkIn: patch.clockIn !== undefined ? (patch.clockIn ? `${r.date}T${patch.clockIn}:00` : null) : undefined,
                checkOut: patch.clockOut !== undefined ? (patch.clockOut ? `${r.date}T${patch.clockOut}:00` : null) : undefined,
                note: patch.note,
            }]);
            setSavedIds((prev) => new Set(prev).add(key));
            setEdits((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
            void load();
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "Failed to save row.");
        } finally {
            setSaving(false);
        }
    };

    const saveAll = async () => {
        const entries = Object.entries(edits);
        if (entries.length === 0 || saving) return;

        const byKey = new Map(displayed.map((r) => [rowKey(r), r]));
        const payload = entries.map(([key, patch]) => {
            const r = byKey.get(key);
            if (!r) return null;

            return {
                employeeId: r.employeeId,
                date: r.date,
                // Fallback to the current record status if it wasn't changed
                status: reverseStatus(patch.status ?? r.status),
                checkIn: patch.clockIn !== undefined ? (patch.clockIn ? `${r.date}T${patch.clockIn}:00` : null) : undefined,
                checkOut: patch.clockOut !== undefined ? (patch.clockOut ? `${r.date}T${patch.clockOut}:00` : null) : undefined,
                note: patch.note,
            };
        }).filter((x): x is NonNullable<typeof x> => x !== null);

        if (payload.length === 0) return;

        setSaving(true);
        try {
            const { results, errors } = await attendanceApi.mark(payload);
            const savedKeys = new Set<string>();
            for (const [key] of entries) {
                const r = byKey.get(key);
                if (r && results.some((res) => res.employeeId === r.employeeId && res.date === r.date)) {
                    savedKeys.add(key);
                }
            }
            setSavedIds((prev) => {
                const next = new Set(prev);
                savedKeys.forEach((k) => next.add(k));
                return next;
            });
            setEdits((prev) => {
                const next = { ...prev };
                savedKeys.forEach((k) => delete next[k]);
                return next;
            });
            if (errors.length > 0) {
                alert(`Saved ${results.length}, failed ${errors.length}.\n` + errors.map((e) => `• ${e.employeeId} ${e.date}: ${e.message}`).join("\n"));
            }
            void load();
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "Failed to save attendance.");
        } finally {
            setSaving(false);
        }
    };

    const discardAll = () => {
        setEdits({});
        setSavedIds(new Set());
    };

    const handleExport = (format: "csv" | "xlsx") => {
        const anchor = date ?? todayIso();
        const { from, to } = computeRange(view, anchor);
        const url = attendanceApi.exportUrl({
            from,
            to,
            format,
            status: status ? reverseStatus(status) : undefined,
            department: department || undefined,
            q: search || undefined,
        });
        window.location.href = url;
    };

    return (
        <div className="flex flex-col gap-6">
            <AttendanceHeader
                view={view}
                onViewChange={(v) => {
                    setView(v);
                    setEdits({});
                    setSavedIds(new Set());
                }}
                date={date ?? ""}
                onDateChange={(d) => {
                    setDate(d);
                    setEdits({});
                    setSavedIds(new Set());
                }}
                marking={marking}
                onToggleMarking={handleToggleMarking}
                onExport={handleExport}
            />

            {loadState === "error" && (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3">
                    {loadError} —{" "}
                    <button onClick={() => void load()} className="font-semibold underline">Retry</button>
                </div>
            )}

            <AttendanceStats summary={summary} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
                <div className="xl:col-span-2 flex flex-col">
                    <AttendanceWeekChart records={records} date={date ?? ""} />
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
                rowKey={rowKey}
                onUpdateRow={updateRow}
                onSaveRow={saveRow}
            />

            {marking && (
                <MarkBar
                    editedCount={Object.keys(edits).length}
                    savedCount={savedIds.size}
                    saving={saving}
                    onSaveAll={saveAll}
                    onDiscardAll={discardAll}
                />
            )}
        </div>
    );
}

function MarkBar({
    editedCount,
    savedCount,
    saving,
    onSaveAll,
    onDiscardAll,
}: {
    editedCount: number;
    savedCount: number;
    saving: boolean;
    onSaveAll: () => void;
    onDiscardAll: () => void;
}) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl">
            <div className="flex items-center justify-between gap-3 rounded-2xl pl-4 pr-2 py-2 shadow-2xl bg-text-dark border border-slate-800 text-white shadow-slate-900/30">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                    <span className="text-xs font-semibold truncate">
                        {saving ? "Saving…" : editedCount > 0 ? `${editedCount} row${editedCount === 1 ? "" : "s"} edited` : savedCount > 0 ? `${savedCount} row${savedCount === 1 ? "" : "s"} marked · add more` : "Mark attendance mode"}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={onDiscardAll}
                        disabled={(editedCount === 0 && savedCount === 0) || saving}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Discard
                    </button>
                    <button
                        onClick={onSaveAll}
                        disabled={editedCount === 0 || saving}
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