"use client";

import type { ReactNode } from "react";

type User = {
    id: string;
    fullName: string;
    email: string;
    role?: string;
    company?: string;
};

export default function AdminShell({
    children,
}: {
    user: User;
    children: ReactNode;
}) {
    return (
        <div className="min-h-svh bg-slate-50">
            {/* your sidebar + topbar, using `user` for display */}
            <main>{children}</main>
        </div>
    );
}