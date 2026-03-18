import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ApprovalWorkflowService } from "@/lib/services/approvalWorkflowService";
import { DataPanel } from "@/components/domain/DataPanel";
import { StatusBadge } from "@/components/domain/StatusBadge";
import { ApprovalForm } from "./ApprovalForm";

export default async function ApprovalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const co = ChangeOrderService.getChangeOrderById(id);
  if (!co) return null;
  const steps = ApprovalWorkflowService.getApprovalSteps(id);

  return (
    <div>
      {/* Status header */}
      <DataPanel title="APPROVAL STATUS — Current Workflow State">
        <table>
          <tbody>
            <tr>
              <td className="text-[#6a7e90] font-medium">Current Status</td>
              <td><StatusBadge status={co.status} /></td>
              <td className="text-[#6a7e90] font-medium pl-4">Date Submitted</td>
              <td>{co.dateSubmitted ? new Date(co.dateSubmitted).toLocaleString() : <span className="text-[#9aa8b6]">Not submitted</span>}</td>
              <td className="text-[#6a7e90] font-medium pl-4">Final Total</td>
              <td className="font-semibold">${co.finalTotal.toFixed(2)}</td>
              <td className="text-[#6a7e90] font-medium pl-4">Requester</td>
              <td>{co.requester ?? "—"}</td>
            </tr>
          </tbody>
        </table>
        {co.status === "Draft" && (
          <div className="mt-1 border border-[#c8a000] bg-[#fff8e0] px-2 py-1 text-[11px] text-[#7a5000]">
            ⚠ Record is in DRAFT status. Submit for approval from the Pricing tab after generating a pricing estimate.
          </div>
        )}
      </DataPanel>

      {/* Approval history */}
      <DataPanel title="APPROVAL HISTORY — Workflow Steps">
        {steps.length === 0 ? (
          <div className="text-[11px] text-[#6a7e90]">No approval steps on record.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Seq.</th>
                <th>Status</th>
                <th>Approved / Rejected By</th>
                <th>Date</th>
                <th>Comment</th>
                <th>Delta (Final vs. Est.)</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s) => (
                <tr key={s.id}>
                  <td>{s.sequence}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>{s.approvedBy ?? <span className="text-[#9aa8b6]">Pending</span>}</td>
                  <td className="whitespace-nowrap">
                    {s.approvedAt ? new Date(s.approvedAt).toLocaleString() : <span className="text-[#9aa8b6]">—</span>}
                  </td>
                  <td>{s.comment ?? <span className="text-[#9aa8b6]">—</span>}</td>
                  <td className="text-[#6a7e90]">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </DataPanel>

      {/* Approval form */}
      <DataPanel title="APPROVAL ACTION — PM Review and Decision">
        <ApprovalForm changeOrder={co} />
      </DataPanel>
    </div>
  );
}
