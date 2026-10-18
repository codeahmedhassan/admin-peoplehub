"use client";

export default function BulkActionBar({
    count,
    onClear,
    onDelete,
}: {
    count: number;
    onClear: () => void;
    onDelete: () => void;
}) {
    if (count === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 bg-text-dark text-white rounded-full pl-4 pr-2 py-2 shadow-2xl shadow-slate-900/30">
                <span className="text-xs font-semibold">
                    {count} selected
                </span>
                <span className="w-px h-4 bg-white/20" />
                <button
                    onClick={onDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Delete
                </button>
                <button
                    onClick={onClear}
                    aria-label="Clear selection"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <line x1="18" x2="6" y1="6" y2="18" strokeLinecap="round" />
                        <line x1="6" x2="18" y1="6" y2="18" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}