"use client";

import { FieldShell, TextInput, SelectInput, Toggle } from "./Field";
import DocumentUploader from "./DocumentUploader";
import {
    SYSTEM_ROLES,
    type EmployeeDraft,
    type StepFieldErrors,
    type StagedDocument,
} from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    update: (patch: Partial<EmployeeDraft>) => void;
    errors: StepFieldErrors;
}

export default function DocumentsAccessStep({ draft, update, errors }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">
                    Documents & Account Access
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Upload files now or continue — you can always add them later.
                </p>
            </div>

            {/* National ID text field */}
            <FieldShell label="National ID / Government ID" optional>
                <TextInput
                    value={draft.nationalId}
                    onChange={(v) => update({ nationalId: v })}
                    placeholder="Country-specific ID number"
                />
            </FieldShell>

            {/* Documents uploader */}
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <DocumentUploader
                    documents={draft.documents}
                    onChange={(docs: StagedDocument[]) => update({ documents: docs })}
                />
            </div>

            {/* Account & Access */}
            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">
                    Account & System Access
                </p>

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