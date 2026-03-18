"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export interface TabConfig {
  id: string;
  label: string;
  href: string;
}

export function TabbedWorkspace({
  tabs,
  children,
}: {
  tabs: TabConfig[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab bar – flat, dense, enterprise */}
      <div className="flex shrink-0 border-b border-[#8a9aaa] bg-[#c8d4de]">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-3 py-1 text-[11px] font-medium border-r border-[#8a9aaa] whitespace-nowrap ${
                active
                  ? "bg-white text-[#1a2a3a] border-b-2 border-b-[#1a4a7a]"
                  : "text-[#2a3a4a] hover:bg-[#b8c8d8] hover:text-[#1a2a3a]"
              }`}
              style={{ marginBottom: active ? -1 : 0 }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      {/* Content area */}
      <div className="flex-1 overflow-auto bg-[#dde2e8] p-2">{children}</div>
    </div>
  );
}
