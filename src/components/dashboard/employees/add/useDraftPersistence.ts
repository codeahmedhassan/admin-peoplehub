"use client";

import { useEffect, useRef, useState } from "react";
import {
    createEmptyDraft,
    generateEmployeeId,
    EMPLOYEE_DRAFT_STORAGE_KEY,
    type EmployeeDraft,
    sanitizeDraftForStorage,
} from "@/lib/employee-form";

interface StoredPayload {
    step: number;
    draft: EmployeeDraft;
    savedAt: number;
}

export function useDraftPersistence() {
    const [ready, setReady] = useState(false);
    const [step, setStep] = useState(1);
    const [draft, setDraft] = useState<EmployeeDraft | null>(null);
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const firstSync = useRef(true);

    // Restore on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(EMPLOYEE_DRAFT_STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as StoredPayload;
                if (parsed?.draft) {
                    // 👇 Normalize — fill in any fields that older drafts don't have
                    const migratedDraft: EmployeeDraft = {
                        ...createEmptyDraft(
                            parsed.draft.employeeId ?? generateEmployeeId(),
                            new Date().toISOString().slice(0, 10)
                        ),
                        ...parsed.draft,
                        // Ensure array fields are always arrays
                        documents: Array.isArray(parsed.draft.documents)
                            ? parsed.draft.documents
                            : [],
                    };
                    setDraft(migratedDraft);
                    setStep(parsed.step ?? 1);
                    setLastSavedAt(parsed.savedAt ?? null);
                    setReady(true);
                    return;
                }
            }
        } catch {
            // Ignore corrupt storage
        }
        const today = new Date().toISOString().slice(0, 10);
        setDraft(createEmptyDraft(generateEmployeeId(), today));
        setReady(true);
    }, []);

    // Persist on change (debounced slightly to avoid thrashing)
    useEffect(() => {
        if (!ready || !draft) return;
        if (firstSync.current) {
            firstSync.current = false;
            return;
        }
        const timer = setTimeout(() => {
            const payload: StoredPayload = {
                step,
                draft: sanitizeDraftForStorage(draft),
                savedAt: Date.now(),
            };
            try {
                localStorage.setItem(EMPLOYEE_DRAFT_STORAGE_KEY, JSON.stringify(payload));
                setLastSavedAt(payload.savedAt);
            } catch {
                // Ignore quota errors
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [draft, step, ready]);

    const updateDraft = (patch: Partial<EmployeeDraft>) => {
        setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
    };

    const clearDraft = () => {
        try {
            localStorage.removeItem(EMPLOYEE_DRAFT_STORAGE_KEY);
        } catch {
            // ignore
        }
    };

    return { ready, step, setStep, draft, updateDraft, lastSavedAt, clearDraft };
}