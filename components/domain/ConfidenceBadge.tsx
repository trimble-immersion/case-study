"use client";

import type { PricingConfidence } from "@/lib/domain/types";

const styles: Record<PricingConfidence, string> = {
  High: "bg-green-100 text-green-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-red-100 text-red-800",
};

export function ConfidenceBadge({ confidence }: { confidence: PricingConfidence }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${styles[confidence]}`}
    >
      Pricing confidence: {confidence}
    </span>
  );
}
