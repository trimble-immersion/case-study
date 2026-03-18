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
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                active
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
      <div className="flex-1 overflow-auto bg-gray-50 p-4">{children}</div>
    </div>
  );
}
