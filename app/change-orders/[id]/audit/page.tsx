import { notFound } from "next/navigation";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { AuditService } from "@/lib/services/auditService";
import { ProjectService } from "@/lib/services/projectService";
import { ActivityFeed } from "@/components/domain/ActivityFeed";
import { ChangeOrderDetailLayout } from "../ChangeOrderDetailLayout";

export default function AuditPage({ params }: { params: { id: string } }) {
  const co = ChangeOrderService.getChangeOrderById(params.id);
  if (!co) return notFound();
  const project = ProjectService.getProjectById(co.projectId) ?? null;
  const records = AuditService.getAuditRecords(params.id);

  return (
    <ChangeOrderDetailLayout changeOrder={co} project={project}>
      <div className="toolbar-strip" style={{ marginBottom: 8 }}>
        <span className="toolbar-label">AUDIT LOG — Immutable Record</span>
        <span className="toolbar-sep">|</span>
        <button className="btn-toolbar">Export CSV</button>
        <button className="btn-toolbar">Print</button>
        <span className="toolbar-sep">|</span>
        <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
          {records.length} event(s) recorded
        </span>
      </div>

      <div className="panel">
        <div className="panel-header">AUDIT LOG — {co.changeOrderNumber}</div>
        <div style={{ padding: 0 }}>
          <ActivityFeed events={records} />
        </div>
      </div>
    </ChangeOrderDetailLayout>
  );
}
