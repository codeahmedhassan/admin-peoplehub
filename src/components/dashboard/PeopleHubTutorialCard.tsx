import { TUTORIAL_CARD } from "@/lib/constants";

export default function PeopleHubTutorialCard() {
    return (
        <div className="rounded-[28px] p-6 shadow-card-sm border border-slate-200/50 flex flex-col justify-between relative overflow-hidden bg-linear-to-br from-[#E2ECF6] via-[#E8F3EE] to-[#E9F6E2]">
            {/* Header */}
            <div className="flex items-start justify-between relative z-10">
                <div className="max-w-50">
                    <h4 className="text-[15px] font-bold text-slate-900 leading-snug">
                        {TUTORIAL_CARD.title}
                    </h4>
                    <p className="text-[13px] font-semibold text-slate-700 leading-snug">
                        {TUTORIAL_CARD.subtitle}
                    </p>
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors shrink-0">
                    <span>{TUTORIAL_CARD.buttonLabel}</span>
                    <svg
                        className="w-3.5 h-3.5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Preview mockup */}
            <div className="relative mt-6 pt-2 pb-1 flex items-center justify-center z-10">
                <div className="w-full max-w-xs bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-white/80 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm shrink-0">
                            <svg className="w-4 h-4 ml-0.5 fill-current" viewBox="0 0 24 24">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="w-24 h-2 bg-slate-400/50 rounded-full" />
                            <div className="w-16 h-1.5 bg-slate-300/60 rounded-full" />
                        </div>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[10px] font-bold">
                        {TUTORIAL_CARD.badge}
                    </div>
                </div>
            </div>
        </div>
    );
}