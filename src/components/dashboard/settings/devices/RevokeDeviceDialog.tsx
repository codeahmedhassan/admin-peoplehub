"use client";

import { type Device } from "@/lib/devices";

interface Props {
    device: Device | null;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function RevokeDeviceDialog({ device, onCancel, onConfirm }: Props) {
    if (!device) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-sm w-full p-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="min-w-0 pt-0.5">
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            Revoke {device.name}?
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            The device will immediately lose access. Its API key will be invalidated
                            and all employee mappings will be preserved but inactive.
                        </p>
                    </div>
                </div>
                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-rose-600 rounded-full text-xs font-semibold text-white hover:bg-rose-700 transition-colors"
                    >
                        Revoke device
                    </button>
                </div>
            </div>
        </div>
    );
}