"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    validateStep,
    type StepFieldErrors,
} from "@/lib/employee-form";
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

    const handleSubmit = () => {
        console.log("Submitting employee:", draft);
        clearDraft();
        router.push("/employees");
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

                        {/* Footer nav */}
                        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                            <button
                                onClick={goBack}
                                disabled={step === 1}
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
                                        className="flex items-center gap-2 px-5 py-2.5 bg-text-dark rounded-full text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Create Employee
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