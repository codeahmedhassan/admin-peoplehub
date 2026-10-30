"use client";

import { useState } from "react";
import { INDUSTRIES, TIMEZONES } from "@/lib/settings";
import { Field, TextInput, Select, SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

export default function CompanyProfilePage() {
    const [name, setName] = useState("WorkNest Inc.");
    const [industry, setIndustry] = useState("Technology");
    const [timezone, setTimezone] = useState("UTC+05:00 Karachi");
    const [logo, setLogo] = useState<string | null>(null);

    const handleLogoChange = (file: File) => {
        const url = URL.createObjectURL(file);
        setLogo(url);
    };

    return (
        <SettingsLayout title="Company Profile" description="Basic information about your organization.">
            <SettingsCard
                title="Company details"
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">
                            Save changes
                        </button>
                    </>
                }
            >
                <Field label="Company name" required>
                    <TextInput value={name} onChange={setName} />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Industry">
                        <Select value={industry} onChange={setIndustry} options={INDUSTRIES} />
                    </Field>
                    <Field label="Primary timezone">
                        <Select value={timezone} onChange={setTimezone} options={TIMEZONES} />
                    </Field>
                </div>

                <Field label="Company logo" hint="PNG or SVG, at least 200×200px.">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                            {logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <div>
                            <label className="inline-flex px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleLogoChange(e.target.files[0])}
                                />
                                Upload logo
                            </label>
                            {logo && (
                                <button onClick={() => setLogo(null)} className="text-[11px] text-rose-600 font-semibold ml-3 hover:underline">
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </Field>
            </SettingsCard>
        </SettingsLayout>
    );
}