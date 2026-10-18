"use client";

import { type ReactNode } from "react";

export function EditFieldShell({
    label,
    hint,
    error,
    required,
    optional,
    modified,
    children,
}: {
    label: string;
    hint?: string;
    error?: string;
    required?: boolean;
    optional?: boolean;
    modified?: boolean;
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
                {modified && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-400" title="Modified" />
                )}
            </label>
            {children}
            {hint && !error && <p className="text-[11px] text-slate-400">{hint}</p>}
            {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        </div>
    );
}

export function EditTextInput({
    value,
    onChange,
    placeholder,
    type = "text",
    modified,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    modified?: boolean;
}) {
    return (
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            className={[
                "w-full bg-slate-50 border py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition",
                modified ? "border-amber-300 bg-amber-50/30" : "border-slate-200",
            ].join(" ")}
        />
    );
}

export function EditSelectInput({
    value,
    onChange,
    options,
    placeholder,
    modified,
}: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder?: string;
    modified?: boolean;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={[
                    "w-full appearance-none border py-2.5 pl-3.5 pr-9 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition",
                    modified ? "border-amber-300 bg-amber-50/30" : "border-slate-200 bg-slate-50",
                ].join(" ")}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o} value={o}>
                        {o}
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