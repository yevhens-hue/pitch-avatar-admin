import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import "./globals.css";
import AdminSidebar from "@/components/AdminSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pitch Avatar Admin",
  description: "Pitch Avatar Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex bg-slate-50 font-sans antialiased text-slate-900">
        <Suspense fallback={<div className="w-[260px] shrink-0 bg-white border-r border-slate-200" />}>
          <AdminSidebar />
        </Suspense>
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header */}
          <header className="h-16 flex items-center justify-end px-6 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 w-4 h-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-600">super-admin</span>
            </div>
          </header>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-white">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
