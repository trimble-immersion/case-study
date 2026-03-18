"use client";

import type { Assumption } from "@/lib/domain/types";

export function AssumptionsPanel({ assumptions }: { assumptions: Assumption[] }) {
  if (assumptions.length === 0) {
    return (
      <p className="text-sm text-gray-500">No assumptions recorded.</p>
    );
  }
  return (
    <ul className="space-y-2">
      {assumptions.map((a) => (
        <li
          key={a.id}
          className="rounded border border-gray-200 bg-white px-3 py-2 text-sm"
        >
          <p className="text-gray-900">{a.description}</p>
          {a.source && (
            <p className="mt-1 text-xs text-gray-500">Source: {a.source}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
