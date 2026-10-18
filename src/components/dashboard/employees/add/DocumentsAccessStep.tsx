"use client";

import { FieldShell, TextInput, SelectInput, Toggle } from "./Field";
import { SYSTEM_ROLES, type EmployeeDraft, type StepFieldErrors } from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    update: (patch: Partial<EmployeeDraft>) => void;
    errors: StepFieldErrors;
}

const DOCS = [
    { key: "hasContract", label: "Employment Contract" },
    { key: "hasCv", label: "CV / Résumé" },
    { key: "hasIdentityDoc", label: "Identity Document" },
    { key: "hasCertificates", label: "Certificates" },
    { key: "hasOtherDocs", label: "Other HR Documents" },
] as const;

export default function DocumentsAccessStep({ draft, update, errors }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Documents & Account Access</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Attach files now or upload later from the profile.
                </p>
            </div>

            {/* National ID */}
            <FieldShell label="National ID / Government ID" optional>
                <TextInput
                    value={draft.nationalId}
                    onChange={(v) => update({ nationalId: v })}
                    placeholder="Country-specific ID number"
                />
            </FieldShell>

            {/* Document checklist */}
            <div>
                <p className="text-xs font-bold text-slate-700 mb-3">Documents to attach</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {DOCS.map((d) => {
                        const checked = draft[d.key];
                        return (
                            <button
                                key={d.key}
                                type="button"
                                onClick={() => update({ [d.key]: !checked } as Partial<EmployeeDraft>)}
                                className={[
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors",
                                    checked
                                        ? "bg-primary-50 border-primary/30"
                                        : "bg-slate-50 border-slate-200 hover:border-slate-300",
                                ].join(" ")}
                            >
                                <span
                                    className={[
                                        "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0",
                                        checked ? "bg-primary border-primary" : "border-slate-300 bg-white",
                                    ].join(" ")}
                                >
                                    {checked && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                            <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                <span className="text-xs font-medium text-slate-700">{d.label}</span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                    Checked items will appear as slots on the profile — upload files after creating.
                </p>
            </div>

            {/* Account & Access */}
            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">Account & System Access</p>

                <Toggle
                    checked={draft.createLogin}
                    onChange={(v) => update({ createLogin: v })}
                    label="Create a login account for this employee"
                    description="They'll be able to sign in to PeopleHub."
                />

                {draft.createLogin && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
                        <FieldShell
                            label="Login Email"
                            required={draft.sendInvitation}
                            optional={!draft.sendInvitation}
                            error={errors.loginEmail}
                        >
                            <TextInput
                                type="email"
                                value={draft.loginEmail}
                                onChange={(v) => update({ loginEmail: v })}
                                placeholder="employee@company.com"
                            />
                        </FieldShell>
                        <FieldShell label="System Role">
                            <SelectInput
                                value={draft.systemRole}
                                onChange={(v) => update({ systemRole: v })}
                                options={SYSTEM_ROLES}
                            />
                        </FieldShell>
                        <div className="md:col-span-2">
                            <Toggle
                                checked={draft.sendInvitation}
                                onChange={(v) => update({ sendInvitation: v })}
                                label="Send invitation email now"
                                description="An activation link will be sent immediately."
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}