import { RECENT_PAYROLL, type PayrollStatus } from "@/lib/constants";

const statusStyles: Record<PayrollStatus, string> = {
    Completed: "bg-[#E8EEFB] text-[#1457DC]",
    Delayed: "bg-[#FDF0E7] text-[#D97706]",
};

export default function RecentPayrollTable() {
    return (
        <div className="bg-white rounded-[28px] p-6 shadow-card-sm border border-slate-200/50">
            <h3 className="text-base font-bold text-slate-900 mb-4">Recent payroll</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-transparent">
                            <th className="py-2 pl-2 w-10">NO</th>
                            <th className="py-2">FULL NAME</th>
                            <th className="py-2">POSITION</th>
                            <th className="py-2">DATE</th>
                            <th className="py-2 pr-2 text-right">STATUS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {RECENT_PAYROLL.map((row) => (
                            <tr key={row.no} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 pl-2 font-semibold text-slate-700">{row.no}</td>
                                <td className="py-3">
                                    <div className="flex items-center gap-2.5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            alt={row.name}
                                            className="w-7 h-7 rounded-full object-cover"
                                            src={row.avatar}
                                        />
                                        <span className="font-semibold text-slate-800">{row.name}</span>
                                    </div>
                                </td>
                                <td className="py-3 text-slate-500 font-medium">{row.position}</td>
                                <td className="py-3 text-slate-600 font-medium">{row.date}</td>
                                <td className="py-3 pr-2 text-right">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${statusStyles[row.status]}`}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}