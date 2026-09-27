"use client";

import { BRAND, CURRENT_USER, MENU_ITEMS, PROFILE_SUB_ITEMS } from "@/lib/constants";
import SidebarIcon from "./SidebarIcon";
import Image from "next/image";
import { useSidebar } from "./SidebarContext";
import Link from "next/link";

export default function Sidebar() {
    const { collapsed, mobileOpen, toggleCollapsed, closeMobile } = useSidebar();

    return (
        <>
            {/* Mobile backdrop */}
            <div
                aria-hidden={!mobileOpen}
                onClick={closeMobile}
                className={`fixed z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            />

            <aside
                data-collapsed={collapsed}
                className={[
                    "group/sidebar flex flex-col",
                    "fixed z-50 top-0 left-0 h-screen p-4",
                    "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
                    collapsed ? "lg:w-18" : "lg:w-57.5",
                    mobileOpen ? "translate-x-0" : "-translate-x-full",
                    "transition-[width,transform] duration-300 ease-in-out will-change-[width,transform]",
                    "shrink-0"
                ].join(" ")}
            >
                <div
                    className={[
                        "flex flex-col h-full w-full",
                        "bg-[#F1F3F7] lg:bg-transparent",
                        "rounded-2xl lg:rounded-none",
                        "justify-between"
                    ].join(" ")}
                >
                    <div className={["flex flex-col gap-7", collapsed ? "lg:gap-5" : ""].join(" ")}>
                        {/* ================= Logo / Toggle ================= */}
                        <div
                            className={[
                                "flex items-center pt-1",
                                collapsed ? "lg:justify-center px-0" : "justify-between px-2"
                            ].join(" ")}
                        >
                            {/* Logo — when collapsed, becomes the expand button on hover */}
                            <button
                                type="button"
                                aria-label={collapsed ? "Expand sidebar" : "Go to dashboard"}
                                onClick={collapsed ? toggleCollapsed : undefined}
                                className={[
                                    "relative flex items-center justify-center rounded-xl transition-all duration-300",
                                    "w-9 h-9 shrink-0",
                                    collapsed
                                        ? "cursor-pointer hover:bg-white hover:shadow-md"
                                        : "cursor-default"
                                ].join(" ")}
                            >
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={24}
                                    height={24}
                                    className={[
                                        "transition-all duration-300",
                                        collapsed ? "group-hover/sidebar:opacity-0" : ""
                                    ].join(" ")}
                                />

                                {collapsed && (
                                    <svg
                                        className="absolute inset-0 m-auto w-4.5 h-4.5 text-slate-600 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.2}
                                        viewBox="0 0 24 24"
                                    >
                                        <rect height="16" rx="4" width="18" x="3" y="4" />
                                        <line x1="9" x2="9" y1="4" y2="20" />
                                        <polyline points="14 9 17 12 14 15" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>

                            {/* Brand name + collapse button — hidden when collapsed */}
                            <div
                                className={[
                                    "flex items-center justify-between flex-1 overflow-hidden transition-all duration-300",
                                    collapsed
                                        ? "lg:max-w-0 lg:opacity-0 lg:ml-0"
                                        : "max-w-50 opacity-100 ml-2"
                                ].join(" ")}
                            >
                                <span className="font-bold text-xl text-slate-900 tracking-tight whitespace-nowrap">
                                    {BRAND.name}
                                </span>

                                <button
                                    type="button"
                                    aria-label="Collapse sidebar"
                                    onClick={toggleCollapsed}
                                    className="hidden lg:flex text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer shrink-0"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <rect height="16" rx="4" width="18" x="3" y="4" />
                                        <line x1="15" x2="15" y1="4" y2="20" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    aria-label="Close sidebar"
                                    onClick={closeMobile}
                                    className="lg:hidden text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer shrink-0"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <line x1="18" x2="6" y1="6" y2="18" strokeLinecap="round" />
                                        <line x1="6" x2="18" y1="6" y2="18" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* ================= Navigation ================= */}
                        <nav className="flex flex-col gap-1">
                            {/* Section label */}
                            <span
                                className={[
                                    "text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 transition-all duration-300 overflow-hidden whitespace-nowrap",
                                    collapsed ? "lg:opacity-0 lg:h-0 lg:mb-0 lg:px-0 px-3" : "px-3 opacity-100"
                                ].join(" ")}
                            >
                                MENU
                            </span>

                            {/* Dashboard */}
                            <NavLink
                                href="#"
                                icon="dashboard"
                                label="Dashboard"
                                collapsed={collapsed}
                            />

                            {/* ============ Active Profile Group ============ */}
                            <div
                                className={[
                                    "mt-1 relative flex flex-col bg-[#1457DC] text-white shadow-lg shadow-blue-500/20",
                                    "transition-all duration-300 ease-out will-change-[border-radius,padding]",
                                    collapsed
                                        ? "lg:rounded-[22px] lg:p-0 p-1 rounded-2xl"
                                        : "lg:rounded-2xl lg:p-1 p-1 rounded-2xl",
                                ].join(" ")}
                            >
                                {/* Profile header row */}
                                <div
                                    className={[
                                        "relative flex items-center cursor-pointer transition-all duration-300",
                                        collapsed
                                            ? "lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5"
                                            : "justify-between px-3 py-2.5"
                                    ].join(" ")}
                                >
                                    {/* Left: icon + label — becomes absolute-centered when collapsed */}
                                    <div
                                        className={[
                                            "flex items-center transition-all duration-300",
                                            collapsed
                                                ? "lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:gap-0 gap-3"
                                                : "gap-3",
                                        ].join(" ")}
                                    >
                                        <div className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center shrink-0">
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2.2}
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <span
                                            className={[
                                                "text-[14px] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 overflow-hidden",
                                                collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-30 opacity-100"
                                            ].join(" ")}
                                        >
                                            People
                                        </span>
                                    </div>

                                    {/* Right: chevron — hides when collapsed */}
                                    <svg
                                        className={[
                                            "w-4 h-4 text-white/80 transition-all duration-300 shrink-0 overflow-hidden",
                                            collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-4 opacity-100"
                                        ].join(" ")}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* Sub-items — hidden when collapsed */}
                                <div
                                    className={[
                                        "flex flex-col gap-0.5 text-white/80 text-[13px] font-medium transition-all duration-300 overflow-hidden",
                                        collapsed
                                            ? "lg:max-h-0 lg:opacity-0 lg:pb-0 lg:pt-0 px-1.5 pb-2 pt-0.5"
                                            : "max-h-75 opacity-100 px-1.5 pb-2 pt-0.5"
                                    ].join(" ")}
                                >
                                    {PROFILE_SUB_ITEMS.map((item) => (
                                        <a
                                            key={item.label}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
                                            href={item.href}
                                        >
                                            <SidebarIcon name={item.icon} />
                                            {item.label}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Remaining menu items */}
                            {MENU_ITEMS.slice(1).map((item) => (
                                <NavLink
                                    key={item.label}
                                    href={item.href}
                                    icon={item.icon}
                                    label={item.label}
                                    collapsed={collapsed}
                                />
                            ))}
                        </nav>
                    </div>

                    {/* ================= Bottom user card ================= */}
                    <div
                        className={[
                            "relative bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm cursor-pointer hover:bg-white transition-all duration-300 flex items-center",
                            collapsed
                                ? "lg:justify-center lg:p-2 p-2.5 justify-between"
                                : "p-2.5 justify-between"
                        ].join(" ")}
                    >
                        {/* Avatar + text wrapper — becomes absolute-centered when collapsed */}
                        <div
                            className={[
                                "flex items-center overflow-hidden min-w-0 transition-all duration-300",
                                collapsed
                                    ? "lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:gap-0 gap-2.5"
                                    : "gap-2.5",
                            ].join(" ")}
                        >
                            <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-amber-100 border border-slate-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    alt={CURRENT_USER.name}
                                    className="w-full h-full object-cover"
                                    src={CURRENT_USER.avatar}
                                />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                            </div>
                            <div
                                className={[
                                    "flex flex-col truncate transition-all duration-300 overflow-hidden",
                                    collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-35 opacity-100"
                                ].join(" ")}
                            >
                                <span className="text-xs font-bold text-slate-900 leading-tight truncate">
                                    {CURRENT_USER.name}
                                </span>
                                <span className="text-[11px] text-slate-400 font-medium truncate">
                                    {CURRENT_USER.email}
                                </span>
                            </div>
                        </div>

                        {/* Chevron */}
                        <svg
                            className={[
                                "w-4 h-4 text-slate-400 shrink-0 transition-all duration-300",
                                collapsed ? "lg:max-w-0 lg:opacity-0 ml-0" : "ml-1"
                            ].join(" ")}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M9 5l7 7-7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                    </div>
                </div>
            </aside>
        </>
    );
}

/* ---------------- Shared Nav Link ---------------- */
function NavLink({
    href,
    icon,
    label,
    collapsed,
}: {
    href: string;
    icon: string;
    label: string;
    collapsed: boolean;
}) {
    return (
        <Link
            href={href}
            title={collapsed ? label : undefined}
            className={[
                "group/nav relative flex items-center rounded-xl text-[14px] font-medium text-slate-600 hover:bg-white/60 transition-colors",
                collapsed
                    ? "lg:justify-center lg:px-0 lg:py-3 gap-3.5 px-3.5 py-2.5"
                    : "gap-3.5 px-3.5 py-2.5",
            ].join(" ")}
        >
            {/* Icon wrapper — becomes absolute-centered when collapsed */}
            <span
                className={[
                    "flex items-center shrink-0 transition-all duration-300",
                    collapsed
                        ? "lg:absolute lg:left-1/2 lg:-translate-x-1/2"
                        : "",
                ].join(" ")}
            >
                <SidebarIcon name={icon} className="w-4.5 h-4.5 text-slate-500 shrink-0" />
            </span>

            <span
                className={[
                    "whitespace-nowrap transition-all duration-300 overflow-hidden",
                    collapsed ? "lg:max-w-0 lg:opacity-0" : "max-w-35 opacity-100",
                ].join(" ")}
            >
                {label}
            </span>
        </Link>
    );
}