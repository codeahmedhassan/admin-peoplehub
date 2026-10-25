"use client";

import { type Device } from "@/lib/devices";

interface Props {
    devices: Device[];
    onManageUsers: (d: Device) => void;
    onRevoke: (d: Device) => void;
}

const statusStyles: Record<Device["status"], string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Revoked: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function DevicesTable({ devices, onManageUsers, onRevoke }: Props) {
    if (devices.length === 0) {
        return (
            <div className="bg-white rounded-[28px] p-12 border border-slate-200/60 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">No devices registered</p>
                <p className="text-xs text-slate-400 mt-1">
                    Add your first attendance device to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[28px] p-2 border border-slate-200/60 shadow-card-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-205">
                    <thead>
                        <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                            <th className="py-3 pl-4">Name</th>
                            <th className="py-3 pr-3">Location</th>
                            <th className="py-3 pr-3">Status</th>
                            <th className="py-3 pr-3">Last Seen</th>
                            <th className="py-3 pr-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {devices.map((device) => {
                            const revoked = device.status === "Revoked";
                            return (
                                <tr
                                    key={device.id}
                                    className={revoked ? "bg-slate-50/40" : "hover:bg-slate-50/60"}
                                >
                                    <td className="py-3 pl-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={[
                                                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                                                    revoked
                                                        ? "bg-slate-100 text-slate-400"
                                                        : "bg-primary-50 text-primary",
                                                ].join(" ")}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-semibold text-slate-800 truncate">
                                                    {device.name}
                                                </span>
                                                <span className="text-[11px] text-slate-400 tabular-nums">
                                                    {device.apiKeyPreview}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-3 text-slate-600 font-medium">
                                        {device.location}
                                    </td>
                                    <td className="py-3 pr-3">
                                        <span
                                            className={[
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                                                statusStyles[device.status],
                                            ].join(" ")}
                                        >
                                            <span
                                                className={[
                                                    "w-1.5 h-1.5 rounded-full",
                                                    revoked ? "bg-rose-500" : "bg-emerald-500",
                                                ].join(" ")}
                                            />
                                            {device.status}
                                        </span>
                                    </td>
                                    <td className="py-3 pr-3 text-slate-600 font-medium tabular-nums">
                                        {device.lastSeen}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => onManageUsers(device)}
                                                disabled={revoked}
                                                className={[
                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors",
                                                    revoked
                                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
                                                ].join(" ")}
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                </svg>
                                                Manage Users
                                            </button>
                                            {!revoked && (
                                                <button
                                                    onClick={() => onRevoke(device)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" strokeLinecap="round" />
                                                    </svg>
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}