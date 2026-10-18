"use client";

import { type EmployeeDetail } from "@/lib/employee-detail";

export default function DeleteEmployeeDialog({
    open,
    employee,
    onCancel,
    onConfirm,
}: {
    open: boolean;
    employee: EmployeeDetail;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-sm w-full p-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="min-w-0 pt-0.5">
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            Delete {employee.name}?
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            This action cannot be undone. All records, documents, and access
                            will be permanently removed.
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-rose-600 rounded-full text-xs font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}