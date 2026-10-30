"use client";

import { useState } from "react";
import { SYSTEM_ROLES, USERS_WITH_ACCESS, type SystemRole } from "@/lib/settings";
import { SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";
import { getInitials } from "@/lib/employee-detail";

const roleBadge: Record<SystemRole, string> = {
    Admin: "bg-rose-50 text-rose-700",
    HR: "bg-purple-50 text-purple-700",
    Manager: "bg-blue-50 text-blue-700",
    Employee: "bg-emerald-50 text-emerald-700",
    Viewer: "bg-slate-100 text-slate-600",
};

export default function RolesPage() {
    const [users, setUsers] = useState(USERS_WITH_ACCESS);

    const setRole = (id: string, role: SystemRole) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    };

    return (
        <SettingsLayout title="Access & Roles" description="Manage who can log in and what they can do.">
            <SettingsCard title="Users with access" description={`${users.length} users have login access.`}>
                <div className="rounded-2xl border border-slate-100 overflow-hidden -m-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50">
                            <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="py-2.5 pl-4">User</th>
                                <th className="py-2.5 pr-3">Last Active</th>
                                <th className="py-2.5 pr-4 text-right">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50">
                                    <td className="py-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            {u.avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {getInitials(u.name)}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-slate-800 truncate">{u.name}</span>
                                                <span className="text-[11px] text-slate-400 truncate">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-3 text-slate-500 font-medium">{u.lastActive}</td>
                                    <td className="py-3 pr-4 text-right">
                                        <div className="inline-flex items-center gap-2">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${roleBadge[u.role]}`}>
                                                {u.role}
                                            </span>
                                            <div className="relative">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => setRole(u.id, e.target.value as SystemRole)}
                                                    className="appearance-none bg-white border border-slate-200 pl-2.5 pr-7 py-1.5 rounded-lg text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                                                >
                                                    {SYSTEM_ROLES.map((r) => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                                <svg className="w-2.5 h-2.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                                                </svg>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SettingsCard>
        </SettingsLayout>
    );
}