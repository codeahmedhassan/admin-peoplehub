"use client";

import { useMemo, useState, useEffect } from "react";
import { deviceApi, ApiError } from "@/lib/api";
import { type Device } from "@/lib/devices";
import { getInitials } from "@/lib/employee-detail";

interface Props {
    device: Device;
    onClose: () => void;
}

type EmployeeLink = {
    _id: string; // Mongo ID
    employeeId: string;
    name: string;
    avatar?: string;
    deviceUserId: string;
};

export default function ManageUsersModal({ device, onClose }: Props) {
    const [employees, setEmployees] = useState<EmployeeLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const { employees } = await deviceApi.getLinks(device.id);
                setEmployees(employees);
            } catch (err) {
                alert(err instanceof ApiError ? err.message : "Failed to load mappings");
            } finally {
                setLoading(false);
            }
        };
        void fetchLinks();
    }, [device.id]);

    const handleSaveLink = async (empMongoId: string, deviceUserId: string) => {
        try {
            await deviceApi.saveLink(device.id, empMongoId, deviceUserId);
            // Success feedback (could be a toast, for now we rely on the local state update)
        } catch (err) {
            alert(err instanceof ApiError ? err.message : "Failed to save link");
        }
    };

    const filtered = useMemo(() => {
        if (!search) return employees;
        const q = search.toLowerCase();
        return employees.filter(
            (e) =>
                e.name.toLowerCase().includes(q) ||
                e.employeeId.toLowerCase().includes(q)
        );
    }, [employees, search]);

    const linkedCount = employees.filter((e) => e.deviceUserId.trim()).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 max-w-3xl w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Manage device users
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Map <span className="font-semibold text-slate-700">{device.name}</span>&apos;s local user
                            IDs to PeopleHub employees.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <line x1="18" x2="6" y1="6" y2="18" strokeLinecap="round" />
                            <line x1="6" x2="18" y1="6" y2="18" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Search bar */}
                <div className="px-5 pt-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" strokeWidth={2} />
                                <line strokeWidth={2} x1="21" x2="16.65" y1="21" y2="16.65" />
                            </svg>
                        </span>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or Emp ID…"
                            className="w-full bg-slate-50 border-0 py-2.5 pl-11 pr-4 rounded-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto px-5 py-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-20 text-xs text-slate-500">
                            Loading employees…
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                        <th className="py-2.5 pl-4">Employee</th>
                                        <th className="py-2.5 pr-3">Emp ID</th>
                                        <th className="py-2.5 pr-4 w-64">Device User ID</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="py-10 text-center text-xs text-slate-400">
                                                No employees match &ldquo;{search}&rdquo;
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((emp) => {
                                            const isLinked = emp.deviceUserId.trim().length > 0;
                                            return (
                                                <tr key={emp._id} className="hover:bg-slate-50/50">
                                                    <td className="py-2.5 pl-4">
                                                        <div className="flex items-center gap-2.5">
                                                            {emp.avatar ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img
                                                                    src={emp.avatar}
                                                                    alt={emp.name}
                                                                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-100 to-accentLimeLight/40 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                    {getInitials(emp.name)}
                                                                </div>
                                                            )}
                                                            <span className="font-semibold text-slate-800 truncate">
                                                                {emp.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-2.5 pr-3 text-slate-500 tabular-nums font-medium">
                                                        {emp.employeeId}
                                                    </td>
                                                    <td className="py-2.5 pr-4">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                value={emp.deviceUserId}
                                                                onChange={(e) => {
                                                                    const newVal = e.target.value;
                                                                    setEmployees(prev => prev.map(item => item._id === emp._id ? { ...item, deviceUserId: newVal } : item));
                                                                }}
                                                                placeholder="e.g. 42"
                                                                className={[
                                                                    "w-20 bg-slate-50 border rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 tabular-nums",
                                                                    isLinked ? "border-primary/30" : "border-slate-200",
                                                                ].join(" ")}
                                                            />
                                                            {isLinked ? (
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleSaveLink(emp._id, emp.deviceUserId)}
                                                                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-[#1457DC] text-white hover:bg-primary-700 transition-colors"
                                                                    >
                                                                        Save
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEmployees(prev => prev.map(item => item._id === emp._id ? { ...item, deviceUserId: "" } : item));
                                                                            handleSaveLink(emp._id, "");
                                                                        }}
                                                                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                                                                    >
                                                                        Unlink
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[11px] text-slate-400">Unmapped</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <p className="text-[11px] text-slate-400">
                        {linkedCount} of {employees.length} employees mapped
                    </p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}