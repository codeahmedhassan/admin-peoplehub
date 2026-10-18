"use client";

import {
    formatDate,
    formatMoney,
    type EmployeeDetail,
} from "@/lib/employee-detail";

export default function OverviewTab({ employee }: { employee: EmployeeDetail }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Contact">
                <Row k="Work email" v={employee.email || "—"} />
                <Row k="Personal email" v={employee.personalEmail || "—"} />
                <Row k="Phone" v={employee.phone || "—"} />
                <Row k="Address" v={employee.address || "—"} />
                <Row
                    k="City / Country"
                    v={[employee.city, employee.country].filter(Boolean).join(", ") || "—"}
                />
            </Card>

            <Card title="Personal">
                <Row k="Date of birth" v={formatDate(employee.dateOfBirth)} />
                <Row k="Gender" v={employee.gender || "—"} />
                <Row k="Branch" v={employee.branch} />
            </Card>

            <Card title="Emergency Contact">
                <Row k="Name" v={employee.emergencyName || "—"} />
                <Row k="Relationship" v={employee.emergencyRelation || "—"} />
                <Row k="Phone" v={employee.emergencyPhone || "—"} />
            </Card>

            <Card title="Summary">
                <Row k="Basic salary" v={formatMoney(employee.basicSalary, employee.currency)} />
                <Row k="Gross salary" v={formatMoney(employee.grossSalary, employee.currency)} />
                <Row k="Net salary" v={formatMoney(employee.netSalary, employee.currency)} highlight />
                <Row k="Payroll group" v={employee.payrollGroup || "Default"} />
            </Card>
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

function Row({ k, v, highlight }: { k: string; v: string; highlight?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-4 text-xs">
            <span className="text-slate-500 shrink-0">{k}</span>
            <span className={[
                "font-medium text-right wrap-break-words",
                highlight ? "text-emerald-700 font-semibold" : "text-slate-800",
            ].join(" ")}>
                {v}
            </span>
        </div>
    );
}