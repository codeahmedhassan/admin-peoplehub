"use client";

import { type EditableEmployee, type EditFieldErrors, EDIT_OPTIONS } from "@/lib/employee-edit";
import { EditFieldShell, EditTextInput, EditSelectInput } from "./EditField";

interface Props {
    form: EditableEmployee;
    update: (patch: Partial<EditableEmployee>) => void;
    errors: EditFieldErrors;
}

export default function CompensationTab({ form, update, errors }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-base font-bold text-slate-900">Compensation</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Salary, bank details, and payroll.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EditFieldShell label="Basic Salary" required error={errors.basicSalary}>
                    <EditTextInput
                        value={form.basicSalary}
                        onChange={(v) => update({ basicSalary: v.replace(/[^\d.]/g, "") })}
                    />
                </EditFieldShell>

                <EditFieldShell label="Gross Salary" optional>
                    <EditTextInput
                        value={form.grossSalary}
                        onChange={(v) => update({ grossSalary: v.replace(/[^\d.]/g, "") })}
                    />
                </EditFieldShell>

                <EditFieldShell label="Net Salary" optional>
                    <EditTextInput
                        value={form.netSalary}
                        onChange={(v) => update({ netSalary: v.replace(/[^\d.]/g, "") })}
                    />
                </EditFieldShell>

                <EditFieldShell label="Currency">
                    <EditSelectInput
                        value={form.currency}
                        onChange={(v) => update({ currency: v })}
                        options={EDIT_OPTIONS.currencies}
                    />
                </EditFieldShell>

                <EditFieldShell label="Pay Frequency">
                    <EditSelectInput
                        value={form.payFrequency}
                        onChange={(v) => update({ payFrequency: v })}
                        options={EDIT_OPTIONS.payFrequencies}
                    />
                </EditFieldShell>

                <EditFieldShell label="Payroll Group" optional>
                    <EditSelectInput
                        value={form.payrollGroup}
                        onChange={(v) => update({ payrollGroup: v })}
                        options={EDIT_OPTIONS.payrollGroups}
                        placeholder="Default"
                    />
                </EditFieldShell>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">Bank Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EditFieldShell label="Bank Name" optional>
                        <EditTextInput value={form.bankName} onChange={(v) => update({ bankName: v })} />
                    </EditFieldShell>
                    <EditFieldShell label="Account Holder" optional>
                        <EditTextInput value={form.bankAccountName} onChange={(v) => update({ bankAccountName: v })} />
                    </EditFieldShell>
                    <EditFieldShell label="Account Number" optional>
                        <EditTextInput value={form.bankAccountNumber} onChange={(v) => update({ bankAccountNumber: v })} />
                    </EditFieldShell>
                    <EditFieldShell label="Tax Identifier" optional>
                        <EditTextInput value={form.taxIdentifier} onChange={(v) => update({ taxIdentifier: v })} />
                    </EditFieldShell>
                </div>
            </div>
        </div>
    );
}