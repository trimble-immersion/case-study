import Link from "next/link";
import { listDrafts } from "@/lib/data";

export default function PMReviewPage() {
  const drafts = listDrafts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">PM review</h1>
      <p className="text-gray-600">
        Review draft change orders. Edit the final total and approve to send to
        finance.
      </p>
      {drafts.length === 0 ? (
        <p className="rounded border border-gray-200 bg-gray-50 p-4 text-gray-600">
          No drafts to review.{" "}
          <Link href="/new" className="text-blue-600 underline hover:text-blue-800">
            Create a change
          </Link>{" "}
          first.
        </p>
      ) : (
        <div className="overflow-hidden rounded border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                  Suggested total
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                  Final total
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drafts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{c.title}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    ${c.suggestedTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">
                    ${c.finalTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/pm/${c.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Review & approve
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
