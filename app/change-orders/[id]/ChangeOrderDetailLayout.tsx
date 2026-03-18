"use client";

import { useParams } from "next/navigation";
import { TabbedWorkspace } from "@/components/layout/TabbedWorkspace";
import { StatusBadge } from "@/components/domain/StatusBadge";
import type { ChangeOrder } from "@/lib/domain/types";
import type { Project } from "@/lib/domain/types";

export function ChangeOrderDetailLayout({
  changeOrder,
  project,
  children,
}: {
  changeOrder: ChangeOrder;
  project: Project | null;
  children: React.ReactNode;
}) {
  const params = useParams();
  const id = params?.id as string;
  const base = `/change-orders/${id}`;
  const tabs = [
    { id: "overview", label: "Overview", href: base },
    { id: "scope", label: "Scope review", href: `${base}/scope` },
    { id: "pricing", label: "Pricing recommendation", href: `${base}/pricing` },
    { id: "assumptions", label: "Assumptions & evidence", href: `${base}/assumptions` },
    { id: "approval", label: "Approval workflow", href: `${base}/approval` },
    { id: "audit", label: "Audit history", href: `${base}/audit` },
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center gap-3">
          {project && (
            <span className="text-xs text-gray-500">
              {project.projectNumber} – {project.name}
            </span>
          )}
          <span className="text-sm font-medium text-gray-900">
            {changeOrder.changeOrderNumber} · {changeOrder.title}
          </span>
          <StatusBadge status={changeOrder.status} />
        </div>
      </div>
      <TabbedWorkspace tabs={tabs}>{children}</TabbedWorkspace>
    </div>
  );
}
