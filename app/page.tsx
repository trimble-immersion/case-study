import Link from "next/link";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { ProjectService } from "@/lib/services/projectService";
import { StatusBadge } from "@/components/domain/StatusBadge";
import { DataPanel } from "@/components/domain/DataPanel";

export default function DashboardPage() {
  const projects = ProjectService.listProjects();
  const changeOrders = ChangeOrderService.listChangeOrders();
  const pending = changeOrders.filter(
    (c) =>
      c.status === "Draft" ||
      c.status === "In Review" ||
      c.status === "Priced" ||
      c.status === "Pending Approval"
  );
  const approved = changeOrders.filter((c) => c.status === "Approved");
  const totalBillable = approved.reduce((s, c) => s + c.finalTotal, 0);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
      <p className="text-sm text-gray-600">
        Work queue and summary. Open a change order to review scope, pricing recommendation, and approval.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <DataPanel title="Projects">
          <p className="text-sm text-gray-700">{projects.length} linked project(s)</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            {projects.slice(0, 3).map((p) => (
              <li key={p.id}>
                {p.projectNumber} – {p.name}
              </li>
            ))}
          </ul>
        </DataPanel>
        <DataPanel title="Pending">
          <p className="text-sm font-medium text-gray-900">{pending.length}</p>
          <p className="text-xs text-gray-500">Draft / In review / Pending approval</p>
        </DataPanel>
        <DataPanel title="Approved (billable)">
          <p className="text-sm font-medium text-gray-900">${totalBillable.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-500">{approved.length} change order(s)</p>
        </DataPanel>
      </div>
      <DataPanel title="Recent change orders">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="pb-2 pr-4 font-medium">Number</th>
                <th className="pb-2 pr-4 font-medium">Title</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 pr-4 text-right font-medium">Final total</th>
                <th className="pb-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {changeOrders.slice(0, 10).map((co) => (
                <tr key={co.id}>
                  <td className="py-2 pr-4 text-gray-900">{co.changeOrderNumber}</td>
                  <td className="py-2 pr-4 text-gray-700">{co.title}</td>
                  <td className="py-2 pr-4">
                    <StatusBadge status={co.status} />
                  </td>
                  <td className="py-2 pr-4 text-right font-medium text-gray-900">
                    ${co.finalTotal.toFixed(2)}
                  </td>
                  <td className="py-2">
                    <Link
                      href={`/change-orders/${co.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataPanel>
    </div>
  );
}
