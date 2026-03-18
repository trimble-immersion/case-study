"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    group: "WORKSPACE",
    items: [
      { href: "/", label: "Dashboard" },
      { href: "/change-orders", label: "Change Orders" },
      { href: "/intake", label: "New CO – Intake" },
      { href: "/finance", label: "Finance / Billable" },
    ],
  },
  {
    group: "SYSTEMS",
    items: [
      { href: "/settings", label: "Integrations" },
      { href: "/settings", label: "ERP Sync Status", warn: true },
      { href: "/settings", label: "Document Control" },
    ],
  },
  {
    group: "ADMIN",
    items: [
      { href: "/settings", label: "Cost Code Table" },
      { href: "/settings", label: "Labor Rate Table" },
      { href: "/settings", label: "Project Registry" },
      { href: "/settings", label: "User Permissions" },
    ],
  },
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-col border-r border-[#0a2038] bg-[#1a3a5c] overflow-y-auto shrink-0"
      style={{ width: 180, minWidth: 180 }}
    >
      {/* Module header */}
      <div className="border-b border-[#0a2038] bg-[#0f2a45] px-2 py-1.5">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#7ab0d8]">CO PRICING</div>
        <div className="text-[9px] text-[#4a7090] mt-0.5">v3.2.1 · Build 20240210</div>
      </div>

      {/* Nav groups */}
      {navGroups.map((group) => (
        <div key={group.group} className="border-b border-[#0f2a45]">
          <div className="px-2 py-1 text-[9px] font-bold tracking-widest uppercase text-[#4a7090]">
            {group.group}
          </div>
          {group.items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-3 py-1 text-[11px] border-b border-[#0f2a45] ${
                  active
                    ? "bg-[#2563a8] text-white font-semibold"
                    : "text-[#a8c4dc] hover:bg-[#1e4878] hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {"warn" in item && item.warn && (
                  <span className="text-[9px] bg-[#cc4400] text-white px-1">!</span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* Bottom status strip */}
      <div className="mt-auto border-t border-[#0a2038] px-2 py-1">
        <div className="text-[9px] text-[#4a7090]">Last sync: 06:00 UTC</div>
        <div className="text-[9px] text-[#cc6600] mt-0.5">⚠ Estimating: offline</div>
      </div>
    </nav>
  );
}
