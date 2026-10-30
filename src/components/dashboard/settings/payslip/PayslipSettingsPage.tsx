"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useToast, ToastContainer } from "@/components/ui/Toast";
import { DEFAULT_PAYSLIP_SETTINGS, type PayslipSettings } from "@/lib/payslip-settings";
import { SettingsCard, Toggle, TextInput } from "../SettingField";
import ComponentPicker from "./ComponentPicker";
import PayslipPreview from "./PayslipPreview";

export default function PayslipSettingsPage() {
    const [settings, setSettings] = useState<PayslipSettings | null>(null);
    const [components, setComponents] = useState<any[]>([]);
    const [currency, setCurrency] = useState("USD"); // <-- Added currency state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const { toast, showToast, setToast } = useToast();

    useEffect(() => {
        const load = async () => {
            try {
                const [wsRes, compRes] = await Promise.all([
                    apiFetch<{ workspace: any }>("/workspace/me"),
                    apiFetch<{ components: any[] }>("/payroll/components")
                ]);

                const dbSettings = wsRes.workspace.payslipSettings || {};
                setSettings({
                    ...DEFAULT_PAYSLIP_SETTINGS,
                    ...dbSettings,
                    visibleComponentIds: dbSettings.visibleComponentIds || [],
                });

                // Set the currency from the workspace
                setCurrency(wsRes.workspace.currency || "USD");

                setComponents(compRes.components.map((c: any) => ({ ...c, id: c._id })));
            } catch (err) {
                showToast("Failed to load settings", "error");
            } finally {
                setLoading(false);
            }
        };
        void load();
    }, []);

    const save = async () => {
        if (!settings) return;
        setSaving(true);
        try {
            await apiFetch("/workspace/payslip-settings", {
                method: "PATCH",
                body: settings,
            });
            showToast("Payslip settings saved", "success");
        } catch (err) {
            showToast("Failed to save settings", "error");
        } finally {
            setSaving(false);
        }
    };

    const update = <K extends keyof PayslipSettings>(key: K, value: PayslipSettings[K]) => {
        setSettings((prev) => prev ? { ...prev, [key]: value } : null);
    };

    if (loading || !settings) {
        return (
            <div className="py-20 text-center text-xs text-slate-400">
                Loading settings…
            </div>
        );
    }

    const activeComponents = components.filter((c) => c.isActive);

    return (
        <div className="flex flex-col gap-6 mb-10">
            <div>
                <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-1">
                    <Link href="/settings/profile" className="hover:text-slate-700 transition-colors">
                        Settings
                    </Link>
                    <span>/</span>
                    <span className="text-slate-700 font-semibold">Payslip Design</span>
                </nav>
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Payslip Customization
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Choose what appears on employee payslips. Changes preview live on the right.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={save}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save settings"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-4 flex flex-col gap-4">
                    <SettingsCard
                        title="Sections"
                        description="Toggle the main sections of the payslip."
                    >
                        <Toggle
                            checked={settings.showEarnings}
                            onChange={(v) => update("showEarnings", v)}
                            label="Show earnings"
                            description="Basic salary, allowances, bonuses, etc."
                        />
                        <Toggle
                            checked={settings.showDeductions}
                            onChange={(v) => update("showDeductions", v)}
                            label="Show deductions"
                            description="Tax, EOBI, provident fund, advances, etc."
                        />
                        <Toggle
                            checked={settings.showEmployerContributions}
                            onChange={(v) => update("showEmployerContributions", v)}
                            label="Show employer contributions"
                            description="Employer-paid amounts (not deducted from salary)."
                        />
                    </SettingsCard>

                    <SettingsCard
                        title="Extra details"
                        description="Small elements that personalize the payslip."
                    >
                        <Toggle
                            checked={settings.showCompanyLogo}
                            onChange={(v) => update("showCompanyLogo", v)}
                            label="Company logo"
                        />
                        <Toggle
                            checked={settings.showEmployeePhoto}
                            onChange={(v) => update("showEmployeePhoto", v)}
                            label="Employee photo"
                        />
                        <Toggle
                            checked={settings.showNotes}
                            onChange={(v) => update("showNotes", v)}
                            label="Notes section"
                            description="HR can add a note per payslip."
                        />
                        <Toggle
                            checked={settings.showFooter}
                            onChange={(v) => update("showFooter", v)}
                            label="Footer text"
                        />
                        {settings.showFooter && (
                            <TextInput
                                value={settings.footerText}
                                onChange={(v) => update("footerText", v)}
                                placeholder="Footer message…"
                            />
                        )}
                    </SettingsCard>

                    <SettingsCard
                        title="Components on payslip"
                        description="Drag to reorder. Toggle off to hide. The order here matches the payslip order."
                    >
                        <ComponentPicker
                            components={activeComponents}
                            visibleIds={settings.visibleComponentIds}
                            onChange={(ids) => update("visibleComponentIds", ids)}
                        />
                    </SettingsCard>
                </div>

                <div className="xl:col-span-8 h-full">
                    <div className="xl:sticky xl:top-20">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Live preview
                            </p>
                            <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                                Sample Employee
                            </span>
                        </div>
                        <PayslipPreview settings={settings} components={components} currency={currency} />
                    </div>
                </div>
            </div>

            <ToastContainer toast={toast} onClose={() => setToast(null)} />
        </div>
    );
}