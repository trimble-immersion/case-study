"use client";

import type { CostBreakdown } from "@/lib/domain/types";

export function CostBreakdownTable({ breakdown }: { breakdown: CostBreakdown }) {
  const rows = [
    { label: "Labor", value: breakdown.laborTotal, sub: `${breakdown.laborHours} hrs @ $${breakdown.laborRate}/hr` },
    { label: "Material", value: breakdown.materialTotal },
    { label: "Equipment", value: breakdown.equipmentTotal },
    { label: "Subcontractor", value: breakdown.subcontractorTotal },
  ].filter((r) => r.value > 0 || r.label === "Labor");

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-700">Category</th>
            <th className="px-3 py-2 text-right font-medium text-gray-700">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="px-3 py-2 text-gray-700">
                {row.label}
                {row.sub && (
                  <span className="block text-xs text-gray-500">{row.sub}</span>
                )}
              </td>
              <td className="px-3 py-2 text-right font-medium text-gray-900">
                ${row.value.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-medium">
            <td className="px-3 py-2 text-gray-900">Total</td>
            <td className="px-3 py-2 text-right text-gray-900">
              ${breakdown.total.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
