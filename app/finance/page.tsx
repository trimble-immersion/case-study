import Link from "next/link";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { StatusBadge } from "@/components/domain/StatusBadge";

export default function FinancePage() {
  const all = ChangeOrderService.listChangeOrders();
  const approved = all.filter((c) => c.status === "Approved");
  const totalImpact = approved.reduce((s, c) => s + c.finalTotal, 0);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold text-gray-900">Finance summary</h1>
      <p className="text-sm text-gray-600">
        Approved change orders – billable. Budget and revenue impact.
      </p>
      {approved.length === 0 ? (
        <div className="rounded border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            No approved change orders yet. Use Change Orders to open items and submit for approval from the Pricing tab.
          </p>
          <Link href="/change-orders" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            Open change orders
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded border border-gray-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Number</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
                  <th className="px-3 py-2 text-right font-medium text-gray-700">Final total</th>
                  <th className="px-3 py-2 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approved.map((co) => (
                  <tr key={co.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">{co.changeOrderNumber}</td>
                    <td className="px-3 py-2 text-gray-700">{co.title}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={co.status} />
                    </td>
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      ${co.finalTotal.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
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
          <div className="rounded border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Total impact (billable)</span>
              <span className="font-bold text-gray-900">
                ${totalImpact.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
