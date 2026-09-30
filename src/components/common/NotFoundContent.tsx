import Link from "next/link";

export default function NotFoundContent() {
    return (
        <div className="flex-1 flex items-center justify-center py-10 lg:py-20">
            <div className="w-full max-w-2xl text-center">
                {/* Big 404 */}
                <div className="relative inline-block">
                    <span className="text-[120px] lg:text-[160px] font-extrabold tracking-tight leading-none bg-gradient-to-br from-[#1457DC] via-[#3B7BEE] to-[#B5EE1C] bg-clip-text text-transparent select-none">
                        404
                    </span>
                    {/* Subtle floating dot accent */}
                    <span className="absolute top-6 right-4 w-3 h-3 rounded-full bg-[#B5EE1C] opacity-70" />
                    <span className="absolute bottom-10 left-2 w-2 h-2 rounded-full bg-[#1457DC] opacity-60" />
                </div>

                {/* Heading */}
                <h1 className="mt-4 text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
                    Page not found
                </h1>

                {/* Description */}
                <p className="mt-3 text-sm lg:text-base text-slate-500 max-w-md mx-auto leading-relaxed">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back on track.
                </p>

                {/* Actions */}
                <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#12151A] rounded-full text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>Back to Dashboard</span>
                    </Link>

                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-xs font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        <svg
                            className="w-3.5 h-3.5 text-slate-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Browse Projects</span>
                    </Link>
                </div>

                {/* Decorative card snippet */}
                <div className="mt-12 mx-auto max-w-md bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-slate-800">
                                Need help?
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Try searching or contact your workspace admin.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}