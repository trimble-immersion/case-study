"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  labor: number;
  materials: number;
  equipment: number;
  suggestedTotal: number;
  finalTotal: number;
  status: string;
  createdAt: string;
}

export default function PMReviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [change, setChange] = useState<ChangeOrder | null>(null);
  const [finalTotal, setFinalTotal] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/changes/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setChange(data);
          setFinalTotal(String(data.finalTotal));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    if (!change || change.status !== "draft") return;
    const value = parseFloat(finalTotal);
    if (isNaN(value) || value < 0) {
      setError("Enter a valid final total.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/changes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ finalTotal: value, status: "approved" }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.push("/pm");
      router.refresh();
    } catch {
      setError("Failed to approve.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-gray-600">Loading…</p>;
  if (!change) return <p className="text-gray-600">Change not found.</p>;
  if (change.status !== "draft") {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">This change is already approved.</p>
        <Link href="/pm" className="text-blue-600 underline hover:text-blue-800">
          Back to PM review
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{change.title}</h1>
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
      </dl>
      <form onSubmit={handleApprove} className="flex max-w-md flex-col gap-4">
        <div>
          <label htmlFor="finalTotal" className="block text-sm font-medium text-gray-700">
            Final total ($)
          </label>
          <input
            id="finalTotal"
            type="number"
            min={0}
            step={0.01}
            value={finalTotal}
            onChange={(e) => setFinalTotal(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Approving…" : "Approve"}
          </button>
          <Link
            href="/pm"
            className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
