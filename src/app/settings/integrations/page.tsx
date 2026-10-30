"use client";

import { SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

const INTEGRATIONS = [
    { name: "Slack", description: "Send attendance and payroll events to Slack channels.", comingSoon: true },
    { name: "Google Workspace", description: "Sync users, calendars, and contacts.", comingSoon: true },
    { name: "Zapier", description: "Automate workflows across 5000+ apps.", comingSoon: true },
];

export default function IntegrationsPage() {
    return (
        <SettingsLayout title="Integrations" description="Connect PeopleHub with your other tools.">
            <SettingsCard title="Available integrations">
                <div className="flex flex-col gap-3">
                    {INTEGRATIONS.map((i) => (
                        <div key={i.name} className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 01-12 0V8zM12 18v4" strokeLinecap="round" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-slate-900">{i.name}</p>
                                    {i.comingSoon && (
                                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                            SOON
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">{i.description}</p>
                            </div>
                            <button
                                disabled={i.comingSoon}
                                className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {i.comingSoon ? "Coming soon" : "Connect"}
                            </button>
                        </div>
                    ))}
                </div>
            </SettingsCard>
        </SettingsLayout>
    );
}