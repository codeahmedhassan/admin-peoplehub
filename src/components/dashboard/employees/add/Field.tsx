"use client";

import { type ReactNode } from "react";

export function FieldShell({
    label,
    hint,
    error,
    required,
    optional,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    optional?: boolean;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                {label}
                {required && <span className="text-rose-500">*</span>}
                {optional && (
                    <span className="text-[10px] font-medium text-slate-400 ml-0.5">(optional)</span>
                )}
            </label>
            {children}
            {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
            {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        </div>
    );
}

export function TextInput({
    value,
    onChange,
    placeholder,
    type = "text",
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
}) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
        />
    );
}

export function SelectInput({
    value,
    onChange,
    options,
    placeholder,
    disabled,
}: {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[] | string[];
    placeholder?: string;
    disabled?: boolean;
}) {
    const normalized = options.map((o) =>
        typeof o === "string" ? { value: o, label: o } : o
    );
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full appearance-none bg-slate-50 border border-slate-200 py-2.5 pl-3.5 pr-9 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
                {placeholder && <option value="">{placeholder}</option>}
                {normalized.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
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
    );
}

export function Toggle({
    checked,
    onChange,
    label,
    description,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    description?: string;
}) {
    return (
        <label className="flex items-start gap-3 cursor-pointer select-none">
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={[
                    "relative w-10 h-6 rounded-full transition-colors shrink-0 mt-0.5",
                    checked ? "bg-[#1457DC]" : "bg-slate-300",
                ].join(" ")}
            >
                <span
                    className={[
                        "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                        checked ? "translate-x-4" : "translate-x-0",
                    ].join(" ")}
                />
            </button>
            <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-800">{label}</span>
                {description && <span className="text-[11px] text-slate-400 mt-0.5">{description}</span>}
            </div>
        </label>
    );
}