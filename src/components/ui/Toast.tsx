"use client";

import { useEffect, useState } from "react";

export function useToast() {
    const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

    const showToast = (message: string, type: "error" | "success" = "error") => {
        setToast({ message, type });
    };

    return { toast, showToast, setToast };
}

export function ToastContainer({
    toast,
    onClose,
}: {
    toast: { message: string; type: "error" | "success" } | null;
    onClose: () => void;
}) {
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    if (!toast) return null;

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center gap-2 transition-all animate-in slide-in-from-bottom-2 ${toast.type === "error"
                    ? "bg-rose-50 border-rose-200 text-rose-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
        >
            {toast.message}
            <button onClick={onClose} className="ml-2 hover:opacity-70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}