"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER_ROLE, type SystemRole } from "@/lib/settings";

interface SettingTab {
    key: string;
    label: string;
    href: string;
    icon: "building" | "user" | "lock" | "users" | "device" | "bell" | "plug" | "file";
    adminOnly?: boolean;
}

const TABS: SettingTab[] = [
    { key: "company", label: "Company Profile", href: "/settings/company", icon: "building", adminOnly: true },
    { key: "financial", label: "Financial & Payroll", href: "/settings/financial", icon: "building", adminOnly: true },
    { key: "attendance", label: "Attendance & Leave", href: "/settings/attendance-rules", icon: "device", adminOnly: true },
    { key: "modules", label: "Workspace Modules", href: "/settings/modules", icon: "plug", adminOnly: true },

    { key: "profile", label: "My Profile", href: "/settings/profile", icon: "user" },

    { key: "security", label: "Security", href: "/settings/security", icon: "lock" },

    { key: "roles", label: "Access & Roles", href: "/settings/roles", icon: "users", adminOnly: true },
    { key: "devices", label: "Devices", href: "/settings/devices", icon: "device", adminOnly: true },
    { key: "integrations", label: "Integrations", href: "/settings/integrations", icon: "plug", adminOnly: true },

    { key: "notifications", label: "Notifications", href: "/settings/notifications", icon: "bell" },
    { key: "payslip", label: "Payslip Design", href: "/settings/payslip", icon: "file", adminOnly: true },
];

const isAdmin = (role: SystemRole) => role === "Admin" || role === "HR";

export default function SettingsTabs() {
    const pathname = usePathname();
    const visibleTabs = TABS.filter(
        (t) => !t.adminOnly || isAdmin(CURRENT_USER_ROLE)
    );

    // Split into groups
    const orgTabs = visibleTabs.filter((t) =>
        ["company", "financial", "attendance", "modules"].includes(t.key)
    );
    const personalTabs = visibleTabs.filter((t) =>
        ["profile", "security", "notifications"].includes(t.key)
    );
    const adminTabs = visibleTabs.filter((t) =>
        ["roles", "devices", "integrations"].includes(t.key)
    );

    return (
        <aside className="w-full xl:w-56 shrink-0">
            <nav className="flex flex-col gap-6">
                <Group title="Organization" tabs={orgTabs} pathname={pathname} />
                <Group title="Personal" tabs={personalTabs} pathname={pathname} />
                <Group title="Access & Roles" tabs={adminTabs} pathname={pathname} />
            </nav>
        </aside>
    );
}

function Group({
    title,
    tabs,
    pathname,
}: {
    title: string;
    tabs: SettingTab[];
    pathname: string;
}) {
    if (tabs.length === 0) return null;
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                {title}
            </p>
            <ul className="flex flex-col gap-0.5">
                {tabs.map((t) => {
                    const active = pathname === t.href || pathname.startsWith(t.href + "/");
                    return (
                        <li key={t.key}>
                            <Link
                                href={t.href}
                                className={[
                                    "flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors",
                                    active
                                        ? "bg-white text-[#1457DC] shadow-sm"
                                        : "text-slate-600 hover:bg-white/60",
                                ].join(" ")}
                            >
                                <SettingIcon name={t.icon} active={active} />
                                <span className="truncate">{t.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function SettingIcon({ name, active }: { name: string; active: boolean }) {
    const cls = `w-3.5 h-3.5 shrink-0 ${active ? "text-[#1457DC]" : "text-slate-400"}`;
    const props = {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        viewBox: "0 0 24 24",
        className: cls,
    };

    switch (name) {
        case "building":
            return (
                <svg {...props}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" strokeLinecap="round" />
                </svg>
            );
        case "user":
            return (
                <svg {...props}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            );
        case "lock":
            return (
                <svg {...props}>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
            );
        case "users":
            return (
                <svg {...props}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            );
        case "device":
            return (
                <svg {...props}>
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                </svg>
            );
        case "bell":
            return (
                <svg {...props}>
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
                </svg>
            );
        case "plug":
            return (
                <svg {...props}>
                    <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 01-12 0V8zM12 18v4" strokeLinecap="round" />
                </svg>
            );
        case "file":
            return (
                <svg {...props}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="15" y2="17" />
                </svg>
            );
        default:
            return null;
    }
}