"use client";

import { useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (name: string, location: string) => Promise<void>;
    generatedKey: string | null;
}

export default function AddDeviceModal({ open, onClose, onSave, generatedKey }: Props) {
    const [name, setName] = useState("");
    const [location, setLocation] = useState(""); // Now a text input
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClose = () => {
        setName("");
        setLocation("");
        setError("");
        setCopied(false);
        onClose();
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Device name is required");
            return;
        }
        setError("");
        setSaving(true);
        try {
            await onSave(name.trim(), location.trim());
        } catch (err: any) {
            setError(err.message || "Failed to create device");
        } finally {
            setSaving(false);
        }
    };

    const handleCopy = async () => {
        if (!generatedKey) return;
        try {
            await navigator.clipboard.writeText(generatedKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setError("Copy failed — select and copy manually");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
                {!generatedKey ? (
                    <>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Add a new device</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    An API key will be generated for this device.
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={saving}
                                aria-label="Close"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <line x1="18" x2="6" y1="6" y2="18" strokeLinecap="round" />
                                    <line x1="6" x2="18" y1="6" y2="18" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-700">
                                    Device name <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError("");
                                    }}
                                    disabled={saving}
                                    placeholder="e.g. Front Entrance Terminal"
                                    autoFocus
                                    className="w-full mt-1 border border-slate-200 bg-slate-50 py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-700">
                                    Location
                                </label>
                                <input
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    disabled={saving}
                                    placeholder="e.g. Ground Floor"
                                    className="w-full mt-1 border border-slate-200 bg-slate-50 py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 disabled:opacity-60"
                                />
                            </div>

                            {error && (
                                <p className="text-[11px] font-medium text-rose-600">{error}</p>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                onClick={handleClose}
                                disabled={saving}
                                className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                {saving ? "Saving…" : "Save device"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">
                                    Device added successfully
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Copy the API key below before closing this dialog.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                API key
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs font-mono text-slate-800 break-all select-all">
                                    {generatedKey}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className={[
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors shrink-0",
                                        copied
                                            ? "bg-emerald-500 text-white"
                                            : "bg-text-dark text-white hover:bg-slate-800",
                                    ].join(" ")}
                                >
                                    {copied ? (
                                        <>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                            </svg>
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 p-3">
                            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                                This key will only be shown once. If you lose it, you must revoke the device
                                and create a new one.
                            </p>
                        </div>

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <button
                                onClick={handleCopy}
                                disabled={copied}
                                className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Copy again
                            </button>
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}