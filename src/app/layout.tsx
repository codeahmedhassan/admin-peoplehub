import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        <SidebarProvider>
          <div className="w-full max-w-360 mx-auto bg-[#F1F3F7] rounded-3xl lg:rounded-4xl pe-6 shadow-2xl border border-slate-200/60 flex gap-0 lg:gap-6 items-start">
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