"use client";

import { useState } from "react";
import { CURRENCIES, PAYROLL_CYCLES } from "@/lib/settings";
import { Field, TextInput, Select, SettingsCard } from "@/components/dashboard/settings/SettingField";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";

export default function FinancialPage() {
    const [currency, setCurrency] = useState("USD");
    const [cycle, setCycle] = useState(PAYROLL_CYCLES[0]);
    const [taxId, setTaxId] = useState("TIN-4821-A");

    return (
        <SettingsLayout title="Financial & Payroll" description="Currency, payroll cycle, and tax identifier defaults.">
            <SettingsCard
                title="Financial defaults"
                footer={
                    <>
                        <button className="px-4 py-2 bg-white rounded-full text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">Cancel</button>
                        <button className="px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800">Save changes</button>
                    </>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Base currency">
                        <Select value={currency} onChange={setCurrency} options={CURRENCIES} />
                    </Field>
                    <Field label="Payroll cycle">
                        <Select value={cycle} onChange={setCycle} options={PAYROLL_CYCLES} />
                    </Field>
                </div>
                <Field label="Default tax identifier" hint="Used as default for new employees.">
                    <TextInput value={taxId} onChange={setTaxId} />
                </Field>
            </SettingsCard>
        </SettingsLayout>
    );
}