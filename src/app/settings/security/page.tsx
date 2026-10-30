"use client";

import { useState } from "react";
import { Field, TextInput, Toggle, SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

export default function SecurityPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactor, setTwoFactor] = useState(false);

    const canSavePassword =
        currentPassword.length > 0 && newPassword.length >= 8 && newPassword === confirmPassword;

    return (
        <SettingsLayout title="Security" description="Password, two-factor authentication, and active sessions.">
            <SettingsCard
                title="Change password"
                footer={
                    <button
                        disabled={!canSavePassword}
                        className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Update password
                    </button>
                }
            >
                <Field label="Current password" required>
                    <TextInput type="password" value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="New password" required hint="At least 8 characters.">
                        <TextInput type="password" value={newPassword} onChange={setNewPassword} placeholder="••••••••" />
                    </Field>
                    <Field label="Confirm new password" required>
                        <TextInput type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
                    </Field>
                </div>
            </SettingsCard>

            <SettingsCard title="Two-factor authentication">
                <Toggle
                    checked={twoFactor}
                    onChange={setTwoFactor}
                    label="Enable 2FA"
                    description="Adds a second verification step when signing in. (Coming soon)"
                />
            </SettingsCard>

            <SettingsCard
                title="Active sessions"
                footer={
                    <button className="px-4 py-2 bg-rose-600 rounded-full text-xs font-semibold text-white hover:bg-rose-700">
                        Log out of all devices
                    </button>
                }
            >
                <p className="text-xs text-slate-500">
                    Signing out everywhere will end all active sessions. You&apos;ll need to sign in again on each device.
                </p>
            </SettingsCard>
        </SettingsLayout>
    );
}