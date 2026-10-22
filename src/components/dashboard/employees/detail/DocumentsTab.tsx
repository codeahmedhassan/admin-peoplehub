"use client";

import { useState } from "react";
import { formatDate, type EmployeeDetail } from "@/lib/employee-detail";
import { employeeApi, ApiError } from "@/lib/api";
import type { DocumentType } from "@/lib/employee-form";
import UploadDocumentModal from "./UploadDocumentModal";

function formatBytes(bytes: number): string {
    if (!bytes || bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsTab({
    employee,
    onRefresh,
}: {
    employee: EmployeeDetail;
    /** Called after a successful upload so the parent can refetch. */
    onRefresh: () => void | Promise<void>;
}) {
    const docs = employee.documents ?? [];
    const [downloading, setDownloading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);

    async function handleDownload(fileId: string, fileName: string) {
        if (downloading) return;
        setDownloading(fileId);
        setError(null);
        try {
            const API_BASE_URL =
                process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
                "http://localhost:3000/api/v1";
            const res = await fetch(
                `${API_BASE_URL}/employees/${encodeURIComponent(employee.employeeId)}/documents/${encodeURIComponent(fileId)}/download`,
                { credentials: "include" }
            );
            if (!res.ok) {
                const text = await res.text();
                let msg = `Download failed (${res.status})`;
                try {
                    msg = JSON.parse(text)?.message || msg;
                } catch {
                    /* noop */
                }
                throw new ApiError(res.status, msg);
            }
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName || "document";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : "Failed to download document."
            );
        } finally {
            setDownloading(null);
        }
    }

    async function handleUpload(
        file: File,
        meta: { fileId: string; type: DocumentType; label: string }
    ) {
        // Delegate to the API. On success the parent will refetch.
        await employeeApi.addDocuments(
            employee.employeeId,
            [file],
            [{ fileId: meta.fileId, type: meta.type, label: meta.label }]
        );
    }

    return (
        <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-bold text-slate-900">Documents</h3>
                    <p className="text-[11px] text-slate-400">
                        {docs.length} file{docs.length === 1 ? "" : "s"} attached
                    </p>
                </div>
                <button
                    onClick={() => setUploadOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                    <svg
                        className="w-3.5 h-3.5"
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
                    Upload
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mb-3 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2"
                >
                    <svg
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {docs.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                        No documents yet
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Upload contracts, IDs, and certifications here.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-2">
                    {docs.map((doc) => (
                        <li
                            key={doc.fileId}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M14 2v6h6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">
                                    {doc.label}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    {formatDate(doc.uploadedAt)} · {formatBytes(doc.fileSize)}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDownload(doc.fileId, doc.fileName)}
                                disabled={downloading === doc.fileId}
                                aria-label={`Download ${doc.label}`}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {downloading === doc.fileId ? (
                                    <svg
                                        className="w-4 h-4 animate-spin"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                            strokeOpacity="0.25"
                                        />
                                        <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <UploadDocumentModal
                open={uploadOpen}
                employeeLabel={employee.name}
                onClose={() => setUploadOpen(false)}
                onUploaded={() => {
                    setUploadOpen(false);
                    void onRefresh();
                }}
                uploadFn={handleUpload}
            />
        </div>
    );
}