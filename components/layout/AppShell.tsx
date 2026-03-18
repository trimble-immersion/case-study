"use client";

import { LeftNav } from "./LeftNav";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#dde2e8]">
      {/* Top application bar */}
      <TopBar />
      {/* Below top bar: left nav + main content */}
      <div className="flex flex-1 min-h-0">
        <LeftNav />
        <div className="flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
