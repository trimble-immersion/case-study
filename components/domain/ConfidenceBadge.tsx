"use client";

import type { PricingConfidence } from "@/lib/domain/types";

const conf: Record<PricingConfidence, { bg: string; text: string; border: string }> = {
  High:   { bg: "#e0f2e0", text: "#1a5a1a", border: "#4a9a4a" },
  Medium: { bg: "#fff8e0", text: "#7a5000", border: "#c8a000" },
  Low:    { bg: "#ffe0e0", text: "#7a0000", border: "#c04040" },
};

export function ConfidenceBadge({ confidence }: { confidence: PricingConfidence }) {
  const s = conf[confidence];
  return (
    <span
      className="status-tag"
      style={{ backgroundColor: s.bg, color: s.text, borderColor: s.border }}
    >
      CONF: {confidence.toUpperCase()}
    </span>
  );
}
