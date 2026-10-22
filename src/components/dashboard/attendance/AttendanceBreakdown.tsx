import { STATUS_META, type AttendanceSummary } from "@/lib/attendance";

export default function AttendanceBreakdown({ summary }: { summary: AttendanceSummary }) {
    const rows = [
        { label: "Present", value: summary.present, meta: STATUS_META.Present },
        { label: "Late", value: summary.late, meta: STATUS_META.Late },
        { label: "Remote", value: summary.remote, meta: STATUS_META.Remote },
        { label: "Half Day", value: summary.halfDay, meta: STATUS_META["Half Day"] },
        { label: "On Leave", value: summary.onLeave, meta: STATUS_META["On Leave"] },
        { label: "Absent", value: summary.absent, meta: STATUS_META.Absent },
    ];

    return (
        <div className="h-full bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-card-sm flex flex-col">
            <div>
                <h3 className="text-base font-bold text-slate-900">Status Breakdown</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                    Who&apos;s where right now
                </p>
            </div>

            {/* Rows: natural height, no stretching */}
            <div className="mt-5 flex flex-col gap-2.5">
                {rows.map((r) => {
                    const pct = summary.total > 0 ? (r.value / summary.total) * 100 : 0;
                    return (
                        <div key={r.label} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="flex items-center gap-2 text-slate-700">
                                    <span className={`w-2 h-2 rounded-full ${r.meta.dot}`} />
                                    {r.label}
                                </span>
                                <span className="text-slate-500 tabular-nums">
                                    {r.value}{" "}
                                    <span className="text-slate-400 font-medium">
                                        ({pct.toFixed(0)}%)
                                    </span>
                                </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                    className={`h-full ${r.meta.dot} rounded-full transition-all duration-500`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer pinned to bottom via mt-auto */}
            <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Avg. hours / day
                    </p>
                    <p className="text-sm font-bold text-slate-800 tabular-nums">
                        {summary.avgHours.toFixed(1)} h
                    </p>
                </div>
            </div>
        </div>
    );
}