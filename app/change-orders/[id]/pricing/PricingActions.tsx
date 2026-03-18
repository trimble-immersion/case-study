"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ChangeOrder } from "@/lib/domain/types";

export function PricingActions({ changeOrder }: { changeOrder: ChangeOrder }) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    changeOrder.status === "Draft" ||
    changeOrder.status === "Priced" ||
    changeOrder.status === "In Review";

  async function handleGeneratePricing() {
    setGenerating(true);
    try {
      await fetch(`/api/change-orders/${changeOrder.id}/generate-pricing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      router.refresh();
    } finally {
      setGenerating(false);
    }
  }

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

  return (
    <>
      <button
        type="button"
        onClick={handleGeneratePricing}
        disabled={generating}
        className="btn-primary"
      >
        {generating ? "Running pricing engine…" : "Generate Pricing"}
      </button>
      {canSubmit && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-secondary ml-1"
        >
          {submitting ? "Submitting…" : "Submit for Approval"}
        </button>
      )}
    </>
  );
}
