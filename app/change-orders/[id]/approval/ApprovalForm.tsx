"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeOrder } from "@/lib/domain/types";

export function ApprovalForm({ changeOrder }: { changeOrder: ChangeOrder }) {
  const router = useRouter();
  const [finalTotal, setFinalTotal] = useState(String(changeOrder.finalTotal));
  const [approvedBy, setApprovedBy] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canApprove = changeOrder.status === "Pending Approval";

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const value = parseFloat(finalTotal);
    if (isNaN(value) || value < 0) {
      setError("Enter a valid final total.");
      return;
    }
    if (!approvedBy.trim()) {
      setError("Enter approver name.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/change-orders/${changeOrder.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedBy: approvedBy.trim(),
          finalTotal: value,
          comment: comment.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Approve failed");
      router.refresh();
    } catch {
      setError("Failed to approve.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!canApprove) {
    return (
      <div className="rounded border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">
          This change order is not pending approval. Submit from the Pricing tab to send for approval.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-medium text-gray-900">Approve change order</h3>
      <form onSubmit={handleApprove} className="mt-3 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700">Final total ($)</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={finalTotal}
            onChange={(e) => setFinalTotal(e.target.value)}
            className="mt-1 w-full max-w-xs rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Approved by</label>
          <input
            type="text"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            className="mt-1 w-full max-w-xs rounded border border-gray-300 px-2 py-1.5 text-sm"
            placeholder="Name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="mt-1 w-full max-w-md rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
        >
          {submitting ? "Approving…" : "Approve"}
        </button>
      </form>
    </div>
  );
}
