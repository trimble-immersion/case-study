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
    if (isNaN(value) || value < 0) { setError("ERR: Invalid final total."); return; }
    if (!approvedBy.trim()) { setError("ERR: Approver name required."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/change-orders/${changeOrder.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedBy: approvedBy.trim(), finalTotal: value, comment: comment.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Approve failed");
      router.refresh();
    } catch {
      setError("ERR-500: Approval action failed. Contact system administrator.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!canApprove) {
    return (
      <div className="text-[11px] text-[#6a7e90]">
        Record is not in Pending Approval state. No action available.
        {changeOrder.status === "Approved" && (
          <span className="ml-2 text-[#4a7a4a] font-semibold">✓ Already approved.</span>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleApprove}>
      <table style={{ marginBottom: 8 }}>
        <tbody>
          <tr>
            <td className="text-[#6a7e90] font-medium whitespace-nowrap pr-3">Final Approved Amount ($)</td>
            <td>
              <input
                type="number"
                min={0}
                step={0.01}
                value={finalTotal}
                onChange={(e) => setFinalTotal(e.target.value)}
                className="w-32"
                required
              />
            </td>
            <td className="text-[10px] warn-cell pl-3">
              {parseFloat(finalTotal) !== changeOrder.recommendedTotal && "OVERRIDE — differs from estimate"}
            </td>
          </tr>
          <tr>
            <td className="text-[#6a7e90] font-medium whitespace-nowrap pr-3">Approver Name / ID</td>
            <td>
              <input
                type="text"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                placeholder="Last, First"
                className="w-48"
                required
              />
            </td>
            <td className="text-[10px] text-[#6a7e90] pl-3">Enter as shown in directory</td>
          </tr>
          <tr>
            <td className="text-[#6a7e90] font-medium whitespace-nowrap pr-3">Approval Comment</td>
            <td colSpan={2}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="w-full"
                style={{ width: 360 }}
                placeholder="Optional — will be recorded in audit log"
              />
            </td>
          </tr>
        </tbody>
      </table>
      {error && (
        <div className="mb-2 border border-[#c04040] bg-[#ffe0e0] px-2 py-1 text-[11px] text-[#900000]">
          {error}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Processing…" : "Approve — Record Final Amount"}
        </button>
        <button type="button" className="btn-secondary">Reject</button>
        <button type="button" className="btn-secondary">Request Revision</button>
        <span className="text-[10px] text-[#6a7e90] ml-2">
          Action will be logged to audit trail and trigger ERP sync.
        </span>
      </div>
    </form>
  );
}
