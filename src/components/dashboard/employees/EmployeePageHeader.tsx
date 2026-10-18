"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmployeePageHeader() {
    const [exportOpen, setExportOpen] = useState(false);
    const router = useRouter();

    return (
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <p className="text-xs text-slate-400 font-medium">People</p>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Employees
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    Manage your team members, salaries, and departments.
                </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
                {/* Bulk Add */}
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" strokeLinecap="round" />
                    </svg>
                    <span>Bulk Add</span>
                </button>

                {/* Export dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setExportOpen((v) => !v)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Export</span>
                        <svg className={`w-3 h-3 text-slate-400 transition-transform ${exportOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                        </svg>
                    </button>

                    {exportOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setExportOpen(false)} />
                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl border border-slate-200 shadow-xl z-20 p-1.5">
                                {["CSV", "XLSX", "JSON"].map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setExportOpen(false)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                    >
                                        <span className="w-7 h-7 rounded-lg bg-primary-50 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                                            {fmt === "JSON" ? "{ }" : fmt[0]}
                                        </span>
                                        <span>Export as {fmt}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Add Employee — primary */}
                <button
                    onClick={() => router.push("/employees/add")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-text-dark rounded-full text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <span className="text-base leading-none font-normal">+</span>
                    <span>Add Employee</span>
                </button>
            </div>
        </div>
    );
}