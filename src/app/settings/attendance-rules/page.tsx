"use client";

import { useState } from "react";
import { WEEKDAYS, type Holiday } from "@/lib/settings";
import { Field, Toggle, SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

export default function AttendanceRulesPage() {
    const [autoAbsent, setAutoAbsent] = useState(true);
    const [weekends, setWeekends] = useState<string[]>(["Saturday", "Sunday"]);
    const [holidays, setHolidays] = useState<Holiday[]>([
        { id: "h1", name: "New Year", date: "2025-01-01" },
        { id: "h2", name: "Independence Day", date: "2025-08-14" },
    ]);
    const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });

    const toggleWeekend = (day: string) =>
        setWeekends((w) => (w.includes(day) ? w.filter((x) => x !== day) : [...w, day]));

    const addHoliday = () => {
        if (!newHoliday.name.trim() || !newHoliday.date) return;
        setHolidays((prev) => [
            ...prev,
            { id: `h-${Date.now()}`, name: newHoliday.name.trim(), date: newHoliday.date },
        ]);
        setNewHoliday({ name: "", date: "" });
    };

    const removeHoliday = (id: string) =>
        setHolidays((prev) => prev.filter((h) => h.id !== id));

    return (
        <SettingsLayout title="Attendance & Leave Rules" description="Configure how attendance is calculated.">
            <SettingsCard
                title="Auto-marking"
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">Save changes</button>
                    </>
                }
            >
                <Toggle
                    checked={autoAbsent}
                    onChange={setAutoAbsent}
                    label="Auto-mark absent"
                    description="Automatically mark employees as absent if they don't clock in by end of day."
                />
            </SettingsCard>

            <SettingsCard title="Weekend days">
                <p className="text-xs text-slate-500 -mt-2 mb-2">
                    Selected days will be excluded from attendance calculations.
                </p>
                <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map((day) => {
                        const active = weekends.includes(day);
                        return (
                            <button
                                key={day}
                                onClick={() => toggleWeekend(day)}
                                className={[
                                    "px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors",
                                    active
                                        ? "bg-[#1457DC] text-white border-[#1457DC] shadow-sm shadow-blue-500/30"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
                                ].join(" ")}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </SettingsCard>

            <SettingsCard title="Public holidays">
                <div className="flex items-end gap-2 flex-wrap">
                    <div className="flex-1 min-w-50">
                        <Field label="Name">
                            <input
                                value={newHoliday.name}
                                onChange={(e) => setNewHoliday((h) => ({ ...h, name: e.target.value }))}
                                placeholder="e.g. Christmas"
                                className="w-full bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </Field>
                    </div>
                    <div>
                        <Field label="Date">
                            <input
                                type="date"
                                value={newHoliday.date}
                                onChange={(e) => setNewHoliday((h) => ({ ...h, date: e.target.value }))}
                                className="bg-slate-50 border border-slate-200 py-2.5 px-3.5 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            />
                        </Field>
                    </div>
                    <button
                        onClick={addHoliday}
                        disabled={!newHoliday.name.trim() || !newHoliday.date}
                        className="px-4 py-2.5 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Add holiday
                    </button>
                </div>

                {holidays.length > 0 && (
                    <ul className="flex flex-col gap-1.5 mt-4">
                        {holidays.map((h) => (
                            <li
                                key={h.id}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-100 hover:bg-slate-50"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center shrink-0">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                        <line x1="16" x2="16" y1="2" y2="6" />
                                        <line x1="8" x2="8" y1="2" y2="6" />
                                        <line x1="3" x2="21" y1="10" y2="10" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-slate-800 truncate">{h.name}</p>
                                    <p className="text-[11px] text-slate-400 tabular-nums">
                                        {new Date(h.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeHoliday(h.id)}
                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                    aria-label="Remove holiday"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </SettingsCard>
        </SettingsLayout>
    );
}