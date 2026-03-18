"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/intake", label: "Change Order Intake" },
  { href: "/change-orders", label: "Change Orders" },
  { href: "/finance", label: "Finance summary" },
  { href: "/settings", label: "Settings" },
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-52 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-12 items-center border-b border-gray-200 px-4">
        <span className="text-sm font-semibold text-gray-800">
          Change Order Pricing
        </span>
      </div>
      <ul className="flex flex-col gap-0.5 p-2">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded px-3 py-2 text-sm ${
                  active
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
