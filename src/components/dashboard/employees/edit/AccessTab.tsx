"use client";

import { type EditableEmployee, EDIT_OPTIONS } from "@/lib/employee-edit";
import { EditFieldShell, EditSelectInput } from "./EditField";

interface Props {
    form: EditableEmployee;
    update: (patch: Partial<EditableEmployee>) => void;
}

export default function AccessTab({ form, update }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-base font-bold text-slate-900">System Access</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Control what this employee can access in PeopleHub.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditFieldShell
                    label="System Role"
                    hint="Determines what actions are available to this user."
                >
                    <EditSelectInput
                        value={form.systemRole}
                        onChange={(v) => update({ systemRole: v })}
                        options={EDIT_OPTIONS.systemRoles}
                    />
                </EditFieldShell>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
                <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed">
                        <p className="font-semibold text-slate-800">Access changes take effect immediately.</p>
                        <p className="mt-0.5">
                            If you downgrade a user&apos;s role, they may lose access to records and
                            reports. Manage login credentials from the employee profile.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}