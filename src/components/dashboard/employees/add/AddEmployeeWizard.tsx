"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    stagedFiles,
    validateStep,
    type StepFieldErrors,
} from "@/lib/employee-form";
import { employeeApi } from "@/lib/api";
import { useDraftPersistence } from "./useDraftPersistence";
import BasicStep from "./BasicStep";
import EmploymentStep from "./EmploymentStep";
import ContactStep from "./ContactStep";
import WorkAttendanceStep from "./WorkAttendanceStep";
import CompensationStep from "./CompensationStep";
import DocumentsAccessStep from "./DocumentsAccessStep";
import ReviewStep from "./ReviewStep";

export const WIZARD_STEPS = [
    { id: 1, title: "Basic Information", hint: "Name, phone, ID" },
    { id: 2, title: "Employment Details", hint: "Role, department, date" },
    { id: 3, title: "Contact & Personal", hint: "Optional details" },
    { id: 4, title: "Work & Attendance", hint: "Shift, location" },
    { id: 5, title: "Compensation", hint: "Salary, payroll" },
    { id: 6, title: "Documents & Access", hint: "Files, login" },
    { id: 7, title: "Review & Submit", hint: "Final check" },
];

export default function AddEmployeeWizard() {
    const router = useRouter();
    const { ready, step, setStep, draft, updateDraft, lastSavedAt, clearDraft } =
        useDraftPersistence();
    const [errors, setErrors] = useState<StepFieldErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const isReview = step === 7;

    const savedLabel = useMemo(() => {
        if (!lastSavedAt) return "Draft not saved yet";
        const sec = Math.floor((Date.now() - lastSavedAt) / 1000);
        if (sec < 5) return "Saved just now";
        if (sec < 60) return `Saved ${sec}s ago`;
        const min = Math.floor(sec / 60);
        return `Saved ${min}m ago`;
    }, [lastSavedAt]);

    if (!ready || !draft) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
        );
    }

    const goNext = () => {
        const fieldErrors = validateStep(step, draft);
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;
        if (step < 7) setStep(step + 1);
    };

    const goBack = () => {
        if (step > 1) {
            setErrors({});
            setStep(step - 1);
        }
    };

    const jumpTo = (target: number) => {
        setErrors({});
        setStep(target);
    };

    const handleSubmit = async () => {
        setSubmitError(null);
        setSubmitting(true);

        try {
            // Build the payload — one object that matches the backend Joi schema
            const payload = {
                firstName: draft.firstName.trim(),
                lastName: draft.lastName.trim(),
                phone: draft.phone.trim(),
                preferredName: draft.preferredName.trim(),
                gender: draft.gender,
                avatar: draft.avatar,
                manuallyPickedAvatar: draft.manuallyPickedAvatar,

                employmentStatus: draft.employmentStatus,
                employmentType: draft.employmentType,
                designation: draft.designation.trim(),
                department: draft.department,
                reportingManager: draft.reportingManager,
                joiningDate: draft.joiningDate,
                workLocation: draft.workLocation,
                workArrangement: draft.workArrangement,
                probationEndDate: draft.probationEndDate || null,
                contractEndDate: draft.contractEndDate || null,
                employeeCategory: draft.employeeCategory,

                personalEmail: draft.personalEmail.trim(),
                dateOfBirth: draft.dateOfBirth || null,
                residentialAddress: draft.residentialAddress.trim(),
                city: draft.city.trim(),
                country: draft.country.trim(),
                emergencyName: draft.emergencyName.trim(),
                emergencyRelation: draft.emergencyRelation.trim(),
                emergencyPhone: draft.emergencyPhone.trim(),

                workSchedule: draft.workSchedule.trim(),
                weeklyWorkingDays: draft.weeklyWorkingDays,
                attendanceLocation: draft.attendanceLocation.trim(),
                attendanceMethod: draft.attendanceMethod,
                attendanceEligibility: draft.attendanceEligibility,
                overtimeEligibility: draft.overtimeEligibility,
                timeZone: draft.timeZone,

                salaryAmount: Number(draft.salaryAmount),
                salaryCurrency: draft.salaryCurrency,
                payFrequency: draft.payFrequency,
                bankAccountName: draft.bankAccountName.trim(),
                bankAccountNumber: draft.bankAccountNumber.trim(),
                bankName: draft.bankName.trim(),
                taxIdentifier: draft.taxIdentifier.trim(),
                payrollGroup: draft.payrollGroup,

                nationalId: draft.nationalId.trim(),

                createLogin: draft.createLogin,
                loginEmail: draft.loginEmail.trim().toLowerCase(),
                systemRole: draft.systemRole,
                sendInvitation: draft.sendInvitation,
            };

            // Build file list + metadata, aligned by index
            const files: File[] = [];
            const fileMeta: { fileId: string; type: string; label: string }[] = [];
            for (const doc of draft.documents) {
                const file = stagedFiles.get(doc.id);
                if (!file) {
                    setSubmitError(
                        `The file "${doc.label}" was lost. Please re-upload it before submitting.`
                    );
                    setSubmitting(false);
                    return;
                }
                files.push(file);
                fileMeta.push({ fileId: doc.id, type: doc.type, label: doc.label });
            }

            const { employee } = await employeeApi.create(payload, files, fileMeta);

            // Success — clean up
            draft.documents.forEach((d) => {
                if (d.previewUrl) URL.revokeObjectURL(d.previewUrl);
            });
            stagedFiles.clear();
            clearDraft();

            router.push(`/employees`);
        } catch (err) {
            setSubmitting(false);
            setSubmitError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while saving the employee."
            );
        }
    };

    const handleSaveAndExit = () => {
        router.push("/employees");
    };

    const handleDiscard = () => {
        if (!confirm("Discard this draft? Your progress will be lost.")) return;
        clearDraft();
        router.push("/employees");
    };

    return (
        <div className="flex flex-col gap-6 mb-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                        <Link href="/employees" className="hover:text-slate-700 transition-colors">
                            Employees
                        </Link>
                        <span>/</span>
                        <span className="text-slate-700 font-semibold">Add new</span>
                    </nav>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Add a new employee
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                        </svg>
                        {savedLabel} · Progress is stored on this device
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDiscard}
                        className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors px-2 cursor-pointer"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSaveAndExit}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M17 21v-8H7v8M7 3v5h8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Save & exit
                    </button>
                </div>
            </div>

            {/* Main grid: stepper + form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left stepper */}
                <aside className="lg:col-span-3 lg:sticky lg:top-20">
                    <div className="bg-white rounded-[28px] p-4 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">
                            Progress
                        </p>
                        <ol className="flex flex-col gap-0.5">
                            {WIZARD_STEPS.map((s, idx) => {
                                const isCurrent = step === s.id;
                                const isDone = step > s.id;
                                return (
                                    <li key={s.id}>
                                        <button
                                            onClick={() => jumpTo(s.id)}
                                            className={[
                                                "w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors",
                                                isCurrent ? "bg-[#1457DC]/10" : "hover:bg-slate-50",
                                            ].join(" ")}
                                        >
                                            <span
                                                className={[
                                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors",
                                                    isCurrent
                                                        ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30"
                                                        : isDone
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-slate-100 text-slate-500",
                                                ].join(" ")}
                                            >
                                                {isDone ? (
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                ) : (
                                                    idx + 1
                                                )}
                                            </span>
                                            <div className="flex flex-col min-w-0">
                                                <span
                                                    className={[
                                                        "text-xs font-semibold truncate",
                                                        isCurrent ? "text-[#1457DC]" : "text-slate-700",
                                                    ].join(" ")}
                                                >
                                                    {s.title}
                                                </span>
                                                <span className="text-[10px] text-slate-400 truncate">{s.hint}</span>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>

                        <div className="mt-4 pt-4 border-t border-slate-100 px-2">
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                <span className="font-semibold text-slate-600">Tip:</span> Only 4 fields are
                                required. Everything else can be filled later.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Right form */}
                <div className="lg:col-span-9">
                    <div className="bg-white rounded-[28px] p-6 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        {step === 1 && (
                            <BasicStep draft={draft} update={updateDraft} errors={errors} />
                        )}
                        {step === 2 && (
                            <EmploymentStep draft={draft} update={updateDraft} errors={errors} />
                        )}
                        {step === 3 && <ContactStep draft={draft} update={updateDraft} />}
                        {step === 4 && <WorkAttendanceStep draft={draft} update={updateDraft} />}
                        {step === 5 && (
                            <CompensationStep draft={draft} update={updateDraft} errors={errors} />
                        )}
                        {step === 6 && (
                            <DocumentsAccessStep draft={draft} update={updateDraft} errors={errors} />
                        )}
                        {step === 7 && <ReviewStep draft={draft} jumpTo={jumpTo} />}

                        {submitError && (
                            <div
                                role="alert"
                                className="mt-6 flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3"
                            >
                                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                </svg>
                                <span>{submitError}</span>
                            </div>
                        )}

                        {/* Footer nav */}
                        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                            <button
                                onClick={goBack}
                                disabled={step === 1 || submitting}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                                    Step {step} of {WIZARD_STEPS.length}
                                </span>
                                {isReview ? (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-text-dark rounded-full text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
                                                    <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                                                </svg>
                                                Saving…
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Create Employee
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={goNext}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-text-dark rounded-full text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                                    >
                                        Continue
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}