"use client";

import { useMemo } from "react";
import { type PayslipSettings, getVisibleComponents } from "@/lib/payslip-settings";

const SAMPLE_EMPLOYEE = {
    name: "Jane Cooper",
    id: "EMP-00042",
    department: "Engineering",
    designation: "Senior Product Designer",
    salaryAmount: 5000,
};

export default function PayslipPreview({
    settings,
    components,
    currency,
}: {
    settings: PayslipSettings;
    components: any[];
    currency: string;
}) {
    const period = "2025-01";

    const data = useMemo(() => {
        const activeComponents = components.filter((c) => c.isActive);
        const componentIdsToShow = settings.visibleComponentIds?.length > 0
            ? settings.visibleComponentIds
            : activeComponents.map(c => c.id);

        const visibleComponents = getVisibleComponents(
            { ...settings, visibleComponentIds: componentIdsToShow },
            activeComponents
        );

        const earnings = visibleComponents
            .filter((c) => c.type === "earning")
            .map((c) => {
                let amount = 0;
                if (c.code === "BASIC") amount = SAMPLE_EMPLOYEE.salaryAmount;
                else if (c.calcType === "percentage") amount = Math.round((SAMPLE_EMPLOYEE.salaryAmount * c.calcValue) / 100);
                return { name: c.name, amount };
            });

        const deductions = visibleComponents
            .filter((c) => c.type === "deduction")
            .map((c) => {
                let amount = 0;
                if (c.calcType === "percentage") amount = Math.round((SAMPLE_EMPLOYEE.salaryAmount * c.calcValue) / 100);
                return { name: c.name, amount };
            });

        const totalEarnings = earnings.reduce((s, e) => s + e.amount, 0);
        const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
        const netPay = totalEarnings - totalDeductions;

        const initials = "JC";

        return { earnings, deductions, totalEarnings, totalDeductions, netPay, initials };
    }, [settings, components]);

    const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);

    return (
        <div className="bg-[#f1f5f9] rounded-2xl border border-slate-200/60 overflow-hidden" style={{ fontSize: 12 }}>
            <div className="max-h-[calc(100vh-130px)] overflow-y-auto p-3">
                <div className="bg-white rounded-xl shadow-[0_4px_16px_rgba(15,23,42,0.06)] p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4">
                        {settings.showCompanyLogo && (
                            <div className="w-10 h-10 rounded-xl bg-[#1457dc] text-white flex items-center justify-center font-bold text-sm shrink-0">
                                C
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">Your Company Name</p>
                            <p className="text-[10px] text-slate-500">Payslip · {period}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-[9px] font-bold tracking-wider text-[#1457dc] uppercase">Payslip</p>
                            <p className="text-xs font-bold text-slate-900">{period}</p>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-[1.4fr_1fr] gap-3 mb-4">
                        <div className="border border-slate-200 rounded-[10px] p-3 bg-[#fafafa]">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Employee</p>
                            <div className="flex items-center gap-2.5 mb-2.5">
                                {settings.showEmployeePhoto && (
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-100 to-[#cef64566] text-[#1457dc] flex items-center justify-center font-bold text-xs shrink-0">
                                        {data.initials}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">{SAMPLE_EMPLOYEE.name}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{SAMPLE_EMPLOYEE.id}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-slate-200">
                                <div>
                                    <p className="text-[9px] text-slate-500">Department</p>
                                    <p className="text-[11px] font-semibold text-slate-900 truncate">{SAMPLE_EMPLOYEE.department}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-500">Designation</p>
                                    <p className="text-[11px] font-semibold text-slate-900 truncate">{SAMPLE_EMPLOYEE.designation}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-[10px] p-3 bg-[#fafafa]">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Pay period</p>
                            <div className="flex justify-between items-center text-[11px] py-1">
                                <span className="text-[10px] text-slate-500">Period</span>
                                <span className="font-semibold text-slate-900">{period}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] py-1 border-t border-dashed border-slate-200">
                                <span className="text-[10px] text-slate-500">Generated</span>
                                <span className="font-semibold text-slate-900">Today</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px] py-1 border-t border-dashed border-slate-200">
                                <span className="text-[10px] text-slate-500">Currency</span>
                                <span className="font-semibold text-slate-900">{currency}</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                        <div className="rounded-[10px] p-3 border bg-[#ecfdf5] border-[#d1fae5]">
                            <p className="text-[9px] font-bold tracking-wide uppercase mb-1 text-[#047857]">Gross Earnings</p>
                            <p className="text-sm font-extrabold text-slate-900">{currency} {fmt(data.totalEarnings)}</p>
                        </div>
                        <div className="rounded-[10px] p-3 border bg-[#fff1f2] border-[#ffe4e6]">
                            <p className="text-[9px] font-bold tracking-wide uppercase mb-1 text-[#be123c]">Deductions</p>
                            <p className="text-sm font-extrabold text-slate-900">{currency} {fmt(data.totalDeductions)}</p>
                        </div>
                        <div className="rounded-[10px] p-3 border bg-[#eff6ff] border-[#dbeafe]">
                            <p className="text-[9px] font-bold tracking-wide uppercase mb-1 text-[#1457dc]">Net Pay</p>
                            <p className="text-sm font-extrabold text-slate-900">{currency} {fmt(data.netPay)}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border border-slate-200 rounded-[10px] overflow-hidden mb-4">
                        <div className="grid grid-cols-2">
                            <div className="border-r border-slate-200">
                                <div className="bg-[#f8fafc] px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-[#047857] border-b border-slate-200">
                                    Earnings
                                </div>
                                {settings.showEarnings && data.earnings.length > 0 ? (
                                    data.earnings.map((e, i) => (
                                        <div key={i} className="grid grid-cols-[24px_1fr_auto] px-2.5 py-2 text-[11px] border-b border-dashed border-slate-200">
                                            <span className="text-[10px] text-slate-400 text-center">{i + 1}</span>
                                            <span className="text-slate-700 truncate">{e.name}</span>
                                            <span className="font-semibold text-slate-900 tabular-nums text-right">{fmt(e.amount)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-2.5 py-6 text-center text-[10px] text-slate-400 italic">No earnings</div>
                                )}
                            </div>
                            <div>
                                <div className="bg-[#f8fafc] px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-[#be123c] border-b border-slate-200">
                                    Deductions
                                </div>
                                {settings.showDeductions && data.deductions.length > 0 ? (
                                    data.deductions.map((d, i) => (
                                        <div key={i} className="grid grid-cols-[24px_1fr_auto] px-2.5 py-2 text-[11px] border-b border-dashed border-slate-200">
                                            <span className="text-[10px] text-slate-400 text-center">{i + 1}</span>
                                            <span className="text-slate-700 truncate">{d.name}</span>
                                            <span className="font-semibold text-slate-900 tabular-nums text-right">{fmt(d.amount)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-2.5 py-6 text-center text-[10px] text-slate-400 italic">No deductions</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Net Banner */}
                    <div className="bg-linear-to-br from-[#1457dc] to-[#3b7bee] text-white rounded-[10px] px-4 py-3.5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold tracking-wider uppercase opacity-85">Net Salary Transferred</p>
                            <p className="text-[10px] opacity-65 mt-0.5">As per bank details on file</p>
                        </div>
                        <p className="text-xl font-extrabold tabular-nums">{currency} {fmt(data.netPay)}</p>
                    </div>

                    {/* Footer */}
                    {settings.showFooter && settings.footerText && (
                        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-start gap-2">
                            <p className="text-[9px] text-slate-400 leading-snug">{settings.footerText}</p>
                            <p className="text-[9px] text-slate-400 shrink-0">Generated</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}