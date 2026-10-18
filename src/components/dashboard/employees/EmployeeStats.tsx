import { type Employee } from "@/lib/constants";

export default function EmployeeStats({ employees }: { employees: Employee[] }) {
    const total = employees.length;
    const active = employees.filter((e) => e.status === "Active").length;
    const incomplete = employees.filter((e) => e.incomplete).length;
    const totalNet = employees.reduce((sum, e) => sum + e.netSalary, 0);

    const stats = [
        { label: "Total Employees", value: total.toString(), accent: "text-primary" },
        { label: "Active", value: active.toString(), accent: "text-emerald-600" },
        { label: "Incomplete Records", value: incomplete.toString(), accent: "text-amber-600" },
        { label: "Monthly Net Payroll", value: `$${totalNet.toLocaleString()}`, accent: "text-slate-900" },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-white rounded-2xl p-4 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                >
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {s.label}
                    </p>
                    <p className={`mt-1.5 text-xl font-extrabold tracking-tight ${s.accent}`}>
                        {s.value}
                    </p>
                </div>
            ))}
        </div>
    );
}