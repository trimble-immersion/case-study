import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ProjectService } from "@/lib/services/projectService";
import { DataPanel } from "@/components/domain/DataPanel";
import { StatusBadge } from "@/components/domain/StatusBadge";

export default async function ChangeOrderOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  const project = co ? ProjectService.getProjectById(co.projectId) : null;
  if (!co) return null;

  return (
    <div>
      {/* Record header fields */}
      <DataPanel title="RECORD HEADER — Change Order Master Data">
        <table>
          <tbody>
            <tr>
              <td className="text-[#6a7e90] font-medium w-36">CO Number</td>
              <td className="font-bold">{co.changeOrderNumber}</td>
              <td className="text-[#6a7e90] font-medium w-36 pl-4">Status</td>
              <td><StatusBadge status={co.status} /></td>
              <td className="text-[#6a7e90] font-medium w-36 pl-4">Record ID</td>
              <td className="text-[10px] text-[#6a7e90]">{co.id}</td>
            </tr>
            <tr>
              <td className="text-[#6a7e90] font-medium">Title</td>
              <td colSpan={3}>{co.title}</td>
              <td className="text-[#6a7e90] font-medium pl-4">Cost Code</td>
              <td className={!co.costCode ? "warn-cell" : ""}>{co.costCode ?? <span className="text-[#cc4400]">NOT ASSIGNED</span>}</td>
            </tr>
            <tr>
              <td className="text-[#6a7e90] font-medium">Requester</td>
              <td>{co.requester ?? "—"}</td>
              <td className="text-[#6a7e90] font-medium pl-4">Date Submitted</td>
              <td>{co.dateSubmitted ? new Date(co.dateSubmitted).toLocaleString() : <span className="text-[#9aa8b6]">—</span>}</td>
              <td className="text-[#6a7e90] font-medium pl-4">Created By</td>
              <td>{co.createdBy ?? "—"}</td>
            </tr>
            <tr>
              <td className="text-[#6a7e90] font-medium">Created</td>
              <td>{new Date(co.createdAt).toLocaleString()}</td>
              <td className="text-[#6a7e90] font-medium pl-4">Last Modified</td>
              <td>{new Date(co.updatedAt).toLocaleString()}</td>
              <td className="text-[#6a7e90] font-medium pl-4">Modified By</td>
              <td>{co.modifiedBy ?? <span className="text-[#9aa8b6]">—</span>}</td>
            </tr>
          </tbody>
        </table>
      </DataPanel>

      {/* Scope description */}
      <DataPanel title="SCOPE DESCRIPTION">
        <div className="border border-[#b0bcc8] bg-[#f4f6f8] px-2 py-1 text-[11px]">{co.description}</div>
      </DataPanel>

      {/* Financial summary */}
      <DataPanel title="FINANCIAL SUMMARY — Estimate vs. Final">
        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th style={{ textAlign: "right" }}>Value ($)</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Labor Input (hrs)</td>
              <td style={{ textAlign: "right" }}>{co.laborHours} hrs</td>
              <td className="warn-cell">Manual</td>
              <td className="text-[#6a7e90]">@ $85.00/hr standard rate</td>
            </tr>
            <tr>
              <td className="font-medium">Material</td>
              <td style={{ textAlign: "right" }}>{co.materialTotal.toFixed(2)}</td>
              <td className="warn-cell">Manual</td>
              <td className="text-[#6a7e90]">Verify against PO</td>
            </tr>
            <tr>
              <td className="font-medium">Equipment</td>
              <td style={{ textAlign: "right" }}>{co.equipmentTotal.toFixed(2)}</td>
              <td className="warn-cell">Manual</td>
              <td className="text-[#6a7e90]">+15% markup applied</td>
            </tr>
            <tr>
              <td className="font-medium">Subcontractor</td>
              <td style={{ textAlign: "right" }}>{co.subcontractorTotal.toFixed(2)}</td>
              <td className="text-[#6a7e90]">—</td>
              <td className="text-[#6a7e90]">—</td>
            </tr>
            <tr style={{ backgroundColor: "#e4eaf0" }}>
              <td className="font-semibold">Recommended Estimate</td>
              <td style={{ textAlign: "right", fontWeight: 600 }}>{co.recommendedTotal.toFixed(2)}</td>
              <td>{co.currentRecommendationId ? <span className="text-[#4a7a4a]">Generated</span> : <span className="warn-cell">NOT PRICED</span>}</td>
              <td className="text-[#6a7e90]">AI-assisted pricing output</td>
            </tr>
            <tr style={{ backgroundColor: "#1a3a5c" }}>
              <td style={{ color: "white", fontWeight: 700, border: "1px solid #0a2038" }}>Final Approved Total</td>
              <td style={{ textAlign: "right", color: "white", fontWeight: 700, border: "1px solid #0a2038" }}>{co.finalTotal.toFixed(2)}</td>
              <td style={{ border: "1px solid #0a2038" }}>
                {co.status === "Approved" ? <span style={{ color: "#88dd88", fontWeight: 600 }}>APPROVED</span> : <span style={{ color: "#ffcc88" }}>PENDING</span>}
              </td>
              <td style={{ color: "#9ab8d0", border: "1px solid #0a2038" }}>Record in workflow</td>
            </tr>
          </tbody>
        </table>
      </DataPanel>

      {/* Project linkage */}
      {project && (
        <DataPanel title="LINKED PROJECT RECORD">
          <table>
            <tbody>
              <tr>
                <td className="text-[#6a7e90] font-medium w-36">Project Number</td>
                <td>{project.projectNumber}</td>
                <td className="text-[#6a7e90] font-medium pl-4 w-36">Project Name</td>
                <td>{project.name}</td>
              </tr>
              <tr>
                <td className="text-[#6a7e90] font-medium">Owner</td>
                <td>{project.owner}</td>
                <td className="text-[#6a7e90] font-medium pl-4">Contract Value</td>
                <td>${project.contractValue.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="text-[#6a7e90] font-medium">ERP Record ID</td>
                <td className="text-[#4a7aaa]">{project.linkedProjectRecordId ?? "—"}</td>
                <td className="text-[#6a7e90] font-medium pl-4">ERP Sync Status</td>
                <td className="text-[#cc6600]">PENDING SYNC</td>
              </tr>
            </tbody>
          </table>
        </DataPanel>
      )}
    </div>
  );
}
