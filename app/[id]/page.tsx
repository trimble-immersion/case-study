import Link from "next/link";
import { notFound } from "next/navigation";
import { getChangeById } from "@/lib/data";

export default async function ChangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const change = getChangeById(id);
  if (!change) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{change.title}</h1>
        <span
          className={`rounded px-2 py-1 text-sm font-medium ${
            change.status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {change.status}
        </span>
      </div>
      <p className="text-gray-600">{change.description}</p>
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-gray-500">Labor (hours)</dt>
          <dd className="font-medium">{change.labor}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Materials ($)</dt>
          <dd className="font-medium">{change.materials.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Equipment ($)</dt>
          <dd className="font-medium">{change.equipment.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Suggested total</dt>
          <dd className="font-medium text-blue-600">
            ${change.suggestedTotal.toFixed(2)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Final total</dt>
          <dd className="font-medium">${change.finalTotal.toFixed(2)}</dd>
        </div>
      </dl>
      <div className="flex gap-4">
        {change.status === "draft" && (
          <Link
            href={`/pm/${change.id}`}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Send to PM review
          </Link>
        )}
        <Link
          href="/pm"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Back to PM review
        </Link>
        <Link
          href="/"
          className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
