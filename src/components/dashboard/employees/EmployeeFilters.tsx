"use client";

import { BRANCHES, DEPARTMENTS, EMPLOYEE_STATUSES } from "@/lib/constants";

interface EmployeeFiltersProps {
    search: string;
    onSearchChange: (v: string) => void;
    department: string;
    onDepartmentChange: (v: string) => void;
    branch: string;
    onBranchChange: (v: string) => void;
    status: string;
    onStatusChange: (v: string) => void;
    onlyIncomplete: boolean;
    onOnlyIncompleteChange: (v: boolean) => void;
    onReset: () => void;
}

export default function EmployeeFilters({
    search,
    onSearchChange,
    department,
    onDepartmentChange,
    branch,
    onBranchChange,
    status,
    onStatusChange,
    onlyIncomplete,
    onOnlyIncompleteChange,
    onReset,
}: EmployeeFiltersProps) {
    const hasActiveFilter =
        search || department || branch || status || onlyIncomplete;

    return (
        <div className="bg-white rounded-[28px] p-5 shadow-card-sm border border-slate-200/50">
            <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-60 max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" strokeWidth={2} />
                            <line strokeWidth={2} x1="21" x2="16.65" y1="21" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name, ID, email…"
                        className="w-full bg-slate-50 border-0 py-2.5 pl-11 pr-4 rounded-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Select label="All Departments" value={department} onChange={onDepartmentChange} options={DEPARTMENTS} />
                    <Select label="All Branches" value={branch} onChange={onBranchChange} options={BRANCHES} />
                    <Select
                        label="Any Status"
                        value={status}
                        onChange={onStatusChange}
                        options={EMPLOYEE_STATUSES as unknown as string[]}
                    />

                    {/* Incomplete toggle */}
                    <button
                        onClick={() => onOnlyIncompleteChange(!onlyIncomplete)}
                        className={[
                            "flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors border cursor-pointer",
                            onlyIncomplete
                                ? "bg-amber-50 border-amber-200 text-amber-800"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Incomplete</span>
                    </button>

                    {hasActiveFilter && (
                        <button
                            onClick={onReset}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors px-1 cursor-pointer"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function Select({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border border-slate-200 pl-3.5 pr-8 py-2 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <option value="">{label}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>
            <svg
                className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
        </div>
    );
}