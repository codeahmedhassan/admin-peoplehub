"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type EmployeeDetail, getInitials } from "@/lib/employee-detail";
import { employeeApi, ApiError } from "@/lib/api";
import {
    toEditable,
    diffEditable,
    validateEdit,
    type EditableEmployee,
    type EditFieldErrors,
} from "@/lib/employee-edit";
import PersonalTab from "./PersonalTab";
import EmploymentTab from "./EmploymentTab";
import CompensationTab from "./CompensationTab";
import DocumentsTab from "./DocumentsTab";
import AccessTab from "./AccessTab";
import SaveBar from "./SaveBar";
import DiscardChangesDialog from "./DiscardChangesDialog";

const TABS = [
    { key: "personal", label: "Personal", icon: "user" },
    { key: "employment", label: "Employment", icon: "briefcase" },
    { key: "compensation", label: "Compensation", icon: "wallet" },
    { key: "documents", label: "Documents", icon: "file" },
    { key: "access", label: "Access", icon: "key" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function EditEmployeeView({ employee }: { employee: EmployeeDetail }) {
    const router = useRouter();
    const original = useMemo(() => toEditable(employee), [employee]);
    const [form, setForm] = useState<EditableEmployee>(original);
    const [errors, setErrors] = useState<EditFieldErrors>({});
    const [tab, setTab] = useState<TabKey>("personal");
    const [discardOpen, setDiscardOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const dirty = useMemo(
        () => Object.keys(diffEditable(original, form)).length > 0,
        [original, form]
    );

    // Warn on tab close / refresh when there are unsaved changes
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    const update = (patch: Partial<EditableEmployee>) => {
        setForm((prev) => ({ ...prev, ...patch }));
        // Clear any errors for the fields being updated
        if (Object.keys(patch).some((k) => errors[k])) {
            setErrors((prev) => {
                const next = { ...prev };
                Object.keys(patch).forEach((k) => delete next[k]);
                return next;
            });
        }
    };

    const handleSave = async () => {
        if (saving) return;

        const fieldErrors = validateEdit(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            if (
                fieldErrors.firstName ||
                fieldErrors.lastName ||
                fieldErrors.phone ||
                fieldErrors.gender ||
                fieldErrors.personalEmail
            ) {
                setTab("personal");
            } else if (fieldErrors.department) {
                setTab("employment");
            } else if (fieldErrors.basicSalary) {
                setTab("compensation");
            }
            return;
        }

        setSaveError(null);
        setSaving(true);

        try {
            // ----- 1) Compute the field patch (JSON body) -----
            const diff = diffEditable(original, form);
            const {
                documents: diffDocuments,
                ...fieldDiff
            } = diff as typeof diff & { documents?: EditableEmployee["documents"] };

            // ----- 2) Split documents into "removed" and "new" -----
            const removedDocumentIds =
                (form.documents ?? [])
                    .filter((d) => d.isRemoved && d.fileId)
                    .map((d) => d.fileId!) ?? [];

            const newDocuments = (form.documents ?? []).filter(
                (d) => d.isNew && d.pendingFile
            );

            // ----- 3) Send PATCH if any field or removal changed -----
            const needsPatch =
                Object.keys(fieldDiff).length > 0 || removedDocumentIds.length > 0;

            if (needsPatch) {
                await employeeApi.update(employee.employeeId, {
                    ...fieldDiff,
                    ...(removedDocumentIds.length > 0
                        ? { removedDocumentIds }
                        : {}),
                });
            }

            // ----- 4) Upload new documents (one request, batched) -----
            if (newDocuments.length > 0) {
                const files: File[] = [];
                const fileMeta: { fileId: string; type: string; label: string }[] = [];
                for (const d of newDocuments) {
                    if (!d.pendingFile) continue;
                    files.push(d.pendingFile);
                    fileMeta.push({
                        fileId: d.id,           // unique per new doc
                        type: d.label,          // label doubles as type — OK
                        label: d.label,
                    });
                }
                if (files.length > 0) {
                    await employeeApi.addDocuments(
                        employee.employeeId,
                        files,
                        fileMeta
                    );
                }
            }

            setSaved(true);
            setTimeout(() => {
                router.push(`/employees/${employee.employeeId}`);
            }, 600);
        } catch (err) {
            setSaving(false);
            setSaveError(
                err instanceof ApiError
                    ? err.message
                    : "Failed to save changes. Please try again."
            );
        }
    };

    const handleCancel = () => {
        if (dirty) {
            setDiscardOpen(true);
        } else {
            router.push(`/employees/${employee.employeeId}`);
        }
    };

    const handleReset = () => {
        setForm(original);
        setErrors({});
    };

    return (
        <div className="flex flex-col gap-6 pb-24">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Link href="/" className="hover:text-slate-700 transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/employees" className="hover:text-slate-700 transition-colors">Employees</Link>
                <span>/</span>
                <Link href={`/employees/${employee.employeeId}`} className="hover:text-slate-700 transition-colors truncate">
                    {employee.name}
                </Link>
                <span>/</span>
                <span className="text-slate-700 font-semibold">Edit</span>
            </nav>

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    {employee.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-sm font-bold text-primary">
                            {getInitials(employee.name)}
                        </div>
                    )}
                    <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Editing · {employee.employeeId}
                        </p>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {employee.name}
                        </h1>
                    </div>
                </div>

                {dirty && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Unsaved changes
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-[28px] p-2 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-1 overflow-x-auto">
                    {TABS.map((t) => {
                        const hasError =
                            (t.key === "personal" &&
                                !!(errors.firstName || errors.lastName || errors.phone || errors.gender || errors.personalEmail)) ||
                            (t.key === "employment" && !!errors.department) ||
                            (t.key === "compensation" && !!errors.basicSalary);

                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={[
                                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors relative",
                                    tab === t.key
                                        ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 cursor-pointer",
                                ].join(" ")}
                            >
                                {t.label}
                                {hasError && (
                                    <span
                                        className={[
                                            "w-1.5 h-1.5 rounded-full",
                                            tab === t.key ? "bg-white" : "bg-rose-500",
                                        ].join(" ")}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                {tab === "personal" && (
                    <PersonalTab form={form} update={update} errors={errors} />
                )}
                {tab === "employment" && (
                    <EmploymentTab form={form} update={update} errors={errors} />
                )}
                {tab === "compensation" && (
                    <CompensationTab form={form} update={update} errors={errors} />
                )}
                {tab === "documents" && (
                    <DocumentsTab form={form} update={update} />
                )}
                {tab === "access" && (
                    <AccessTab form={form} update={update} />
                )}

                {/* Inline reset */}
                {dirty && (
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <p className="text-[11px] text-slate-400">
                            Changes on this page are not saved until you click <strong>Save changes</strong>.
                        </p>
                        <button
                            onClick={handleReset}
                            className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                        >
                            Reset all fields
                        </button>
                    </div>
                )}
            </div>

            {saveError && (
                <div
                    role="alert"
                    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 shadow-lg"
                >
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                    <span>{saveError}</span>
                </div>
            )}

            {/* Sticky save bar */}
            <SaveBar
                dirty={dirty}
                saved={saved}
                saving={saving}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            {/* Discard confirmation */}
            <DiscardChangesDialog
                open={discardOpen}
                onCancel={() => setDiscardOpen(false)}
                onConfirm={() => {
                    setDiscardOpen(false);
                    router.push(`/employees/${employee.employeeId}`);
                }}
            />
        </div>
    );
}