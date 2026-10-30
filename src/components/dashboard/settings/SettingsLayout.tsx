"use client";

import SettingsTabs from "./SettingTabs";

export default function SettingsLayout({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-6 mb-10">
            <div>
                <p className="text-xs text-slate-400 font-medium">Settings</p>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
                {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
            </div>
            <div className="flex flex-col xl:flex-row gap-6 items-start">
                <SettingsTabs />
                <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
                    {children}
                </div>
            </div>
        </div>
    );
}