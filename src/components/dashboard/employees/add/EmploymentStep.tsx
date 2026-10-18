"use client";

import { FieldShell, TextInput, SelectInput } from "./Field";
import {
    DEPARTMENTS,
    EMPLOYMENT_STATUSES,
    EMPLOYMENT_TYPES,
    MANAGERS,
    WORK_ARRANGEMENTS,
    WORK_LOCATIONS,
    EMPLOYEE_CATEGORIES,
    type EmployeeDraft,
    type StepFieldErrors,
} from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    update: (patch: Partial<EmployeeDraft>) => void;
    errors: StepFieldErrors;
}

export default function EmploymentStep({ draft, update, errors }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Employment Details</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    The role, department, and working setup.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldShell label="Employment Status" required>
                    <SelectInput
                        value={draft.employmentStatus}
                        onChange={(v) => update({ employmentStatus: v as EmployeeDraft["employmentStatus"] })}
                        options={EMPLOYMENT_STATUSES}
                    />
                </FieldShell>

                <FieldShell label="Employment Type" required error={errors.employmentType}>
                    <SelectInput
                        value={draft.employmentType}
                        onChange={(v) => update({ employmentType: v as EmployeeDraft["employmentType"] })}
                        options={EMPLOYMENT_TYPES}
                    />
                </FieldShell>

                <FieldShell label="Job Title / Designation" hint="e.g. Senior Product Designer">
                    <TextInput
                        value={draft.designation}
                        onChange={(v) => update({ designation: v })}
                        placeholder="Product Designer"
                    />
                </FieldShell>

                <FieldShell label="Department" required error={errors.department}>
                    <SelectInput
                        value={draft.department}
                        onChange={(v) => update({ department: v })}
                        options={DEPARTMENTS}
                        placeholder="Select department"
                    />
                </FieldShell>

                <FieldShell label="Reporting Manager" optional>
                    <SelectInput
                        value={draft.reportingManager}
                        onChange={(v) => update({ reportingManager: v })}
                        options={MANAGERS}
                        placeholder="No manager (reports to admin)"
                    />
                </FieldShell>

                <FieldShell label="Joining Date" required>
                    <TextInput
                        type="date"
                        value={draft.joiningDate}
                        onChange={(v) => update({ joiningDate: v })}
                    />
                </FieldShell>

                <FieldShell label="Work Location" optional>
                    <SelectInput
                        value={draft.workLocation}
                        onChange={(v) => update({ workLocation: v })}
                        options={WORK_LOCATIONS}
                        placeholder="Select location"
                    />
                </FieldShell>

                <FieldShell label="Work Arrangement" optional>
                    <SelectInput
                        value={draft.workArrangement}
                        onChange={(v) => update({ workArrangement: v as EmployeeDraft["workArrangement"] })}
                        options={WORK_ARRANGEMENTS}
                        placeholder="Select arrangement"
                    />
                </FieldShell>

                <FieldShell label="Probation End Date" optional>
                    <TextInput
                        type="date"
                        value={draft.probationEndDate}
                        onChange={(v) => update({ probationEndDate: v })}
                    />
                </FieldShell>

                <FieldShell label="Contract End Date" optional>
                    <TextInput
                        type="date"
                        value={draft.contractEndDate}
                        onChange={(v) => update({ contractEndDate: v })}
                    />
                </FieldShell>

                <FieldShell label="Employee Category" optional>
                    <SelectInput
                        value={draft.employeeCategory}
                        onChange={(v) => update({ employeeCategory: v })}
                        options={EMPLOYEE_CATEGORIES}
                        placeholder="Select category"
                    />
                </FieldShell>
            </div>
        </div>
    );
}