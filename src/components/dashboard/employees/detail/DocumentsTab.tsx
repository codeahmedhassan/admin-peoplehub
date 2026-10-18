"use client";

import { formatDate, type EmployeeDetail } from "@/lib/employee-detail";

export default function DocumentsTab({ employee }: { employee: EmployeeDetail }) {
    const docs = employee.documents ?? [];

    return (
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Documents</h3>
                    <p className="text-[11px] text-slate-400">
                        {docs.length} file{docs.length === 1 ? "" : "s"} attached
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Upload
                </button>
            </div>

            {docs.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No documents yet</p>
                    <p className="text-xs text-slate-400 mt-1">Upload contracts, IDs, and certifications here.</p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {docs.map((doc) => (
                        <li
                            key={doc.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">{doc.label}</p>
                                <p className="text-[11px] text-slate-400">
                                    {formatDate(doc.uploadedAt)} · {doc.size ?? "—"}
                                </p>
                            </div>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}