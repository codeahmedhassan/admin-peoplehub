"use client";

import { useMemo } from "react";
import { type AttendanceRecord } from "@/lib/attendance";

interface Props {
    records: AttendanceRecord[];
    date: string;
}

export default function AttendanceWeekChart({ records }: Props) {
    const days = useMemo(() => {
        // Group records by date
        const map = new Map<
            string,
            { present: number; late: number; absent: number; leave: number; remote: number }
        >();
        for (const r of records) {
            const bucket = map.get(r.date) ?? {
                present: 0,
                late: 0,
                absent: 0,
                leave: 0,
                remote: 0,
            };
            if (r.status === "Present") bucket.present++;
            else if (r.status === "Late") bucket.late++;
            else if (r.status === "Remote") bucket.remote++;
            else if (r.status === "Absent") bucket.absent++;
            else if (r.status === "On Leave") bucket.leave++;
            else if (r.status === "Half Day") bucket.present += 0.5;
            map.set(r.date, bucket);
        }

        return Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([iso, v]) => ({
                iso,
                label: new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
                    weekday: "short",
                }),
                dayNum: new Date(iso + "T00:00:00").getDate(),
                ...v,
                total: v.present + v.late + v.absent + v.leave + v.remote,
            }));
    }, [records]);

    const max = Math.max(1, ...days.map((d) => d.total));

    return (
        <div className="h-full bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-card-sm flex flex-col">
            <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                    <h3 className="text-base font-bold text-slate-900">This week at a glance</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Daily attendance mix across the last 7 days
                    </p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1457DC]" />
                        Present
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent-lime" />
                        Late / Remote
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                        Absent
                    </span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="mt-6 relative flex-1 min-h-55">
                <div className="absolute inset-x-0 top-0 bottom-8 chart-grid-pattern opacity-30 pointer-events-none rounded-xl" />

                <div className="relative z-10 flex items-end justify-between gap-2 h-full px-1">
                    {days.map((d) => {
                        // Calculate total height percentage (max 100%)
                        const heightPct = d.total > 0 ? (d.total / max) * 100 : 0;

                        // Calculate the flex-grow ratios for each segment
                        const presentRatio = d.total > 0 ? d.present / d.total : 0;
                        const lateRatio = d.total > 0 ? (d.late + d.remote) / d.total : 0;
                        const absentRatio = d.total > 0 ? (d.absent + d.leave) / d.total : 0;

                        return (
                            <div key={d.iso} className="flex flex-col items-center justify-end gap-2 flex-1 h-full min-w-0">
                                {/* The Bar */}
                                <div
                                    className="w-full max-w-8 flex flex-col items-stretch gap-0.5"
                                    style={{ height: `${Math.max(4, heightPct)}%` }}
                                >
                                    {/* Absent Segment */}
                                    {absentRatio > 0 && (
                                        <div
                                            className="bg-rose-400 rounded-full transition-all duration-500"
                                            style={{ flex: absentRatio }}
                                            title={`${d.absent + d.leave} absent/leave`}
                                        />
                                    )}
                                    {/* Late/Remote Segment */}
                                    {lateRatio > 0 && (
                                        <div
                                            className="bg-accent-lime rounded-full transition-all duration-500"
                                            style={{ flex: lateRatio }}
                                            title={`${d.late + d.remote} late/remote`}
                                        />
                                    )}
                                    {/* Present Segment */}
                                    {presentRatio > 0 && (
                                        <div
                                            className="bg-[#1457DC] rounded-full transition-all duration-500"
                                            style={{ flex: presentRatio }}
                                            title={`${d.present} present`}
                                        />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="text-center shrink-0">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        {d.label}
                                    </p>
                                    <p className="text-[10px] font-semibold text-slate-700 tabular-nums">
                                        {d.dayNum}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}