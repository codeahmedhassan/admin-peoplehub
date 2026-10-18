"use client";

import { useMemo, useState } from "react";
import { EMPLOYEES, type Employee } from "@/lib/constants";
import EmployeePageHeader from "./EmployeePageHeader";
import EmployeeStats from "./EmployeeStats";
import EmployeeFilters from "./EmployeeFilters";
import EmployeeTable from "./EmployeeTable";
import EmployeePagination from "./EmployeePagination";
import BulkActionBar from "./BulkActionBar";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function EmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);

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

    // ---------- Derived filtered list ----------
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return employees.filter((e) => {
            if (department && e.department !== department) return false;
            if (branch && e.branch !== branch) return false;
            if (status && e.status !== status) return false;
            if (onlyIncomplete && !e.incomplete) return false;
            if (q) {
                const hay = `${e.name} ${e.id} ${e.email} ${e.designation}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [employees, search, department, branch, status, onlyIncomplete]);

    // Reset to page 1 whenever filters change
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
    const confirmDelete = () => {
        if (!deleteTarget) return;
        setEmployees((prev) => prev.filter((e) => !deleteTarget.ids.includes(e.id)));
        setSelectedIds(new Set());
        setDeleteTarget(null);
    };

    // ---------- Edit ----------
    const editEmployee = (emp: Employee) => {
        console.log("Edit employee:", emp);
    };

    return (
        <div className="flex flex-col gap-6 mb-8">
            <EmployeePageHeader />
            <EmployeeStats employees={employees} />

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
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}