import Link from "next/link";
import { ChangeOrderService } from "@/lib/services/changeOrderService";
import { StatusBadge } from "@/components/domain/StatusBadge";

export default function ChangeOrdersListPage() {
  const changeOrders = ChangeOrderService.listChangeOrders();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold text-gray-900">Change orders</h1>
      <p className="text-sm text-gray-600">
        Open a change order to review scope, pricing recommendation, assumptions, and approval workflow.
      </p>
      <div className="overflow-hidden rounded border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Number</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Status</th>
              <th className="px-3 py-2 text-right font-medium text-gray-700">Recommended</th>
              <th className="px-3 py-2 text-right font-medium text-gray-700">Final total</th>
              <th className="px-3 py-2 font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {changeOrders.map((co) => (
              <tr key={co.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-900">{co.changeOrderNumber}</td>
                <td className="px-3 py-2 text-gray-700">{co.title}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={co.status} />
                </td>
                <td className="px-3 py-2 text-right text-gray-600">
                  ${co.recommendedTotal.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-right font-medium text-gray-900">
                  ${co.finalTotal.toFixed(2)}
                </td>
                <td className="px-3 py-2">
                  <Link href={`/change-orders/${co.id}`} className="text-blue-600 hover:underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
