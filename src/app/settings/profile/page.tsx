"use client";

import { useState } from "react";
import { CURRENT_USER } from "@/lib/constants";
import { Field, TextInput, SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

export default function ProfilePage() {
    const [firstName, setFirstName] = useState("Miquella");
    const [displayName, setDisplayName] = useState("Miquella");
    const [avatar, setAvatar] = useState(CURRENT_USER.avatar);
    const [personalEmail, setPersonalEmail] = useState("miquella.personal@gmail.com");
    const [phone, setPhone] = useState("+1 555 0100");
    const [emergencyName, setEmergencyName] = useState("Alex Carter");
    const [emergencyRelation, setEmergencyRelation] = useState("Sibling");
    const [emergencyPhone, setEmergencyPhone] = useState("+1 555 0199");

    return (
        <SettingsLayout title="My Profile" description="Personal information visible to your workspace.">
            <SettingsCard
                title="Basic info"
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">Save changes</button>
                    </>
                }
            >
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <label className="inline-flex px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) setAvatar(URL.createObjectURL(f));
                            }}
                        />
                        Change photo
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="First name" required>
                        <TextInput value={firstName} onChange={setFirstName} />
                    </Field>
                    <Field label="Display name" hint="Shown across the app instead of your full name.">
                        <TextInput value={displayName} onChange={setDisplayName} />
                    </Field>
                </div>
            </SettingsCard>

            <SettingsCard
                title="Contact info"
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">Save changes</button>
                    </>
                }
            >
                <Field label="Work email" hint="Contact your admin to change this.">
                    <TextInput value={CURRENT_USER.email} disabled />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Personal email">
                        <TextInput type="email" value={personalEmail} onChange={setPersonalEmail} />
                    </Field>
                    <Field label="Phone number">
                        <TextInput value={phone} onChange={setPhone} />
                    </Field>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-3">Emergency Contact</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Name"><TextInput value={emergencyName} onChange={setEmergencyName} /></Field>
                        <Field label="Relationship"><TextInput value={emergencyRelation} onChange={setEmergencyRelation} /></Field>
                        <Field label="Phone"><TextInput value={emergencyPhone} onChange={setEmergencyPhone} /></Field>
                    </div>
                </div>
            </SettingsCard>
        </SettingsLayout>
    );
}