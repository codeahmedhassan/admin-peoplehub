"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { employeeApi, ApiError } from "@/lib/api";
import { mapApiEmployeeToDetail, type EmployeeDetail } from "@/lib/employee-detail";
import EmployeeDetailView from "@/components/dashboard/employees/detail/EmployeeDetailView";

type LoadState = "loading" | "ready" | "error";

export default function EmployeeDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const id = params?.id;

    const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
    const [state, setState] = useState<LoadState>("loading");
    const [error, setError] = useState<string | null>(null);

    const fetchEmployee = useCallback(async () => {
        if (!id) return;
        setState("loading");
        setError(null);
        try {
            const { employee: apiEmployee } = await employeeApi.get(id);
            setEmployee(mapApiEmployeeToDetail(apiEmployee));
            setState("ready");
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                setState("error");
                setError("Employee not found.");
            } else {
                setState("error");
                setError(
                    err instanceof ApiError ? err.message : "Failed to load employee."
                );
            }
        }
    }, [id]);

    useEffect(() => {
        void fetchEmployee();
    }, [fetchEmployee]);

    /**
     * Refetch after a mutation (e.g. document upload). Uses a "silent" reload —
     * we don't flip back to the loading spinner, so the user stays on their tab.
     */
    const silentRefresh = useCallback(async () => {
        if (!id) return;
        try {
            const { employee: apiEmployee } = await employeeApi.get(id);
            setEmployee(mapApiEmployeeToDetail(apiEmployee));
        } catch {
            /* ignore — keep showing the current data */
        }
    }, [id]);

    if (state === "loading") {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                    Loading employee…
                </div>
            </div>
        );
    }

    if (state === "error" || !employee) {
        return (
            <div className="bg-white rounded-[28px] p-8 border border-slate-200/60 max-w-md mx-auto mt-12">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                        {error ?? "Employee not found"}
                    </p>
                    <button
                        onClick={() => router.push("/employees")}
                        className="mt-2 px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                        Back to employees
                    </button>
                </div>
            </div>
        );
    }

    return <EmployeeDetailView employee={employee} onRefresh={silentRefresh} />;
}