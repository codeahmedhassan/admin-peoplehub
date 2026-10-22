import { type AttendanceSummary } from "@/lib/attendance";

export default function AttendanceStats({ summary }: { summary: AttendanceSummary }) {
    const stats = [
        {
            label: "Attendance Rate",
            value: `${summary.attendanceRate}%`,
            hint: `${summary.present + summary.late + summary.remote} checked in`,
            accent: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            label: "Present",
            value: String(summary.present),
            hint: `${summary.remote} remote`,
            accent: "text-primary",
            bg: "bg-primary-50",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
        {
            label: "Late",
            value: String(summary.late),
            hint: `${summary.halfDay} half day`,
            accent: "text-amber-600",
            bg: "bg-amber-50",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
        },
        {
            label: "Absent / Leave",
            value: String(summary.absent + summary.onLeave),
            hint: `${summary.absent} absent · ${summary.onLeave} leave`,
            accent: "text-rose-600",
            bg: "bg-rose-50",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" x2="9" y1="9" y2="15" strokeLinecap="round" />
                    <line x1="9" x2="15" y1="9" y2="15" strokeLinecap="round" />
                </svg>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                >
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {s.label}
                        </p>
                        <div className={`w-7 h-7 rounded-full ${s.bg} ${s.accent} flex items-center justify-center`}>
                            {s.icon}
                        </div>
                    </div>
                    <p className={`mt-1.5 text-xl font-extrabold tracking-tight ${s.accent}`}>
                        {s.value}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{s.hint}</p>
                </div>
            ))}
        </div>
    );
}