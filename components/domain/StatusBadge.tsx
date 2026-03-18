"use client";

import type { ApprovalStatus } from "@/lib/domain/types";

const statusStyles: Record<
  ApprovalStatus,
  string
> = {
  Draft: "bg-gray-100 text-gray-700",
  "In Review": "bg-amber-100 text-amber-800",
  Priced: "bg-blue-100 text-blue-800",
  "Needs Revision": "bg-orange-100 text-orange-800",
  "Pending Approval": "bg-sky-100 text-sky-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Synced: "bg-slate-100 text-slate-700",
};

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${
        statusStyles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
