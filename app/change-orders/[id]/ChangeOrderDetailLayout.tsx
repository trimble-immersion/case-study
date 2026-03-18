"use client";

import { useParams } from "next/navigation";
import { TabbedWorkspace } from "@/components/layout/TabbedWorkspace";
import { StatusBadge } from "@/components/domain/StatusBadge";
import type { ChangeOrder, Project } from "@/lib/domain/types";

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
    { id: "scope", label: "Scope / Line Items", href: `${base}/scope` },
    { id: "pricing", label: "Pricing", href: `${base}/pricing` },
    { id: "assumptions", label: "Assumptions", href: `${base}/assumptions` },
    { id: "approval", label: "Approval", href: `${base}/approval` },
    { id: "audit", label: "Audit Log", href: `${base}/audit` },
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Dense context bar */}
      <div className="shrink-0 border-b border-[#8a9aaa] bg-[#1a3a5c] px-2 py-0" style={{ height: 28 }}>
        <div className="flex items-center gap-4 h-full">
          <span className="text-[10px] text-[#7ab0d8] uppercase tracking-wide">Record:</span>
          <span className="text-[11px] font-bold text-white">{changeOrder.changeOrderNumber}</span>
          <span className="text-[10px] text-[#a0c0e0]">|</span>
          <span className="text-[11px] text-[#c8dff0]">{changeOrder.title}</span>
          <span className="text-[10px] text-[#a0c0e0]">|</span>
          {project && (
            <>
              <span className="text-[10px] text-[#7ab0d8]">Project:</span>
              <span className="text-[11px] text-[#c8dff0]">{project.projectNumber}</span>
              <span className="text-[10px] text-[#a0c0e0]">|</span>
            </>
          )}
          <span className="text-[10px] text-[#7ab0d8]">Cost Code:</span>
          <span className="text-[11px] text-[#c8dff0]">{changeOrder.costCode ?? "—"}</span>
          <span className="text-[10px] text-[#a0c0e0]">|</span>
          <StatusBadge status={changeOrder.status} />
          <span className="text-[10px] text-[#a0c0e0]">|</span>
          <span className="text-[10px] text-[#7ab0d8]">Requested by:</span>
          <span className="text-[11px] text-[#c8dff0]">{changeOrder.requester ?? "—"}</span>
        </div>
      </div>
      {/* Secondary toolbar */}
      <div className="shrink-0 border-b border-[#8a9aaa] bg-[#e4eaf0] px-2" style={{ height: 26 }}>
        <div className="flex items-center gap-1 h-full">
          <button className="btn-toolbar">Save</button>
          <button className="btn-toolbar">Print</button>
          <button className="btn-toolbar">Export CSV</button>
          <span className="mx-1 text-[#9aa8b6]">|</span>
          <button className="btn-toolbar">Attach Document</button>
          <button className="btn-toolbar">Add Note</button>
          <span className="mx-1 text-[#9aa8b6]">|</span>
          <button className="btn-toolbar">Sync to ERP</button>
          <button className="btn-toolbar">Sync to ProjectSight</button>
          <span className="ml-auto text-[10px] text-[#6a7e90]">
            Modified: {new Date(changeOrder.updatedAt).toLocaleString()} · {changeOrder.modifiedBy ?? "—"}
          </span>
        </div>
      </div>
      <TabbedWorkspace tabs={tabs}>{children}</TabbedWorkspace>
    </div>
  );
}
