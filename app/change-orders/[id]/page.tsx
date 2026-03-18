import { notFound } from "next/navigation";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ProjectService } from "@/lib/services/projectService";
import { StatusBadge } from "@/components/domain/StatusBadge";
import { ChangeOrderDetailLayout } from "./ChangeOrderDetailLayout";

export default function ChangeOrderOverviewPage({
  params,
}: {
  params: { id: string };
}) {
  const co = ChangeOrderService.getChangeOrderById(params.id);
  if (!co) return notFound();
  const project = ProjectService.getProjectById(co.projectId) ?? null;

  return (
    <ChangeOrderDetailLayout changeOrder={co} project={project}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {/* Record header */}
        <div className="panel" style={{ gridColumn: "1 / -1" }}>
          <div className="panel-header">RECORD HEADER — Change Order Identification</div>
          <div style={{ padding: 0 }}>
            <table>
              <tbody>
                <tr>
                  <th style={{ width: 140 }}>CO Number</th>
                  <td style={{ fontWeight: 600 }}>{co.changeOrderNumber}</td>
                  <th style={{ width: 140 }}>Status</th>
                  <td><StatusBadge status={co.status} /></td>
                  <th style={{ width: 140 }}>Record Type</th>
                  <td>Change Order</td>
                </tr>
                <tr>
                  <th>Title</th>
                  <td colSpan={3} style={{ fontWeight: 500 }}>{co.title}</td>
                  <th>Priority</th>
                  <td style={{ color: "var(--text-muted)" }}>Normal</td>
                </tr>
                <tr>
                  <th>Cost Code</th>
                  <td className={!co.costCode ? "warn-cell" : ""}>{co.costCode ?? "MISSING — manual entry required"}</td>
                  <th>Requester</th>
                  <td>{co.requester ?? "—"}</td>
                  <th>Date Created</th>
                  <td style={{ color: "var(--text-secondary)" }}>{new Date(co.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td colSpan={5} style={{ color: "var(--text-secondary)" }}>{co.description || "No description provided."}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial summary */}
        <div className="panel">
          <div className="panel-header">FINANCIAL SUMMARY</div>
          <div style={{ padding: 0 }}>
            <table>
              <tbody>
                <tr>
                  <th>Recommended Total</th>
                  <td style={{ textAlign: "right", fontWeight: 600, fontFamily: "monospace" }} className={co.recommendedTotal === 0 ? "warn-cell" : ""}>
                    {co.recommendedTotal > 0 ? `$${co.recommendedTotal.toFixed(2)}` : "NOT PRICED"}
                  </td>
                </tr>
                <tr>
                  <th>Final Approved Total</th>
                  <td style={{ textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>
                    {co.finalTotal > 0 ? `$${co.finalTotal.toFixed(2)}` : "—"}
                  </td>
                </tr>
                <tr>
                  <th>Date Submitted</th>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {co.dateSubmitted ? new Date(co.dateSubmitted).toLocaleDateString() : "Not submitted"}
                  </td>
                </tr>
                <tr>
                  <th>Date Approved</th>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {"—"}
                  </td>
                </tr>
                <tr>
                  <th>Current Rec. ID</th>
                  <td style={{ fontSize: 11, color: "var(--text-muted)" }}>{co.currentRecommendationId ?? "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Project linkage */}
        <div className="panel">
          <div className="panel-header">PROJECT LINKAGE</div>
          <div style={{ padding: 0 }}>
            {project ? (
              <table>
                <tbody>
                  <tr><th>Project Number</th><td style={{ fontWeight: 600 }}>{project.projectNumber}</td></tr>
                  <tr><th>Name</th><td>{project.name}</td></tr>
                  <tr><th>Owner</th><td>{project.owner}</td></tr>
                  <tr><th>Contract Value</th><td style={{ fontFamily: "monospace" }}>${project.contractValue.toLocaleString()}</td></tr>
                  <tr>
                    <th>ERP Record ID</th>
                    <td style={{ color: "var(--blue-muted)", fontSize: 11 }}>{project.linkedProjectRecordId ?? "Not linked"}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="notice-warn" style={{ margin: 8 }}>No project linked to this change order.</p>
            )}
          </div>
        </div>

        {/* Warnings */}
        {(!co.costCode || co.recommendedTotal === 0) && (
          <div className="panel" style={{ gridColumn: "1 / -1", borderColor: "var(--warning-border)" }}>
            <div className="panel-header" style={{ background: "var(--warning-bg)", color: "var(--warning-text)", borderBottomColor: "var(--warning-border)" }}>
              DATA QUALITY WARNINGS
            </div>
            <div className="panel-body">
              <ul style={{ margin: 0, padding: "0 0 0 16px", color: "var(--warning-text)", fontSize: 12 }}>
                {!co.costCode && <li>Cost Code is missing — must be assigned before approval.</li>}
                {co.recommendedTotal === 0 && <li>No pricing estimate on record — generate pricing before submitting for approval.</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </ChangeOrderDetailLayout>
  );
}
