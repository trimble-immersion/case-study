import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ApprovalWorkflowService } from "@/lib/services/approvalWorkflowService";
import { DataPanel } from "@/components/domain/DataPanel";
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
    <div className="space-y-4">
      <DataPanel title="Approval status">
        <p className="text-sm font-medium text-gray-900">{co.status}</p>
        {co.dateSubmitted && (
          <p className="mt-1 text-xs text-gray-500">
            Submitted {new Date(co.dateSubmitted).toLocaleString()}
          </p>
        )}
      </DataPanel>
      {steps.length > 0 && (
        <DataPanel title="Approval history">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="pb-2 pr-4 font-medium">Sequence</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 font-medium">Approved by</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {steps.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 pr-4 text-gray-900">{s.sequence}</td>
                  <td className="py-2 pr-4 text-gray-700">{s.status}</td>
                  <td className="py-2 pr-4 text-gray-700">{s.approvedBy ?? "—"}</td>
                  <td className="py-2 text-gray-700">
                    {s.approvedAt
                      ? new Date(s.approvedAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataPanel>
      )}
      <ApprovalForm changeOrder={co} />
    </div>
  );
}
