"use client";

import { useEffect } from "react";
import { FieldShell, TextInput, SelectInput } from "./Field";
import {
    pickRandomAvatar,
    type EmployeeDraft,
    type StepFieldErrors,
} from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    update: (patch: Partial<EmployeeDraft>) => void;
    errors: StepFieldErrors;
}

export default function BasicStep({ draft, update, errors }: Props) {
    // Auto-fill preferred name from first name
    useEffect(() => {
        if (!draft.preferredName && draft.firstName) {
            update({ preferredName: draft.firstName });
        }
    }, [draft.firstName, draft.preferredName, update]);

    // Auto-assign avatar when gender is chosen (unless user manually picked one)
    useEffect(() => {
        if (draft.gender && !draft.manuallyPickedAvatar && !draft.avatar) {
            update({ avatar: pickRandomAvatar(draft.gender) });
        }
        if (draft.gender && !draft.manuallyPickedAvatar && draft.avatar) {
            // Re-roll when gender changes so it matches pool
            update({ avatar: pickRandomAvatar(draft.gender) });
        }
    }, [draft.gender, draft.manuallyPickedAvatar, draft.avatar, update]);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Just the essentials — we&apos;ll fill the rest together.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldShell label="First Name" required error={errors.firstName}>
                    <TextInput
                        value={draft.firstName}
                        onChange={(v) => {
                            const patch: Partial<EmployeeDraft> = { firstName: v };
                            // If preferredName is empty OR matches the old firstName (meaning it was auto-filled), update it
                            if (!draft.preferredName || draft.preferredName === draft.firstName) {
                                patch.preferredName = v;
                            }
                            update(patch);
                        }}
                        placeholder="e.g. Jane"
                    />
                </FieldShell>

                <FieldShell label="Last Name" required error={errors.lastName}>
                    <TextInput
                        value={draft.lastName}
                        onChange={(v) => update({ lastName: v })}
                        placeholder="e.g. Doe"
                    />
                </FieldShell>

                <FieldShell
                    label="Employee ID"
                    hint="Auto-generated, but you can edit it."
                    optional
                >
                    <TextInput
                        value={draft.employeeId}
                        onChange={(v) => update({ employeeId: v })}
                        placeholder="e.g. EMP-00001"
                    />
                </FieldShell>

                <FieldShell label="Phone Number" required error={errors.phone}>
                    <TextInput
                        value={draft.phone}
                        onChange={(v) => update({ phone: v })}
                        placeholder="+1 555 123 4567"
                    />
                </FieldShell>

                <FieldShell label="Preferred Name" optional hint="Defaults to first name">
                    <TextInput
                        value={draft.preferredName}
                        onChange={(v) => update({ preferredName: v })}
                        placeholder="e.g. Jane"
                    />
                </FieldShell>

                <FieldShell label="Gender" required error={errors.gender}>
                    <SelectInput
                        value={draft.gender}
                        onChange={(v) =>
                            update({
                                gender: v as EmployeeDraft["gender"],
                                manuallyPickedAvatar: false,
                                avatar: "",
                            })
                        }
                        options={["Male", "Female", "Other"]}
                        placeholder="Select gender"
                    />
                </FieldShell>
            </div>

            {/* Avatar preview */}
            {draft.avatar && (
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        alt="Selected avatar"
                        src={draft.avatar}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800">
                            We picked an avatar for you
                        </p>
                        <p className="text-[11px] text-slate-500">
                            Change it later from the employee profile.
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            update({
                                avatar: pickRandomAvatar(draft.gender),
                                manuallyPickedAvatar: true,
                            })
                        }
                        className="text-xs font-semibold text-primary hover:underline"
                    >
                        Shuffle
                    </button>
                </div>
            )}
        </div>
    );
}