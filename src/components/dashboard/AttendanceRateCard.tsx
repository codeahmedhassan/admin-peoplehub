import { ATTENDANCE_RATE } from "@/lib/constants";

export default function AttendanceRateCard() {
    return (
        <div className="bg-white rounded-[28px] p-6 shadow-card-sm border border-slate-200/50 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-base font-bold text-slate-900">Attendance rate</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Total attendance rate of employee in this company
                    </p>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 transition-colors">
                    <span>{ATTENDANCE_RATE.period}</span>
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-12 gap-4 mt-6 items-end">
                {/* Left stat */}
                <div className="col-span-5 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                {ATTENDANCE_RATE.percentage}
                            </span>
                            <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                                <svg
                                    className="w-3.5 h-3.5 -rotate-45"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                >
                                    <line x1="5" x2="19" y1="12" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            {ATTENDANCE_RATE.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 mt-8">
                        {ATTENDANCE_RATE.legend.map((item) => (
                            <div key={item.label} className="flex items-center gap-2">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-xs font-semibold text-slate-700">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bars */}
                <div className="col-span-7 relative pt-4">
                    <div className="absolute inset-x-0 top-0 bottom-8 chart-grid-pattern opacity-30 pointer-events-none rounded-xl" />
                    <svg
                        className="absolute inset-x-0 top-3 w-full h-24 text-slate-200 pointer-events-none"
                        fill="none"
                        preserveAspectRatio="none"
                        viewBox="0 0 300 100"
                    >
                        <path
                            d="M0,55 C40,40 60,65 90,45 C120,25 140,55 180,40 C220,25 250,55 300,35"
                            fill="none"
                            stroke="#CBD5E1"
                            strokeDasharray="3 3"
                            strokeWidth={1.2}
                        />
                    </svg>

                    <div className="relative z-10 flex items-end justify-between px-1 h-44">
                        {ATTENDANCE_RATE.bars.map((bar) => (
                            <div key={bar.month} className="flex flex-col items-center gap-2">
                                <div className="flex flex-col items-center gap-1.5 w-6">
                                    <div
                                        className="w-6 bg-accent-lime rounded-full"
                                        style={{ height: `${bar.lateHeight}px` }}
                                    />
                                    <div
                                        className="w-6 bg-primary rounded-full"
                                        style={{ height: `${bar.onTimeHeight}px` }}
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">
                                    {bar.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}