import type { Metadata } from "next";
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
      <body className="min-h-full flex bg-slate-50 font-sans antialiased">
        <AdminSidebar />
        <main className="flex-1 min-w-0 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
