"use client";

import { FieldShell, TextInput, SelectInput } from "./Field";
import {
    CURRENCIES,
    PAY_FREQUENCIES,
    PAYROLL_GROUPS,
    type EmployeeDraft,
    type StepFieldErrors,
} from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    update: (patch: Partial<EmployeeDraft>) => void;
    errors: StepFieldErrors;
}

export default function CompensationStep({ draft, update, errors }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Compensation & Payroll</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Only the salary amount is required. Bank details can be added later.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FieldShell label="Salary Amount" required error={errors.salaryAmount}>
                    <TextInput
                        value={draft.salaryAmount}
                        onChange={(v) => update({ salaryAmount: v.replace(/[^\d.]/g, "") })}
                        placeholder="4500"
                    />
                </FieldShell>

                <FieldShell label="Currency">
                    <SelectInput
                        value={draft.salaryCurrency}
                        onChange={(v) => update({ salaryCurrency: v })}
                        options={CURRENCIES}
                    />
                </FieldShell>

                <FieldShell label="Pay Frequency" required>
                    <SelectInput
                        value={draft.payFrequency}
                        onChange={(v) => update({ payFrequency: v as EmployeeDraft["payFrequency"] })}
                        options={PAY_FREQUENCIES}
                    />
                </FieldShell>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-700 mb-3">Bank Details <span className="text-slate-400 font-normal">(optional)</span></p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldShell label="Account Holder Name" optional>
                        <TextInput
                            value={draft.bankAccountName}
                            onChange={(v) => update({ bankAccountName: v })}
                        />
                    </FieldShell>
                    <FieldShell label="Bank Name" optional>
                        <TextInput
                            value={draft.bankName}
                            onChange={(v) => update({ bankName: v })}
                        />
                    </FieldShell>
                    <FieldShell label="Account Number" optional>
                        <TextInput
                            value={draft.bankAccountNumber}
                            onChange={(v) => update({ bankAccountNumber: v })}
                        />
                    </FieldShell>
                    <FieldShell label="Tax Identifier" optional>
                        <TextInput
                            value={draft.taxIdentifier}
                            onChange={(v) => update({ taxIdentifier: v })}
                        />
                    </FieldShell>
                    <FieldShell label="Payroll Group" optional>
                        <SelectInput
                            value={draft.payrollGroup}
                            onChange={(v) => update({ payrollGroup: v })}
                            options={PAYROLL_GROUPS}
                            placeholder="Default"
                        />
                    </FieldShell>
                </div>
            </div>
        </div>
    );
}