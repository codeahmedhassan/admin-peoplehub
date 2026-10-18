"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type EmployeeDetail } from "@/lib/employee-detail";
import EmployeeHero from "./EmployeeHero";
import OverviewTab from "./OverviewTab";
import EmploymentTab from "./EmploymentTab";
import SalaryTab from "./SalaryTab";
import DocumentsTab from "./DocumentsTab";
import ActivityTab from "./ActivityTab";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

const TABS = [
    { key: "overview", label: "Overview" },
    { key: "employment", label: "Employment" },
    { key: "salary", label: "Salary" },
    { key: "documents", label: "Documents" },
    { key: "activity", label: "Activity" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function EmployeeDetailView({ employee }: { employee: EmployeeDetail }) {
    const router = useRouter();
    const [tab, setTab] = useState<TabKey>("overview");
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6 mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Link href="/" className="hover:text-slate-700 transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/employees" className="hover:text-slate-700 transition-colors">Employees</Link>
                <span>/</span>
                <span className="text-slate-700 font-semibold truncate">{employee.name}</span>
            </nav>

            <EmployeeHero
                employee={employee}
                onBack={() => router.back()}
                onEdit={() => router.push(`/employees/${employee.id}/edit`)}
                onDelete={() => setDeleteOpen(true)}
            />

            {/* Tabs bar */}
            <div className="bg-white rounded-[28px] p-2 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-1 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={[
                                "px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors",
                                tab === t.key
                                    ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 cursor-pointer",
                            ].join(" ")}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            <div>
                {tab === "overview" && <OverviewTab employee={employee} />}
                {tab === "employment" && <EmploymentTab employee={employee} />}
                {tab === "salary" && <SalaryTab employee={employee} />}
                {tab === "documents" && <DocumentsTab employee={employee} />}
                {tab === "activity" && <ActivityTab employee={employee} />}
            </div>

            <DeleteEmployeeDialog
                open={deleteOpen}
                employee={employee}
                onCancel={() => setDeleteOpen(false)}
                onConfirm={() => {
                    // Wire to API later — simulate success
                    setDeleteOpen(false);
                    router.push("/employees");
                }}
            />
        </div>
    );
}