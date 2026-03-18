"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeOrder } from "@/lib/domain/types";

export function PricingActions({ changeOrder }: { changeOrder: ChangeOrder }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const canSubmit =
    changeOrder.status === "Draft" ||
    changeOrder.status === "Priced" ||
    changeOrder.status === "In Review";

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/change-orders/${changeOrder.id}/submit`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Submit failed");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (!canSubmit) return null;
  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit for approval"}
      </button>
    </div>
  );
}
