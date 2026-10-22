"use client";

import {
    getInitials,
    getTenure,
    formatDate,
    formatMoney,
    type EmployeeDetail,
} from "@/lib/employee-detail";

const statusStyles: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "On Leave": "bg-amber-50 text-amber-700 border-amber-200",
    Probation: "bg-blue-50 text-blue-700 border-blue-200",
    Inactive: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function EmployeeHero({
    employee,
    onBack,
    onEdit,
    onDelete,
}: {
    employee: EmployeeDetail;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-card-sm">
            {/* Top row: identity + actions */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-start gap-4 min-w-0">
                    {employee.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            alt={employee.name}
                            src={employee.avatar}
                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                            {getInitials(employee.name)}
                        </div>
                    )}

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                                {employee.name}
                            </h1>
                            {employee.preferredName && employee.preferredName !== employee.name.split(" ")[0] && (
                                <span className="text-xs font-medium text-slate-400">
                                    “{employee.preferredName}”
                                </span>
                            )}
                            <span
                                className={[
                                    "px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                                    statusStyles[employee.status] ?? statusStyles.Inactive,
                                ].join(" ")}
                            >
                                {employee.status}
                            </span>
                            {employee.incomplete && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    INCOMPLETE
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                            {employee.designation || "No title"}
                            {employee.department && <> · {employee.department}</>}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-medium flex-wrap">
                            <span className="tabular-nums">{employee.employeeId}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{employee.branch}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{employee.email || "No email"}</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back
                    </button>
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 rounded-full text-xs font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                <Stat label="Joined" value={formatDate(employee.joiningDate)} />
                <Stat label="Tenure" value={getTenure(employee.joiningDate)} />
                <Stat label="Employment" value={employee.employmentType ?? "—"} />
                <Stat label="Net Pay" value={formatMoney(employee.netSalary, employee.currency)} highlight />
            </div>
        </div>
    );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className={[
                "mt-1 text-sm font-bold truncate",
                highlight ? "text-emerald-700" : "text-slate-800",
            ].join(" ")}>
                {value}
            </p>
        </div>
    );
}