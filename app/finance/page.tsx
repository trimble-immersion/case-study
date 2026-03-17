import Link from "next/link";
import { listApproved } from "@/lib/data";

export default function FinancePage() {
  const approved = listApproved();
  const totalImpact = approved.reduce((sum, c) => sum + c.finalTotal, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Finance summary</h1>
      <p className="text-gray-600">
        Approved change orders – billable. Totals and impact below.
      </p>
      {approved.length === 0 ? (
        <p className="rounded border border-gray-200 bg-gray-50 p-4 text-gray-600">
          No approved changes yet.{" "}
          <Link href="/pm" className="text-blue-600 underline hover:text-blue-800">
            PM review
          </Link>{" "}
          to approve drafts.
        </p>
      ) : (
        <>
          <div className="overflow-hidden rounded border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Title
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                    Final total
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {approved.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{c.title}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${c.finalTotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(c.createdAt).toLocaleDateString()}
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
                ${totalImpact.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
