"use client";

import { useState } from "react";
import { type SalaryComponent } from "@/lib/payroll";

interface Props {
    components: SalaryComponent[];
    visibleIds: string[];
    onChange: (ids: string[]) => void;
}

const typeMeta: Record<string, { bg: string; text: string; label: string }> = {
    earning: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Earning" },
    deduction: { bg: "bg-rose-50", text: "text-rose-700", label: "Deduction" },
    employer_contribution: { bg: "bg-blue-50", text: "text-blue-700", label: "Employer" },
};

export default function ComponentPicker({ components, visibleIds, onChange }: Props) {
    const [draggingId, setDraggingId] = useState<string | null>(null);

    // Visible components in the order defined by `visibleIds`, plus hidden ones at the bottom
    const ordered = [
        ...visibleIds
            .map((id) => components.find((c) => c.id === id))
            .filter((c): c is SalaryComponent => !!c),
        ...components.filter((c) => !visibleIds.includes(c.id)),
    ];

    const isVisible = (id: string) => visibleIds.includes(id);

    const toggle = (id: string) => {
        if (isVisible(id)) {
            onChange(visibleIds.filter((x) => x !== id));
        } else {
            onChange([...visibleIds, id]);
        }
    };

    const move = (id: string, direction: -1 | 1) => {
        const idx = visibleIds.indexOf(id);
        if (idx < 0) return;
        const next = [...visibleIds];
        const target = idx + direction;
        if (target < 0 || target >= next.length) return;
        [next[idx], next[target]] = [next[target], next[idx]];
        onChange(next);
    };

    const handleDragStart = (id: string) => setDraggingId(id);

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggingId || draggingId === targetId) return;
        const from = visibleIds.indexOf(draggingId);
        const to = visibleIds.indexOf(targetId);
        if (from < 0 || to < 0) return;
        const next = [...visibleIds];
        next.splice(from, 1);
        next.splice(to, 0, draggingId);
        onChange(next);
    };

    return (
        <div className="flex flex-col gap-1.5 -mx-1">
            {ordered.map((c) => {
                const visible = isVisible(c.id);
                const meta = typeMeta[c.type];
                const position = visible ? visibleIds.indexOf(c.id) : -1;

                return (
                    <div
                        key={c.id}
                        draggable={visible}
                        onDragStart={() => handleDragStart(c.id)}
                        onDragOver={(e) => visible && handleDragOver(e, c.id)}
                        onDragEnd={() => setDraggingId(null)}
                        className={[
                            "flex items-center gap-2 px-2 py-2 rounded-xl border transition-all",
                            visible
                                ? "bg-white border-slate-200 cursor-move"
                                : "bg-slate-50 border-slate-100 opacity-60",
                            draggingId === c.id ? "opacity-30" : "",
                        ].join(" ")}
                    >
                        {/* Drag handle */}
                        {visible && (
                            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="9" cy="6" r="1.5" />
                                <circle cx="15" cy="6" r="1.5" />
                                <circle cx="9" cy="12" r="1.5" />
                                <circle cx="15" cy="12" r="1.5" />
                                <circle cx="9" cy="18" r="1.5" />
                                <circle cx="15" cy="18" r="1.5" />
                            </svg>
                        )}
                        {!visible && <div className="w-3.5 shrink-0" />}

                        {/* Toggle */}
                        <button
                            onClick={() => toggle(c.id)}
                            className={[
                                "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
                                visible
                                    ? "bg-primary border-primary"
                                    : "border-slate-300 bg-white",
                            ].join(" ")}
                            aria-label={visible ? "Hide from payslip" : "Show on payslip"}
                        >
                            {visible && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        {/* Position badge */}
                        <span className="text-[10px] font-bold text-slate-400 tabular-nums w-5 text-center shrink-0">
                            {visible ? position + 1 : "—"}
                        </span>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-800 truncate">
                                    {c.name}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 tabular-nums shrink-0">
                                    {c.code}
                                </span>
                            </div>
                        </div>

                        {/* Type badge */}
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${meta.bg} ${meta.text} shrink-0`}>
                            {meta.label}
                        </span>

                        {/* Reorder buttons (mobile-friendly) */}
                        {visible && (
                            <div className="flex flex-col shrink-0">
                                <button
                                    onClick={() => move(c.id, -1)}
                                    disabled={position === 0}
                                    className="w-5 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                    aria-label="Move up"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <polyline points="18 15 12 9 6 15" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => move(c.id, 1)}
                                    disabled={position === visibleIds.length - 1}
                                    className="w-5 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                    aria-label="Move down"
                                >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}