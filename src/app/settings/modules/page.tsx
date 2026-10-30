"use client";

import { useState } from "react";
import { WORKSPACE_MODULES } from "@/lib/settings";
import { Toggle, SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

export default function ModulesPage() {
    const [enabled, setEnabled] = useState<Record<string, boolean>>(
        Object.fromEntries(WORKSPACE_MODULES.map((m) => [m.key, m.defaultOn]))
    );

    return (
        <SettingsLayout title="Workspace Modules" description="Turn features on or off across your workspace.">
            <SettingsCard
                title="Enabled features"
                description="Disabled modules are hidden from the sidebar for all users."
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">Save changes</button>
                    </>
                }
            >
                <div className="flex flex-col divide-y divide-slate-100">
                    {WORKSPACE_MODULES.map((m) => (
                        <Toggle
                            key={m.key}
                            checked={enabled[m.key]}
                            onChange={(v) => setEnabled((prev) => ({ ...prev, [m.key]: v }))}
                            label={m.label}
                            description={m.description}
                        />
                    ))}
                </div>
            </SettingsCard>
        </SettingsLayout>
    );
}