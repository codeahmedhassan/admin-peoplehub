"use client";

import { formatDate, type EmployeeDetail } from "@/lib/employee-detail";

const typeStyles = {
    created: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "plus" },
    updated: { bg: "bg-blue-50", text: "text-blue-600", icon: "edit" },
    login: { bg: "bg-amber-50", text: "text-amber-600", icon: "key" },
    document: { bg: "bg-slate-100", text: "text-slate-600", icon: "doc" },
} as const;

export default function ActivityTab({ employee }: { employee: EmployeeDetail }) {
    const activity = employee.activity ?? [];

    return (
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Activity</h3>

            {activity.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No activity recorded yet.</p>
            ) : (
                <ol className="relative flex flex-col gap-4 pl-1">
                    {activity.map((a, i) => {
                        const style = typeStyles[a.type] ?? typeStyles.document;
                        return (
                            <li key={a.id} className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full ${style.bg} ${style.text} flex items-center justify-center shrink-0`}>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        {style.icon === "plus" && <path d="M12 5v14M5 12h14" strokeLinecap="round" />}
                                        {style.icon === "edit" && <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />}
                                        {style.icon === "key" && <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" strokeLinecap="round" strokeLinejoin="round" />}
                                        {style.icon === "doc" && <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />}
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <p className="text-xs font-semibold text-slate-800">{a.label}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(a.at)}</p>
                                </div>
                                {i < activity.length - 1 && (
                                    <span className="absolute left-5 w-px bg-slate-100" style={{ top: "2rem", height: "1.5rem" }} />
                                )}
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
}