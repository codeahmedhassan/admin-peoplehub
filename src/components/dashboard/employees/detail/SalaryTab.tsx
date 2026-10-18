"use client";

import { formatMoney, type EmployeeDetail } from "@/lib/employee-detail";

export default function SalaryTab({ employee }: { employee: EmployeeDetail }) {
    const currency = employee.currency ?? "USD";

    // Percentage of gross that is "net" and "deductions"
    const deductions = employee.grossSalary - employee.netSalary;
    const deductionPct = employee.grossSalary > 0 ? (deductions / employee.grossSalary) * 100 : 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Breakdown card */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h3 className="text-sm font-bold text-slate-900">Salary Breakdown</h3>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {employee.payFrequency ?? "Monthly"} · {currency}
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <SalaryTile label="Basic Salary" value={formatMoney(employee.basicSalary, currency)} tone="slate" />
                    <SalaryTile label="Gross Salary" value={formatMoney(employee.grossSalary, currency)} tone="primary" />
                    <SalaryTile label="Net Salary" value={formatMoney(employee.netSalary, currency)} tone="emerald" />
                </div>

                {/* Visual bar */}
                <div className="mt-6">
                    <p className="text-[11px] font-semibold text-slate-500 mb-2">Take-home vs deductions</p>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex">
                        <div
                            className="bg-emerald-500"
                            style={{ width: `${100 - deductionPct}%` }}
                            title={`Net: ${100 - deductionPct}%`}
                        />
                        <div
                            className="bg-rose-400"
                            style={{ width: `${deductionPct}%` }}
                            title={`Deductions: ${deductionPct}%`}
                        />
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-[11px] font-medium">
                        <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Net · {formatMoney(employee.netSalary, currency)}
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-rose-400" />
                            Deductions · {formatMoney(deductions, currency)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bank & payroll */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Bank Details">
                    <Row k="Bank name" v={employee.bankName || "—"} />
                    <Row k="Account holder" v={employee.bankAccountName || "—"} />
                    <Row k="Account number" v={employee.bankAccountNumber || "—"} />
                </Card>
                <Card title="Payroll">
                    <Row k="Pay frequency" v={employee.payFrequency || "—"} />
                    <Row k="Payroll group" v={employee.payrollGroup || "Default"} />
                    <Row k="Tax ID" v={employee.taxIdentifier || "—"} />
                </Card>
            </div>
        </div>
    );
}

function SalaryTile({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone: "slate" | "primary" | "emerald";
}) {
    const toneStyles = {
        slate: "bg-slate-50 text-slate-800 border-slate-100",
        primary: "bg-primary-50 text-primary border-primary-100",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    } as const;

    return (
        <div className={`rounded-2xl p-4 border ${toneStyles[tone]}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</p>
            <p className="mt-1.5 text-lg font-extrabold tabular-nums">{value}</p>
        </div>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-[28px] p-5 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{title}</h3>
            <div className="flex flex-col gap-2">{children}</div>
        </div>
    );
}

function Row({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex items-start justify-between gap-4 text-xs">
            <span className="text-slate-500 shrink-0">{k}</span>
            <span className="font-medium text-right text-slate-800 wrap-break-words">{v}</span>
        </div>
    );
}