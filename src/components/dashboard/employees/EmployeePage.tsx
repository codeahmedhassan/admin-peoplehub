"use client";

import { useEffect, useMemo, useState } from "react";
import { type Employee } from "@/lib/constants";
import { employeeApi, ApiError } from "@/lib/api";
import { mapApiEmployeeToUi } from "@/lib/employee-mapper";
import EmployeePageHeader from "./EmployeePageHeader";
import EmployeeStats from "./EmployeeStats";
import EmployeeFilters from "./EmployeeFilters";
import EmployeeTable from "./EmployeeTable";
import EmployeePagination from "./EmployeePagination";
import BulkActionBar from "./BulkActionBar";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

type LoadState = "loading" | "ready" | "error";

export default function EmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loadState, setLoadState] = useState<LoadState>("loading");
    const [loadError, setLoadError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [branch, setBranch] = useState("");
    const [status, setStatus] = useState("");
    const [onlyIncomplete, setOnlyIncomplete] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Delete confirm
    const [deleteTarget, setDeleteTarget] = useState<{
        ids: string[];
        label: string;
    } | null>(null);
    const [deleting, setDeleting] = useState(false);

    // ---------- Load employees on mount ----------
    useEffect(() => {
        let cancelled = false;

        (async () => {
            setLoadState("loading");
            setLoadError(null);
            try {
                const { employees: apiEmployees } = await employeeApi.list();
                if (cancelled) return;
                const mapped = apiEmployees.map(mapApiEmployeeToUi);
                setEmployees(mapped);
                setLoadState("ready");
            } catch (err) {
                if (cancelled) return;
                setLoadError(
                    err instanceof ApiError
                        ? err.message
                        : "Failed to load employees. Please refresh."
                );
                setLoadState("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // ---------- Derived filtered list ----------
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return employees.filter((e) => {
            if (department && e.department !== department) return false;
            if (branch && e.branch !== branch) return false;
            if (status && e.status !== status) return false;
            if (onlyIncomplete && !e.incomplete) return false;
            if (q) {
                const hay = `${e.name} ${e.employeeId} ${e.id} ${e.email} ${e.designation}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [employees, search, department, branch, status, onlyIncomplete]);

    const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
    const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    // ---------- Selection handlers ----------
    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        setSelectedIds((prev) => {
            const allSelected = paginated.every((e) => prev.has(e.id));
            const next = new Set(prev);
            if (allSelected) {
                paginated.forEach((e) => next.delete(e.id));
            } else {
                paginated.forEach((e) => next.add(e.id));
            }
            return next;
        });
    };

    const clearSelection = () => setSelectedIds(new Set());

    // ---------- Reset filters ----------
    const resetFilters = () => {
        setSearch("");
        setDepartment("");
        setBranch("");
        setStatus("");
        setOnlyIncomplete(false);
        setPage(1);
    };

    // ---------- Delete ----------
    const requestDelete = (emp: Employee) => {
        setDeleteTarget({ ids: [emp.id], label: emp.name });
    };

    const requestBulkDelete = () => {
        if (selectedIds.size === 0) return;
        setDeleteTarget({
            ids: Array.from(selectedIds),
            label: `${selectedIds.size} employees`,
        });
    };

    const confirmDelete = async () => {
        if (!deleteTarget || deleting) return;
        setDeleting(true);
        try {
            // Fire deletes in parallel. If any fail, we surface a message but
            // still remove the successful ones from local state so the UI stays
            // consistent with the server.
            const results = await Promise.allSettled(
                deleteTarget.ids.map((id) => employeeApi.remove(id))
            );

            const failedIds = new Set<string>();
            results.forEach((r, i) => {
                if (r.status === "rejected") {
                    failedIds.add(deleteTarget.ids[i]);
                }
            });

            if (failedIds.size > 0) {
                setLoadError(
                    `Failed to delete ${failedIds.size} of ${deleteTarget.ids.length} employee(s).`
                );
            }

            const successfulIds = new Set(
                deleteTarget.ids.filter((id) => !failedIds.has(id))
            );
            setEmployees((prev) => prev.filter((e) => !successfulIds.has(e.id)));
            setSelectedIds(new Set());
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    };

    // ---------- Edit ----------
    const editEmployee = (emp: Employee) => {
        // TODO: navigate to an edit page. For now, open the detail page.
        window.location.href = `/employees/${emp.id}`;
    };

    // ---------- Render: loading ----------
    if (loadState === "loading") {
        return (
            <div className="flex flex-col gap-6 mb-8">
                <EmployeePageHeader />
                <div className="flex items-center justify-center py-24">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                        <div className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                        Loading employees…
                    </div>
                </div>
            </div>
        );
    }

    // ---------- Render: error ----------
    if (loadState === "error") {
        return (
            <div className="flex flex-col gap-6 mb-8">
                <EmployeePageHeader />
                <div className="bg-white rounded-[28px] p-8 border border-slate-200/60">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{"Couldn't"} load employees</p>
                        <p className="text-xs text-slate-500 max-w-sm">{loadError}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-text-dark rounded-full text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ---------- Render: ready ----------
    return (
        <div className="flex flex-col gap-6 mb-8">
            <EmployeePageHeader />
            <EmployeeStats employees={employees} />

            {loadError && (
                <div
                    role="alert"
                    className="flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3"
                >
                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                    </svg>
                    <span>{loadError}</span>
                </div>
            )}

            <EmployeeFilters
                search={search}
                onSearchChange={(v) => {
                    setSearch(v);
                    setPage(1);
                }}
                department={department}
                onDepartmentChange={(v) => {
                    setDepartment(v);
                    setPage(1);
                }}
                branch={branch}
                onBranchChange={(v) => {
                    setBranch(v);
                    setPage(1);
                }}
                status={status}
                onStatusChange={(v) => {
                    setStatus(v);
                    setPage(1);
                }}
                onlyIncomplete={onlyIncomplete}
                onOnlyIncompleteChange={(v) => {
                    setOnlyIncomplete(v);
                    setPage(1);
                }}
                onReset={resetFilters}
            />

            <div>
                <EmployeeTable
                    employees={paginated}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                    onEdit={editEmployee}
                    onDelete={requestDelete}
                />
                <EmployeePagination
                    page={safePage}
                    pageSize={pageSize}
                    totalItems={filtered.length}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                />
            </div>

            <BulkActionBar
                count={selectedIds.size}
                onClear={clearSelection}
                onDelete={requestBulkDelete}
            />

            <DeleteConfirmDialog
                open={!!deleteTarget}
                count={deleteTarget?.ids.length ?? 0}
                onCancel={() => {
                    if (!deleting) setDeleteTarget(null);
                }}
                onConfirm={confirmDelete}
            />
        </div>
    );
}