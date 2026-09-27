import { BRAND } from "@/lib/constants";

export default function DashboardHeader() {
    return (
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
                <p className="text-xs text-slate-400 font-medium">{BRAND.greeting}</p>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {BRAND.workspace}
                </h1>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 border border-slate-200 transition-colors  cursor-pointer">
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Export</span>
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-dark rounded-full text-xs font-semibold text-white shadow-sm bg-text-dark hover:bg-slate-800 transition-colors cursor-pointer">
                    <span className="text-base leading-none font-normal">+</span>
                    <span>Add new entry</span>
                </button>
            </div>
        </div>
    );
}