"use client";

export default function SaveBar({
    dirty,
    saved,
    onSave,
    onCancel,
}: {
    dirty: boolean;
    saved: boolean;
    onSave: () => void;
    onCancel: () => void;
}) {
    if (!dirty && !saved) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-2xl">
            <div
                className={[
                    "flex items-center justify-between gap-3 rounded-2xl pl-4 pr-2 py-2 shadow-2xl border transition-colors",
                    saved
                        ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/20"
                        : "bg-text-dark border-slate-800 text-white shadow-slate-900/30",
                ].join(" ")}
            >
                <div className="flex items-center gap-2 min-w-0">
                    {saved ? (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                    )}
                    <span className="text-xs font-semibold truncate">
                        {saved ? "Changes saved" : "You have unsaved changes"}
                    </span>
                </div>

                {!saved && (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <button
                            onClick={onCancel}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-text-dark hover:bg-slate-100 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Save changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}