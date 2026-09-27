"use client";

import { CURRENT_USER } from "@/lib/constants";
import { useSidebar } from "./SidebarContext";

export default function Navbar() {
    const { toggleMobile } = useSidebar();

    return (
        <header className="sticky top-0 z-30 -mx-4 lg:-mx-6 px-4 lg:px-6 py-3 lg:py-4 bg-[#F1F3F7]/80 backdrop-blur-md flex items-center justify-between gap-4 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 min-w-0 max-w-xl">
                {/* Mobile hamburger */}
                <button
                    type="button"
                    aria-label="Open menu"
                    onClick={toggleMobile}
                    className="lg:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors shrink-0"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <line x1="3" x2="21" y1="6" y2="6" strokeLinecap="round" />
                        <line x1="3" x2="21" y1="12" y2="12" strokeLinecap="round" />
                        <line x1="3" x2="21" y1="18" y2="18" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="relative flex-1 min-w-0">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" strokeWidth={2} />
                            <line strokeWidth={2} x1="21" x2="16.65" y1="21" y2="16.65" />
                        </svg>
                    </span>
                    <input
                        className="w-full bg-white border-0 py-2.5 pl-11 pr-4 rounded-full text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="Search"
                        type="text"
                    />
                </div>

                <button
                    aria-label="Voice search"
                    className="hidden sm:flex w-10 h-10 rounded-full bg-white items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Theme toggle */}
                <div className="hidden md:flex items-center bg-white p-1 rounded-full shadow-sm">
                    <button
                        aria-label="Light mode"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" x2="12" y1="1" y2="3" />
                            <line x1="12" x2="12" y1="21" y2="23" />
                            <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
                            <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
                            <line x1="1" x2="3" y1="12" y2="12" />
                            <line x1="21" x2="23" y1="12" y2="12" />
                            <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
                            <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
                        </svg>
                    </button>
                    <button
                        aria-label="Dark mode"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Notifications */}
                <button
                    aria-label="Notifications"
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {/* User pill */}
                <div className="flex items-center gap-3 bg-white pl-1.5 pr-2 sm:pr-3 py-1 rounded-full shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            alt={CURRENT_USER.name}
                            className="w-full h-full object-cover"
                            src={CURRENT_USER.avatar}
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                            {CURRENT_USER.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                            {CURRENT_USER.email}
                        </span>
                    </div>
                    <svg
                        className="hidden sm:block w-3.5 h-3.5 text-slate-400 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                </div>
            </div>
        </header>
    );
}