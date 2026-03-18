import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Change Order Pricing | AI-Assisted Construction",
  description: "AI-assisted pricing for construction change orders – enterprise workflow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
