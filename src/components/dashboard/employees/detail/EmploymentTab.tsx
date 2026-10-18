"use client";

import { formatDate, type EmployeeDetail } from "@/lib/employee-detail";

export default function EmploymentTab({ employee }: { employee: EmployeeDetail }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Role & Position">
                <Row k="Designation" v={employee.designation || "—"} />
                <Row k="Department" v={employee.department || "—"} />
                <Row k="Reporting manager" v={employee.reportingManager || "—"} />
                <Row k="Employment type" v={employee.employmentType || "—"} />
                <Row k="Employment status" v={employee.status} />
            </Card>

            <Card title="Timeline">
                <Row k="Joining date" v={formatDate(employee.joiningDate)} />
                <Row k="Probation end" v={formatDate(employee.probationEndDate)} />
                <Row k="Contract end" v={formatDate(employee.contractEndDate)} />
            </Card>

            <Card title="Work Setup">
                <Row k="Work location" v={employee.workLocation || employee.branch} />
                <Row k="Work arrangement" v={employee.workArrangement || "—"} />
                <Row k="Time zone" v="Inherit from company" />
            </Card>

            <Card title="Attendance">
                <Row k="Attendance eligibility" v="Eligible" />
                <Row k="Attendance method" v="Inherit company default" />
                <Row k="Overtime eligible" v="No" />
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

function Row({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex items-start justify-between gap-4 text-xs">
            <span className="text-slate-500 shrink-0">{k}</span>
            <span className="font-medium text-right text-slate-800 wrap-break-words">{v}</span>
        </div>
    );
}