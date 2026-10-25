"use client";

import { useEffect, useState } from "react";

export default function ClientRefreshLoader() {
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function attemptRefresh() {
            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

                // Hit the Express backend directly
                const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                    method: "POST",
                    credentials: "include",
                    cache: "no-store",
                });

                if (res.ok) {
                    // Refresh worked! The browser received the new Set-Cookie headers.
                    // Reload the page so the server layout sees the new ph_at cookie.
                    if (mounted) {
                        window.location.reload();
                    }
                } else {
                    // Refresh failed (rt expired, invalid, or backend 500)
                    if (mounted) setError(true);
                }
            } catch {
                if (mounted) setError(true);
            }
        }

        attemptRefresh();

        return () => { mounted = false; };
    }, []);

    if (error) {
        const MARKETING_URL = process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3001";
        window.location.href = `${MARKETING_URL}/signin`;
        return null;
    }

    return (
        <div className="min-h-svh flex flex-col items-center justify-center bg-[#F1F3F7]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-sm font-semibold text-slate-500">
                    Restoring your session…
                </p>
            </div>
        </div>
    );
}