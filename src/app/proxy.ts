// proxy.ts  (admin panel — localhost:3002)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL =
    process.env.API_INTERNAL_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000/api/v1";

const MARKETING_URL =
    process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3001";

type SessionUser = {
    emailVerified?: boolean;
    setupCompletedAt?: string | null;
};

type SessionResult =
    | { state: "unauthenticated" }
    | { state: "unverified" }
    | { state: "needs-setup" }
    | { state: "ready" };

async function getSessionState(cookieHeader: string): Promise<SessionResult> {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/session`, {
            method: "GET",
            headers: { cookie: cookieHeader },
            cache: "no-store",
        });
        if (!res.ok) return { state: "unauthenticated" };

        const data = (await res.json()) as {
            data?: { authenticated?: boolean; user?: SessionUser | null };
        };

        if (!data?.data?.authenticated || !data.data.user) {
            return { state: "unauthenticated" };
        }

        const user = data.data.user;
        if (!user.emailVerified) return { state: "unverified" };
        if (!user.setupCompletedAt) return { state: "needs-setup" };

        return { state: "ready" };
    } catch {
        return { state: "unauthenticated" };
    }
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }
    const matcher = ["/((?!_next/static|_next/image|favicon.ico).*)"];

    const cookieHeader = req.headers.get("cookie") || "";
    const session = await getSessionState(cookieHeader);

    if (session.state === "unauthenticated") {
        return NextResponse.redirect(new URL("/signin", MARKETING_URL));
    }

    if (session.state === "unverified") {
        return NextResponse.redirect(new URL("/verify-email", MARKETING_URL));
    }

    if (session.state === "needs-setup") {
        return NextResponse.redirect(
            new URL("/setup-workspace", MARKETING_URL)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};