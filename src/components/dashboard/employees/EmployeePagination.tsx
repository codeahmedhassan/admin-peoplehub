"use client";

import { PAGE_SIZE_OPTIONS } from "@/lib/constants";

interface EmployeePaginationProps {
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export default function EmployeePagination({
    page,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}: EmployeePaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);

    // Compact page list: 1 … 4 5 6 … 12
    const pages: (number | "…")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("…");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push("…");
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
            {/* Left: rows per page + range */}
            <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="font-medium">Rows per page</span>
                <div className="relative">
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="appearance-none bg-white border border-slate-200 pl-3.5 pr-8 py-1.5 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <svg className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </div>
                <span className="font-medium tabular-nums">
                    {start}–{end} of {totalItems}
                </span>
            </div>

            {/* Right: page buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Previous page"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {pages.map((p, i) =>
                    p === "…" ? (
                        <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={[
                                "min-w-8 h-8 px-2 rounded-lg text-xs font-semibold transition-colors",
                                p === page
                                    ? "bg-[#1457DC] text-white shadow-sm shadow-blue-500/30"
                                    : "text-slate-600 hover:bg-slate-100 cursor-pointer",
                            ].join(" ")}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Next page"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}