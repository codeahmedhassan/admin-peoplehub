"use client";

import { useRef, useState } from "react";
import {
    DOCUMENT_TYPES,
    MAX_FILE_SIZE_BYTES,
    ACCEPTED_FILE_TYPES,
    formatFileSize,
    stagedFiles,
    type DocumentType,
    type StagedDocument,
} from "@/lib/employee-form";

interface Props {
    documents?: StagedDocument[];   // 👈 made optional
    onChange: (docs: StagedDocument[]) => void;
}

export default function DocumentUploader({ documents, onChange }: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    // Normalize once — everything below can trust `docs` is an array
    const docs = documents ?? [];

    const handleAdd = (doc: StagedDocument, file: File) => {
        stagedFiles.set(doc.id, file);
        onChange([...docs, doc]);
        setModalOpen(false);
    };

    const handleRemove = (id: string) => {
        stagedFiles.delete(id);
        const doc = docs.find((d) => d.id === id);
        if (doc?.previewUrl) URL.revokeObjectURL(doc.previewUrl);
        onChange(docs.filter((d) => d.id !== id));
    };

    const handleRename = (id: string, label: string) => {
        onChange(docs.map((d) => (d.id === id ? { ...d, label } : d)));
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <p className="text-xs font-bold text-slate-700">
                        Documents to attach
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                        Upload contracts, IDs, certificates. Max 10 MB per file.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add document
                </button>
            </div>

            {/* List */}
            {docs.length === 0 ? (
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary/40 hover:bg-primary-50/20 transition-colors"
                >
                    <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                        No documents yet
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                        Click to upload, or continue and add files later.
                    </p>
                </button>
            ) : (
                <ul className="flex flex-col gap-2">
                    {docs.map((doc) => (
                        <li
                            key={doc.id}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            {/* Preview / icon */}
                            {doc.previewUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={doc.previewUrl}
                                    alt={doc.fileName}
                                    className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <input
                                    value={doc.label}
                                    onChange={(e) => handleRename(doc.id, e.target.value)}
                                    className="w-full text-xs font-semibold text-slate-800 bg-transparent border-0 p-0 focus:outline-none focus:underline"
                                />
                                <p className="text-[11px] text-slate-400 truncate">
                                    {doc.fileName} · {formatFileSize(doc.fileSize)} · {doc.type}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemove(doc.id)}
                                aria-label="Remove document"
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {modalOpen && (
                <UploadModal
                    onClose={() => setModalOpen(false)}
                    onAdd={handleAdd}
                />
            )}
        </div>
    );
}

/* ---------- Modal ---------- */

function UploadModal({
    onClose,
    onAdd,
}: {
    onClose: () => void;
    onAdd: (doc: StagedDocument, file: File) => void;
}) {
    const [type, setType] = useState<DocumentType>("Employment Contract");
    const [customLabel, setCustomLabel] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>();
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (f: File) => {
        if (f.size > MAX_FILE_SIZE_BYTES) {
            setError(`File is larger than ${formatFileSize(MAX_FILE_SIZE_BYTES)}`);
            return;
        }
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setFile(f);
        setPreviewUrl(isImageFile(f) ? URL.createObjectURL(f) : undefined);
        setError("");
    };

    const handleSubmit = () => {
        if (!file) {
            setError("Please choose a file");
            return;
        }
        const label =
            type === "Other" ? customLabel.trim() : type;
        if (!label) {
            setError("Please name the document");
            return;
        }

        onAdd(
            {
                id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                type,
                label,
                fileName: file.name,
                fileSize: file.size,
                mimeType: file.type,
                previewUrl: isImageFile(file) ? previewUrl : undefined,
            },
            file
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Add a document</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            PDF, DOCX, images, or spreadsheets.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                                className="w-full appearance-none border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-9 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
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
                                placeholder="e.g. NDA 2024"
                                className="w-full mt-1 border border-slate-200 bg-slate-50 py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                            className="w-full mt-1 flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 bg-slate-50 hover:bg-primary-50/30 transition-colors text-left"
                        >
                            {previewUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            )}
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
                            }}
                        />
                    </div>

                    {error && (
                        <p className="text-[11px] font-medium text-rose-600">{error}</p>
                    )}
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                        Add document
                    </button>
                </div>
            </div>
        </div>
    );
}

function isImageFile(f: File) {
    return f.type.startsWith("image/");
}