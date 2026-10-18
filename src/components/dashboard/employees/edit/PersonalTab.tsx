"use client";

import { type EditableEmployee, type EditFieldErrors, EDIT_OPTIONS } from "@/lib/employee-edit";
import { EditFieldShell, EditTextInput, EditSelectInput } from "./EditField";

interface Props {
    form: EditableEmployee;
    update: (patch: Partial<EditableEmployee>) => void;
    errors: EditFieldErrors;
}

export default function PersonalTab({ form, update, errors }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Name, contact, and emergency details.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditFieldShell label="First Name" required error={errors.firstName}>
                    <EditTextInput value={form.firstName} onChange={(v) => update({ firstName: v })} />
                </EditFieldShell>

                <EditFieldShell label="Last Name" required error={errors.lastName}>
                    <EditTextInput value={form.lastName} onChange={(v) => update({ lastName: v })} />
                </EditFieldShell>

                <EditFieldShell label="Preferred Name" optional>
                    <EditTextInput value={form.preferredName} onChange={(v) => update({ preferredName: v })} />
                </EditFieldShell>

                <EditFieldShell label="Phone" required error={errors.phone}>
                    <EditTextInput value={form.phone} onChange={(v) => update({ phone: v })} />
                </EditFieldShell>

                <EditFieldShell label="Gender" required error={errors.gender}>
                    <EditSelectInput
                        value={form.gender}
                        onChange={(v) => update({ gender: v })}
                        options={EDIT_OPTIONS.genders}
                    />
                </EditFieldShell>

                <EditFieldShell label="Personal Email" optional error={errors.personalEmail}>
                    <EditTextInput
                        type="email"
                        value={form.personalEmail}
                        onChange={(v) => update({ personalEmail: v })}
                    />
                </EditFieldShell>

                <EditFieldShell label="Date of Birth" optional>
                    <EditTextInput
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(v) => update({ dateOfBirth: v })}
                    />
                </EditFieldShell>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">Address</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <EditFieldShell label="Street Address" optional>
                        <EditTextInput value={form.address} onChange={(v) => update({ address: v })} />
                    </EditFieldShell>
                    <EditFieldShell label="City" optional>
                        <EditTextInput value={form.city} onChange={(v) => update({ city: v })} />
                    </EditFieldShell>
                    <EditFieldShell label="Country" optional>
                        <EditTextInput value={form.country} onChange={(v) => update({ country: v })} />
                    </EditFieldShell>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">Emergency Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <EditFieldShell label="Name" optional>
                        <EditTextInput value={form.emergencyName} onChange={(v) => update({ emergencyName: v })} />
                    </EditFieldShell>
                    <EditFieldShell label="Relationship" optional>
                        <EditTextInput value={form.emergencyRelation} onChange={(v) => update({ emergencyRelation: v })} />
                    </EditFieldShell>
                    <EditFieldShell label="Phone" optional>
                        <EditTextInput value={form.emergencyPhone} onChange={(v) => update({ emergencyPhone: v })} />
                    </EditFieldShell>
                </div>
            </div>
        </div>
    );
}