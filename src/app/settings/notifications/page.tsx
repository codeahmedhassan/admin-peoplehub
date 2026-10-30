"use client";

import { useState } from "react";
import { NOTIFICATION_PREFS } from "@/lib/settings";
import { Toggle, SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

export default function NotificationsPage() {
    const [enabled, setEnabled] = useState<Record<string, boolean>>(
        Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.key, true]))
    );

    const emailPrefs = NOTIFICATION_PREFS.filter((p) => p.category === "email");
    const inappPrefs = NOTIFICATION_PREFS.filter((p) => p.category === "inapp");

    return (
        <SettingsLayout title="Notifications" description="Choose what you want to be notified about.">
            <SettingsCard
                title="Email notifications"
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">Save changes</button>
                    </>
                }
            >
                <div className="flex flex-col divide-y divide-slate-100">
                    {emailPrefs.map((p) => (
                        <Toggle
                            key={p.key}
                            checked={enabled[p.key]}
                            onChange={(v) => setEnabled((prev) => ({ ...prev, [p.key]: v }))}
                            label={p.label}
                            description={p.description}
                        />
                    ))}
                </div>
            </SettingsCard>

            <SettingsCard
                title="In-app notifications"
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">Save changes</button>
                    </>
                }
            >
                <div className="flex flex-col divide-y divide-slate-100">
                    {inappPrefs.map((p) => (
                        <Toggle
                            key={p.key}
                            checked={enabled[p.key]}
                            onChange={(v) => setEnabled((prev) => ({ ...prev, [p.key]: v }))}
                            label={p.label}
                            description={p.description}
                        />
                    ))}
                </div>
            </SettingsCard>
        </SettingsLayout>
    );
}