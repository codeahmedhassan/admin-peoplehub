"use client";

import { useRef, useState } from "react";
import {
    DOCUMENT_TYPES,
    MAX_FILE_SIZE_BYTES,
    ACCEPTED_FILE_TYPES,
    formatFileSize,
    type DocumentType,
} from "@/lib/employee-form";

type Props = {
    open: boolean;
    employeeLabel: string; // human name, for the modal heading
    onClose: () => void;
    onUploaded: () => void; // parent refetches
    uploadFn: (
        file: File,
        meta: { fileId: string; type: DocumentType; label: string }
    ) => Promise<void>;
};

export default function UploadDocumentModal({
    open,
    employeeLabel,
    onClose,
    onUploaded,
    uploadFn,
}: Props) {
    const [type, setType] = useState<DocumentType>("Employment Contract");
    const [customLabel, setCustomLabel] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const reset = () => {
        setType("Employment Contract");
        setCustomLabel("");
        setFile(null);
        setError("");
        setSubmitting(false);
    };

    const handleClose = () => {
        if (submitting) return;
        reset();
        onClose();
    };

    const handleFileChange = (f: File) => {
        if (f.size > MAX_FILE_SIZE_BYTES) {
            setError(`File is larger than ${formatFileSize(MAX_FILE_SIZE_BYTES)}`);
            return;
        }
        setFile(f);
        setError("");
    };

    const handleSubmit = async () => {
        setError("");
        if (!file) {
            setError("Please choose a file");
            return;
        }
        const label = type === "Other" ? customLabel.trim() : type;
        if (!label) {
            setError("Please name the document");
            return;
        }

        setSubmitting(true);
        try {
            const fileId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            await uploadFn(file, { fileId, type, label });
            reset();
            onUploaded();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to upload document."
            );
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">
                            Upload a document
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Add a file to {employeeLabel}.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        aria-label="Close"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-50"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <line x1="18" x2="6" y1="6" y2="18" strokeLinecap="round" />
                            <line x1="6" x2="18" y1="6" y2="18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Type */}
                    <div>
                        <label className="text-xs font-semibold text-slate-700">
                            Document type <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative mt-1">
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as DocumentType)}
                                disabled={submitting}
                                className="w-full appearance-none border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-9 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                            >
                                {DOCUMENT_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                            <svg
                                className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    d="M19 9l-7 7-7-7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                />
                            </svg>
                        </div>
                    </div>

                    {type === "Other" && (
                        <div>
                            <label className="text-xs font-semibold text-slate-700">
                                Custom name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                value={customLabel}
                                onChange={(e) => setCustomLabel(e.target.value)}
                                disabled={submitting}
                                placeholder="e.g. NDA 2024"
                                className="w-full mt-1 border border-slate-200 bg-slate-50 py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                            />
                        </div>
                    )}

                    {/* File */}
                    <div>
                        <label className="text-xs font-semibold text-slate-700">
                            File <span className="text-rose-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            disabled={submitting}
                            className="w-full mt-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 bg-slate-50 hover:bg-primary-50/30 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                {file ? (
                                    <>
                                        <p className="text-xs font-semibold text-slate-800 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs font-semibold text-slate-800">
                                            Choose a file
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Up to {formatFileSize(MAX_FILE_SIZE_BYTES)}
                                        </p>
                                    </>
                                )}
                            </div>
                        </button>
                        <input
                            ref={inputRef}
                            type="file"
                            accept={ACCEPTED_FILE_TYPES}
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileChange(f);
                                // allow re-picking the same file
                                e.target.value = "";
                            }}
                        />
                    </div>

                    {error && (
                        <p className="text-[11px] font-medium text-rose-600">
                            {error}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={submitting}
                        className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting || !file}
                        className="flex items-center gap-2 px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <>
                                <svg
                                    className="w-3.5 h-3.5 animate-spin"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                                    <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                                </svg>
                                Uploading…
                            </>
                        ) : (
                            "Upload"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}