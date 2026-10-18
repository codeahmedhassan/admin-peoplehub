import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "PeopleHub Dashboard",
  description: "HR Management Dashboard",
};

const API_BASE_URL =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000/api/v1";

const LANDING_URL =
  process.env.NEXT_PUBLIC_MARKETING_URL || "http://localhost:3001";

async function getSessionUser() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`${API_BASE_URL}/auth/session`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: { authenticated?: boolean; user?: unknown };
    };
    if (!data?.data?.authenticated) return null;
    return data.data.user ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard. Runs on every request before any HTML is sent.
  // proxy.ts already does this, but doing it here too means the layout
  // has the user object available without a second network round trip.
  const user = await getSessionUser();

  if (!user) {
    // Hard redirect at the server level. Browser never sees any admin HTML.
    redirect(LANDING_URL);
  }

  return (
    <html lang="en" className={jakarta.variable}>
      <body className="text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        <SidebarProvider>
          <div className="w-full max-w-360 mx-auto bg-[#F1F3F7] pe-6 shadow-2xl border border-slate-200/60 flex gap-0 lg:gap-6 items-start">
            <Sidebar />
            <main className="flex-1 min-w-0 flex flex-col gap-6">
              <Navbar />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}