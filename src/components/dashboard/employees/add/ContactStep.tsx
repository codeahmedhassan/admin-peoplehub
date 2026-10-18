"use client";

import { FieldShell, TextInput } from "./Field";
import { type EmployeeDraft } from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    update: (patch: Partial<EmployeeDraft>) => void;
}

export default function ContactStep({ draft, update }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Contact & Personal</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    All optional. You can add these anytime later.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldShell label="Personal Email" optional>
                    <TextInput
                        type="email"
                        value={draft.personalEmail}
                        onChange={(v) => update({ personalEmail: v })}
                        placeholder="jane.doe@gmail.com"
                    />
                </FieldShell>

                <FieldShell label="Date of Birth" optional>
                    <TextInput
                        type="date"
                        value={draft.dateOfBirth}
                        onChange={(v) => update({ dateOfBirth: v })}
                    />
                </FieldShell>

                <FieldShell label="Residential Address" optional>
                    <TextInput
                        value={draft.residentialAddress}
                        onChange={(v) => update({ residentialAddress: v })}
                        placeholder="123 Main Street, Apt 4B"
                    />
                </FieldShell>

                <FieldShell label="City" optional>
                    <TextInput value={draft.city} onChange={(v) => update({ city: v })} />
                </FieldShell>

                <FieldShell label="Country" optional>
                    <TextInput value={draft.country} onChange={(v) => update({ country: v })} />
                </FieldShell>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">Emergency Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FieldShell label="Name" optional>
                        <TextInput
                            value={draft.emergencyName}
                            onChange={(v) => update({ emergencyName: v })}
                        />
                    </FieldShell>
                    <FieldShell label="Relationship" optional>
                        <TextInput
                            value={draft.emergencyRelation}
                            onChange={(v) => update({ emergencyRelation: v })}
                            placeholder="Spouse, Parent…"
                        />
                    </FieldShell>
                    <FieldShell label="Phone" optional>
                        <TextInput
                            value={draft.emergencyPhone}
                            onChange={(v) => update({ emergencyPhone: v })}
                        />
                    </FieldShell>
                </div>
            </div>
        </div>
    );
}