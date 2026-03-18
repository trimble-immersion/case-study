"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApprovalForm({
  changeOrderId,
  recommendedTotal,
}: {
  changeOrderId: string;
  recommendedTotal: number;
}) {
  const router = useRouter();
  const [finalTotal, setFinalTotal] = useState(String(recommendedTotal));
  const [approvedBy, setApprovedBy] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isOverride = parseFloat(finalTotal) !== recommendedTotal;

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const value = parseFloat(finalTotal);
    if (isNaN(value) || value < 0) { setError("ERR: Invalid final total."); return; }
    if (!approvedBy.trim()) { setError("ERR: Approver name / ID is required."); return; }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/change-orders/${changeOrderId}/approve`, {
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

  return (
    <form onSubmit={handleApprove}>
      <table style={{ marginBottom: 8 }}>
        <tbody>
          <tr>
            <td className="field-label" style={{ whiteSpace: "nowrap", paddingRight: 12, paddingBottom: 4 }}>
              Final Approved Amount ($)
            </td>
            <td style={{ paddingBottom: 4 }}>
              <input
                type="number"
                min={0}
                step={0.01}
                value={finalTotal}
                onChange={(e) => setFinalTotal(e.target.value)}
                style={{ width: 120 }}
                required
              />
            </td>
            <td className={isOverride ? "warn-cell" : ""} style={{ paddingLeft: 10, fontSize: 10, fontWeight: 700 }}>
              {isOverride ? "OVERRIDE — differs from recommended estimate" : ""}
            </td>
          </tr>
          <tr>
            <td className="field-label" style={{ whiteSpace: "nowrap", paddingRight: 12, paddingBottom: 4 }}>
              Approver Name / ID
            </td>
            <td style={{ paddingBottom: 4 }}>
              <input
                type="text"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
                placeholder="Last, First / Employee ID"
                style={{ width: 200 }}
                required
              />
            </td>
            <td style={{ paddingLeft: 10, fontSize: 10, color: "var(--text-muted)" }}>
              Enter as shown in directory
            </td>
          </tr>
          <tr>
            <td className="field-label" style={{ whiteSpace: "nowrap", paddingRight: 12 }}>
              Approval Comment
            </td>
            <td colSpan={2}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                style={{ width: 400 }}
                placeholder="Optional — will be recorded in the audit log"
              />
            </td>
          </tr>
        </tbody>
      </table>

      {error && (
        <div className="notice-error" style={{ marginBottom: 8 }}>{error}</div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Processing..." : "Approve — Record Final Amount"}
        </button>
        <button type="button" className="btn-secondary">Reject</button>
        <button type="button" className="btn-secondary">Request Revision</button>
        <span style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}>
          Action will be recorded in audit trail and trigger ERP sync.
        </span>
      </div>
    </form>
  );
}
