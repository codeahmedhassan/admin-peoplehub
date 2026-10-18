"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type EmployeeDetail, getInitials } from "@/lib/employee-detail";
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

    const handleSave = () => {
        const fieldErrors = validateEdit(form);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            // Jump to the tab that has the first error
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

        console.log("Saving changes:", diffEditable(original, form));
        setSaved(true);
        setTimeout(() => {
            router.push(`/employees/${employee.id}`);
        }, 600);
    };

    const handleCancel = () => {
        if (dirty) {
            setDiscardOpen(true);
        } else {
            router.push(`/employees/${employee.id}`);
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
                <Link href={`/employees/${employee.id}`} className="hover:text-slate-700 transition-colors truncate">
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
                            Editing · {employee.id}
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

            {/* Sticky save bar */}
            <SaveBar
                dirty={dirty}
                saved={saved}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            {/* Discard confirmation */}
            <DiscardChangesDialog
                open={discardOpen}
                onCancel={() => setDiscardOpen(false)}
                onConfirm={() => {
                    setDiscardOpen(false);
                    router.push(`/employees/${employee.id}`);
                }}
            />
        </div>
    );
}