"use client";

import type { ApprovalStatus } from "@/lib/domain/types";

const statusStyles: Record<ApprovalStatus, { bg: string; text: string; border: string; label: string }> = {
  Draft:            { bg: "#e8edf2", text: "#2a3a4a", border: "#9aa8b6", label: "DRAFT" },
  "In Review":      { bg: "#fff8e0", text: "#7a5000", border: "#c8a000", label: "IN REVIEW" },
  Priced:           { bg: "#e0eeff", text: "#0a3a7a", border: "#5090d0", label: "PRICED" },
  "Needs Revision": { bg: "#fff0e0", text: "#8a3000", border: "#d06000", label: "NEEDS REVISION" },
  "Pending Approval":{ bg: "#e8f0ff", text: "#1a3a8a", border: "#6080c8", label: "PENDING APPR." },
  Approved:         { bg: "#e0f2e0", text: "#1a5a1a", border: "#4a9a4a", label: "APPROVED" },
  Rejected:         { bg: "#ffe0e0", text: "#7a0000", border: "#c04040", label: "REJECTED" },
  Synced:           { bg: "#e8e8f8", text: "#2a2a6a", border: "#7070b0", label: "SYNCED" },
};

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  const s = statusStyles[status] ?? statusStyles.Draft;
  return (
    <span
      className="status-tag"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
    >
      {s.label}
    </span>
  );
}
