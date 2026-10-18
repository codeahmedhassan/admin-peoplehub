"use client";

import { type EmployeeDraft } from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    jumpTo: (step: number) => void;
}

export default function ReviewStep({ draft, jumpTo }: Props) {
    const fullName = `${draft.firstName} ${draft.lastName}`.trim() || "Unnamed employee";

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Review & Submit</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Make sure everything looks right. Click any section to edit.
                </p>
            </div>

            {/* Identity card */}
            <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                {draft.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        alt={fullName}
                        src={draft.avatar}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-primary-100 text-primary flex items-center justify-center text-sm font-bold">
                        {draft.firstName[0] ?? "?"}
                        {draft.lastName[0] ?? ""}
                    </div>
                )}
                <div>
                    <p className="text-sm font-bold text-slate-900">{fullName}</p>
                    <p className="text-xs text-slate-500">
                        {draft.designation || "No title"} · {draft.department || "No department"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                        {draft.employeeId} · {draft.employmentType}
                    </p>
                </div>
            </div>

            <Section title="Basic Information" onEdit={() => jumpTo(1)}>
                <Row k="Full name" v={fullName} />
                <Row k="Preferred name" v={draft.preferredName || "—"} />
                <Row k="Phone" v={draft.phone || "—"} />
                <Row k="Gender" v={draft.gender || "—"} />
            </Section>

            <Section title="Employment" onEdit={() => jumpTo(2)}>
                <Row k="Status" v={draft.employmentStatus} />
                <Row k="Type" v={draft.employmentType} />
                <Row k="Department" v={draft.department || "—"} />
                <Row k="Joining date" v={draft.joiningDate || "—"} />
                <Row k="Reporting manager" v={draft.reportingManager || "—"} />
                <Row k="Work arrangement" v={draft.workArrangement || "—"} />
            </Section>

            <Section title="Contact & Personal" onEdit={() => jumpTo(3)}>
                <Row k="Personal email" v={draft.personalEmail || "—"} />
                <Row k="City / Country" v={[draft.city, draft.country].filter(Boolean).join(", ") || "—"} />
                <Row k="Emergency contact" v={draft.emergencyName || "—"} />
            </Section>

            <Section title="Work & Attendance" onEdit={() => jumpTo(4)}>
                <Row k="Schedule" v={draft.workSchedule || "—"} />
                <Row k="Attendance eligibility" v={draft.attendanceEligibility} />
                <Row k="Overtime eligible" v={draft.overtimeEligibility ? "Yes" : "No"} />
            </Section>

            <Section title="Compensation" onEdit={() => jumpTo(5)}>
                <Row
                    k="Salary"
                    v={draft.salaryAmount ? `${draft.salaryCurrency} ${Number(draft.salaryAmount).toLocaleString()} / ${draft.payFrequency}` : "—"}
                />
                <Row k="Bank" v={draft.bankName || "—"} />
                <Row k="Payroll group" v={draft.payrollGroup || "Default"} />
            </Section>

            <Section title="Documents & Access" onEdit={() => jumpTo(6)}>
                <Row k="Login account" v={draft.createLogin ? `Yes (${draft.systemRole})` : "No"} />
                <Row k="Invitation email" v={draft.sendInvitation ? draft.loginEmail || "Yes" : "No"} />
            </Section>
        </div>
    );
}

function Section({
    title,
    onEdit,
    children,
}: {
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-700">{title}</p>
                <button
                    onClick={onEdit}
                    className="text-[11px] font-semibold text-primary hover:underline"
                >
                    Edit
                </button>
            </div>
            <div className="flex flex-col gap-1.5">{children}</div>
        </div>
    );
}

function Row({ k, v }: { k: string; v: string }) {
    return (
        <div className="flex items-start justify-between gap-4 text-xs">
            <span className="text-slate-500 shrink-0">{k}</span>
            <span className="text-slate-800 font-medium text-right wrap-break-word">{v}</span>
        </div>
    );
}