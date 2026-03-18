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
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {/* Record context bar */}
      <div
        style={{
          flexShrink: 0,
          height: 30,
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--nav-border)",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 10, color: "var(--nav-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Record:</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{changeOrder.changeOrderNumber}</span>
        <span style={{ fontSize: 11, color: "var(--nav-text)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {changeOrder.title}
        </span>
        <span style={{ color: "var(--nav-text-muted)", fontSize: 10 }}>|</span>
        {project && (
          <>
            <span style={{ fontSize: 10, color: "var(--nav-text-muted)" }}>Project:</span>
            <span style={{ fontSize: 11, color: "var(--nav-text)" }}>{project.projectNumber}</span>
            <span style={{ color: "var(--nav-text-muted)", fontSize: 10 }}>|</span>
          </>
        )}
        <span style={{ fontSize: 10, color: "var(--nav-text-muted)" }}>Cost Code:</span>
        <span style={{ fontSize: 11, color: changeOrder.costCode ? "var(--nav-text)" : "#B45309" }}>
          {changeOrder.costCode ?? "NOT ASSIGNED"}
        </span>
        <span style={{ color: "var(--nav-text-muted)", fontSize: 10 }}>|</span>
        <StatusBadge status={changeOrder.status} />
      </div>

      {/* Secondary toolbar */}
      <div className="toolbar-strip">
        <button className="btn-toolbar">Save</button>
        <button className="btn-toolbar">Print</button>
        <button className="btn-toolbar">Export CSV</button>
        <span className="toolbar-sep">|</span>
        <button className="btn-toolbar">Attach Document</button>
        <button className="btn-toolbar">Add Note</button>
        <span className="toolbar-sep">|</span>
        <button className="btn-toolbar">Sync to ERP</button>
        <button className="btn-toolbar">Sync to ProjectSight</button>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-muted)" }}>
          Modified: {new Date(changeOrder.updatedAt).toLocaleString()}
          {changeOrder.modifiedBy && ` · ${changeOrder.modifiedBy}`}
        </span>
      </div>

      <TabbedWorkspace tabs={tabs}>{children}</TabbedWorkspace>
    </div>
  );
}
