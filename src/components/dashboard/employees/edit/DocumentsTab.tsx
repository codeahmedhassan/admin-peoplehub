"use client";

import { useRef, useState } from "react";
import { type EditableEmployee, type EditableDocument } from "@/lib/employee-edit";
import { EditFieldShell, EditTextInput } from "./EditField";

interface Props {
    form: EditableEmployee;
    update: (patch: Partial<EditableEmployee>) => void;
}

const DOCUMENT_TYPES = [
    "Employment Contract",
    "National ID",
    "Passport",
    "CV / Résumé",
    "Degree / Certificate",
    "Offer Letter",
    "Tax Form",
    "Other",
];

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsTab({ form, update }: Props) {
    const [uploadOpen, setUploadOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [labelDraft, setLabelDraft] = useState("");

    const liveDocs = form.documents.filter((d) => !d.isRemoved);
    const removedDocs = form.documents.filter((d) => d.isRemoved);

    const handleAdd = (doc: EditableDocument) => {
        update({ documents: [...form.documents, doc] });
    };

    const handleRemove = (id: string) => {
        update({
            documents: form.documents.map((d) =>
                d.id === id
                    ? d.isNew
                        ? d // if it was never saved, we still need to filter it out
                        : { ...d, isRemoved: true }
                    : d
            ).filter((d) => !(d.id === id && d.isNew)),
        });
    };

    const handleRestore = (id: string) => {
        update({
            documents: form.documents.map((d) =>
                d.id === id ? { ...d, isRemoved: false } : d
            ),
        });
    };

    const handleRename = (id: string, newLabel: string) => {
        update({
            documents: form.documents.map((d) =>
                d.id === id ? { ...d, label: newLabel } : d
            ),
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-base font-bold text-slate-900">Documents</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Upload contracts, IDs, certificates, and other HR files. Changes are saved
                    when you click <strong>Save changes</strong>.
                </p>
            </div>

            {/* Header row */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                        {liveDocs.length} active document{liveDocs.length === 1 ? "" : "s"}
                    </span>
                    {removedDocs.length > 0 && (
                        <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            {removedDocs.length} pending removal
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setUploadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add document
                </button>
            </div>

            {/* Active docs list */}
            {liveDocs.length === 0 ? (
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No documents yet</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">
                        Add the first document to this employee&apos;s record.
                    </p>
                    <button
                        onClick={() => setUploadOpen(true)}
                        className="text-xs font-semibold text-primary hover:underline"
                    >
                        Upload a file
                    </button>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {liveDocs.map((doc) => (
                        <li
                            key={doc.id}
                            className={[
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors",
                                doc.isNew
                                    ? "border-emerald-200 bg-emerald-50/40"
                                    : "border-slate-100 hover:bg-slate-50",
                            ].join(" ")}
                        >
                            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div className="flex-1 min-w-0">
                                {editId === doc.id ? (
                                    <input
                                        value={labelDraft}
                                        onChange={(e) => setLabelDraft(e.target.value)}
                                        onBlur={() => {
                                            handleRename(doc.id, labelDraft);
                                            setEditId(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleRename(doc.id, labelDraft);
                                                setEditId(null);
                                            }
                                        }}
                                        autoFocus
                                        className="w-full bg-white border border-primary/30 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-xs font-semibold text-slate-800 truncate">
                                            {doc.label}
                                        </p>
                                        {doc.isNew && (
                                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                )}
                                <p className="text-[11px] text-slate-400 truncate">
                                    {doc.fileName} · {doc.fileSize} · {doc.uploadedAt}
                                </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={() => {
                                        setEditId(doc.id);
                                        setLabelDraft(doc.label);
                                    }}
                                    aria-label="Rename document"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleRemove(doc.id)}
                                    aria-label="Remove document"
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pending removal */}
            {removedDocs.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Pending removal
                    </p>
                    <ul className="flex flex-col gap-1.5">
                        {removedDocs.map((doc) => (
                            <li
                                key={doc.id}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-rose-100 bg-rose-50/40"
                            >
                                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-700 line-through truncate">
                                        {doc.label}
                                    </p>
                                    <p className="text-[11px] text-slate-400 truncate">
                                        Will be deleted on save
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRestore(doc.id)}
                                    className="text-[11px] font-semibold text-primary hover:underline shrink-0"
                                >
                                    Restore
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Upload modal */}
            {uploadOpen && (
                <UploadDocumentModal
                    onClose={() => setUploadOpen(false)}
                    onAdd={(doc) => {
                        handleAdd(doc);
                        setUploadOpen(false);
                    }}
                />
            )}
        </div>
    );
}

/* ---------------- Upload modal ---------------- */

function UploadDocumentModal({
    onClose,
    onAdd,
}: {
    onClose: () => void;
    onAdd: (doc: EditableDocument) => void;
}) {
    const [label, setLabel] = useState("Employment Contract");
    const [customLabel, setCustomLabel] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const effectiveLabel = label === "Other" ? customLabel.trim() : label;

    const handleSubmit = () => {
        if (!file) {
            setError("Please choose a file");
            return;
        }
        if (!effectiveLabel) {
            setError("Please name the document");
            return;
        }
        onAdd({
            id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            label: effectiveLabel,
            fileName: file.name,
            fileSize: formatBytes(file.size),
            uploadedAt: new Date().toISOString().slice(0, 10),
            isNew: true,
            pendingFile: file,      // <-- keep bytes
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Add a document</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            File will be uploaded when you save changes.
                        </p>
                    </div>
                    <button
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
                    <EditFieldShell label="Document type" required>
                        <div className="relative">
                            <select
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
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
                    </EditFieldShell>

                    {label === "Other" && (
                        <EditFieldShell label="Custom name" required>
                            <EditTextInput
                                value={customLabel}
                                onChange={setCustomLabel}
                                placeholder="e.g. NDA 2024"
                            />
                        </EditFieldShell>
                    )}

                    <EditFieldShell label="File" required>
                        <button
                            onClick={() => inputRef.current?.click()}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/40 bg-slate-50 hover:bg-primary-50/30 transition-colors text-left"
                        >
                            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                {file ? (
                                    <>
                                        <p className="text-xs font-semibold text-slate-800 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            {formatBytes(file.size)}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-xs font-semibold text-slate-800">
                                            Choose a file
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            PDF, DOCX, PNG, JPG up to 10 MB
                                        </p>
                                    </>
                                )}
                            </div>
                        </button>
                        <input
                            ref={inputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                    if (f.size > 10 * 1024 * 1024) {
                                        setError("File is larger than 10 MB");
                                        return;
                                    }
                                    setFile(f);
                                    setError("");
                                }
                            }}
                        />
                    </EditFieldShell>

                    {error && (
                        <p className="text-[11px] font-medium text-rose-600">{error}</p>
                    )}
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
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