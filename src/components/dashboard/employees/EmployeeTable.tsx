"use client";

import { useRouter } from "next/navigation";
import { type Employee } from "@/lib/constants";
import { formatMoney } from "@/lib/employee-detail";

const statusStyles: Record<Employee["status"], string> = {
    Active: "bg-emerald-50 text-emerald-700",
    "On Leave": "bg-amber-50 text-amber-700",
    Probation: "bg-blue-50 text-blue-700",
    Inactive: "bg-slate-100 text-slate-500",
};

interface EmployeeTableProps {
    employees: Employee[];
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onEdit: (emp: Employee) => void;
    onDelete: (emp: Employee) => void;
    currency: string;
}

export default function EmployeeTable({
    employees,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    onEdit,
    onDelete,
    currency,
}: EmployeeTableProps) {
    const router = useRouter();

    const allSelected =
        employees.length > 0 && employees.every((e) => selectedIds.has(e.id));
    const someSelected = employees.some((e) => selectedIds.has(e.id));

    const goToEmployee = (employeeId: string) => {
        router.push(`/employees/${employeeId}`);
    };

    return (
        <div className="bg-white rounded-[28px] p-2 shadow-card-sm border border-slate-200/50 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-250">
                    <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="py-3 pl-4 pr-5 w-10">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = someSelected && !allSelected;
                                    }}
                                    onChange={onToggleSelectAll}
                                    className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                                />
                            </th>
                            <th className="py-3 pr-3">Employee</th>
                            <th className="py-3 pr-3">Branch</th>
                            <th className="py-3 pr-3">Department</th>
                            <th className="py-3 pr-3">Designation</th>
                            <th className="py-3 pr-3 text-right">Basic</th>
                            <th className="py-3 pr-3 text-right">Gross</th>
                            <th className="py-3 pr-3 text-right">Net</th>
                            <th className="py-3 pr-3">Status</th>
                            <th className="py-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <circle cx="11" cy="11" r="8" />
                                                <line x1="21" x2="16.65" y1="21" y2="16.65" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-700">No employees found</p>
                                        <p className="text-xs text-slate-400">Try adjusting your filters or search.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            employees.map((emp) => (
                                <tr
                                    key={emp.id}
                                    onClick={() => goToEmployee(emp.employeeId)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            goToEmployee(emp.employeeId);
                                        }
                                    }}
                                    tabIndex={0}
                                    role="link"
                                    aria-label={`View ${emp.name}`}
                                    className={[
                                        "hover:bg-slate-50/60 transition-colors cursor-pointer outline-none",
                                        "focus-visible:bg-primary-50/40 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset",
                                        selectedIds.has(emp.id) ? "bg-primary-50/40" : "",
                                    ].join(" ")}
                                >
                                    {/* Checkbox cell — stop propagation */}
                                    <td
                                        className="py-3 pl-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(emp.id)}
                                            onChange={() => onToggleSelect(emp.id)}
                                            className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                                        />
                                    </td>

                                    {/* Name + ID + avatar */}
                                    <td className="py-3 pr-3">
                                        <div className="flex items-center gap-3 min-w-50">
                                            {emp.avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    alt={emp.name}
                                                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                                    src={emp.avatar}
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                                                    {emp.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-semibold text-slate-800 truncate">
                                                        {emp.name}
                                                    </span>
                                                    {emp.incomplete && (
                                                        <span title="Missing information" className="text-amber-500">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[11px] text-slate-400 font-medium">
                                                    {emp.employeeId} · {emp.email || "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-3 pr-3 text-slate-600 font-medium">{emp.branch}</td>
                                    <td className="py-3 pr-3">
                                        {emp.department ? (
                                            <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                                                {emp.department}
                                            </span>
                                        ) : (
                                            <span className="text-amber-600 font-medium text-[11px]">Missing</span>
                                        )}
                                    </td>
                                    <td className="py-3 pr-3 text-slate-600 font-medium">{emp.designation}</td>

                                    {/* Salary columns now use the workspace currency */}
                                    <td className="py-3 pr-3 text-right font-semibold text-slate-800 tabular-nums">
                                        {formatMoney(emp.basicSalary, currency)}
                                    </td>
                                    <td className="py-3 pr-3 text-right font-semibold text-slate-800 tabular-nums">
                                        {formatMoney(emp.grossSalary, currency)}
                                    </td>
                                    <td className="py-3 pr-3 text-right font-semibold text-emerald-700 tabular-nums">
                                        {formatMoney(emp.netSalary, currency)}
                                    </td>

                                    <td className="py-3 pr-3">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[emp.status]}`}>
                                            {emp.status}
                                        </span>
                                    </td>

                                    {/* Actions — stop propagation so clicking edit/delete doesn't navigate */}
                                    <td
                                        className="py-3 pr-4"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => onEdit(emp)}
                                                aria-label={`Edit ${emp.name}`}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => onDelete(emp)}
                                                aria-label={`Delete ${emp.name}`}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}