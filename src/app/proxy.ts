// proxy.ts  (admin panel — localhost:3002)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MARKETING_URL =
    process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3001";

const ACCESS_COOKIE = "ph_at";
const REFRESH_COOKIE = "ph_rt";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/favicon") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const hasAccess = Boolean(req.cookies.get(ACCESS_COOKIE)?.value);
    const hasRefresh = Boolean(req.cookies.get(REFRESH_COOKIE)?.value);

    // If they have NEITHER token, they are logged out.
    if (!hasAccess && !hasRefresh) {
        return NextResponse.redirect(new URL("/signin", MARKETING_URL));
    }

    // If they have at least one, let the request through.
    // The layout.tsx will do the real validation and silent refresh.
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};