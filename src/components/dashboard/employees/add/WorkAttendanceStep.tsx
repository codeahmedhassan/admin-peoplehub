"use client";

import { FieldShell, TextInput, SelectInput, Toggle } from "./Field";
import { type EmployeeDraft } from "@/lib/employee-form";

interface Props {
    draft: EmployeeDraft;
    update: (patch: Partial<EmployeeDraft>) => void;
}

export default function WorkAttendanceStep({ draft, update }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-lg font-bold text-slate-900">Work & Attendance</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                    Configure how this employee logs time. Defaults are usually fine.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FieldShell label="Work Schedule / Shift" optional>
                    <TextInput
                        value={draft.workSchedule}
                        onChange={(v) => update({ workSchedule: v })}
                        placeholder="Mon–Fri, 9:00–18:00"
                    />
                </FieldShell>

                <FieldShell label="Weekly Working Days" optional>
                    <TextInput
                        value={draft.weeklyWorkingDays}
                        onChange={(v) => update({ weeklyWorkingDays: v })}
                    />
                </FieldShell>

                <FieldShell label="Attendance Location" optional>
                    <TextInput
                        value={draft.attendanceLocation}
                        onChange={(v) => update({ attendanceLocation: v })}
                        placeholder="Main office"
                    />
                </FieldShell>

                <FieldShell label="Attendance Method" optional>
                    <TextInput
                        value={draft.attendanceMethod}
                        onChange={(v) => update({ attendanceMethod: v })}
                    />
                </FieldShell>

                <FieldShell label="Attendance Eligibility">
                    <SelectInput
                        value={draft.attendanceEligibility}
                        onChange={(v) =>
                            update({ attendanceEligibility: v as EmployeeDraft["attendanceEligibility"] })
                        }
                        options={["Eligible", "Not Eligible"]}
                    />
                </FieldShell>

                <FieldShell label="Time Zone" optional>
                    <TextInput
                        value={draft.timeZone}
                        onChange={(v) => update({ timeZone: v })}
                    />
                </FieldShell>
            </div>

            <div className="pt-2">
                <Toggle
                    checked={draft.overtimeEligibility}
                    onChange={(v) => update({ overtimeEligibility: v })}
                    label="Overtime eligible"
                    description="Future feature — track and approve overtime hours."
                />
            </div>
        </div>
    );
}