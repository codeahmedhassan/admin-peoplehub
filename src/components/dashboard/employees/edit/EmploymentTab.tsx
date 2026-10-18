"use client";

import { type EditableEmployee, type EditFieldErrors, EDIT_OPTIONS } from "@/lib/employee-edit";
import { EditFieldShell, EditTextInput, EditSelectInput } from "./EditField";

interface Props {
    form: EditableEmployee;
    update: (patch: Partial<EditableEmployee>) => void;
    errors: EditFieldErrors;
}

export default function EmploymentTab({ form, update, errors }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-base font-bold text-slate-900">Employment Details</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Role, department, and work setup.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditFieldShell label="Employment Status">
                    <EditSelectInput
                        value={form.employmentStatus}
                        onChange={(v) => update({ employmentStatus: v })}
                        options={EDIT_OPTIONS.employmentStatuses}
                    />
                </EditFieldShell>

                <EditFieldShell label="Employment Type">
                    <EditSelectInput
                        value={form.employmentType}
                        onChange={(v) => update({ employmentType: v })}
                        options={EDIT_OPTIONS.employmentTypes}
                    />
                </EditFieldShell>

                <EditFieldShell label="Designation" optional>
                    <EditTextInput value={form.designation} onChange={(v) => update({ designation: v })} />
                </EditFieldShell>

                <EditFieldShell label="Department" required error={errors.department}>
                    <EditSelectInput
                        value={form.department}
                        onChange={(v) => update({ department: v })}
                        options={EDIT_OPTIONS.departments}
                        placeholder="Select department"
                    />
                </EditFieldShell>

                <EditFieldShell label="Reporting Manager" optional>
                    <EditSelectInput
                        value={form.reportingManager}
                        onChange={(v) => update({ reportingManager: v })}
                        options={EDIT_OPTIONS.managers}
                        placeholder="No manager"
                    />
                </EditFieldShell>

                <EditFieldShell label="Joining Date" optional>
                    <EditTextInput
                        type="date"
                        value={form.joiningDate}
                        onChange={(v) => update({ joiningDate: v })}
                    />
                </EditFieldShell>

                <EditFieldShell label="Work Location" optional>
                    <EditSelectInput
                        value={form.workLocation}
                        onChange={(v) => update({ workLocation: v })}
                        options={EDIT_OPTIONS.workLocations}
                        placeholder="Select location"
                    />
                </EditFieldShell>

                <EditFieldShell label="Work Arrangement" optional>
                    <EditSelectInput
                        value={form.workArrangement}
                        onChange={(v) => update({ workArrangement: v })}
                        options={EDIT_OPTIONS.workArrangements}
                        placeholder="Select arrangement"
                    />
                </EditFieldShell>

                <EditFieldShell label="Probation End Date" optional>
                    <EditTextInput
                        type="date"
                        value={form.probationEndDate}
                        onChange={(v) => update({ probationEndDate: v })}
                    />
                </EditFieldShell>

                <EditFieldShell label="Contract End Date" optional>
                    <EditTextInput
                        type="date"
                        value={form.contractEndDate}
                        onChange={(v) => update({ contractEndDate: v })}
                    />
                </EditFieldShell>

                <EditFieldShell label="Employee Category" optional>
                    <EditSelectInput
                        value={form.employeeCategory}
                        onChange={(v) => update({ employeeCategory: v })}
                        options={EDIT_OPTIONS.categories}
                        placeholder="Select category"
                    />
                </EditFieldShell>
            </div>
        </div>
    );
}