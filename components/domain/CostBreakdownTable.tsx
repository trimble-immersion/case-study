"use client";

import type { CostBreakdown } from "@/lib/domain/types";

export function CostBreakdownTable({ breakdown }: { breakdown: CostBreakdown }) {
  const rows = [
    {
      category: "Labor",
      costCode: "—",
      qty: breakdown.laborHours,
      unit: "HR",
      unitCost: breakdown.laborRate,
      subtotal: breakdown.laborTotal,
      source: "Rate table",
      override: false,
    },
    {
      category: "Material",
      costCode: "—",
      qty: 1,
      unit: "LS",
      unitCost: breakdown.materialTotal,
      subtotal: breakdown.materialTotal,
      source: "Manual entry",
      override: true,
    },
    {
      category: "Equipment",
      costCode: "—",
      qty: 1,
      unit: "LS",
      unitCost: breakdown.equipmentTotal,
      subtotal: breakdown.equipmentTotal,
      source: "Manual entry + 15%",
      override: false,
    },
    ...(breakdown.subcontractorTotal > 0
      ? [{
          category: "Subcontractor",
          costCode: "—",
          qty: 1,
          unit: "LS",
          unitCost: breakdown.subcontractorTotal,
          subtotal: breakdown.subcontractorTotal,
          source: "Quote on file",
          override: false,
        }]
      : []),
  ];

  const subtotal = breakdown.laborTotal + breakdown.materialTotal + breakdown.equipmentTotal + breakdown.subcontractorTotal;
  const marginAmt = breakdown.total - subtotal;

  return (
    <table style={{ fontSize: 11 }}>
      <thead>
        <tr>
          <th>Category</th>
          <th>Cost Code</th>
          <th style={{ textAlign: "right" }}>Qty</th>
          <th>Unit</th>
          <th style={{ textAlign: "right" }}>Unit Cost ($)</th>
          <th style={{ textAlign: "right" }}>Subtotal ($)</th>
          <th>Source</th>
          <th>Override</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.category}>
            <td>{row.category}</td>
            <td className="text-[#6a7e90]">{row.costCode}</td>
            <td style={{ textAlign: "right" }}>{row.qty}</td>
            <td>{row.unit}</td>
            <td style={{ textAlign: "right" }}>{row.unitCost.toFixed(2)}</td>
            <td style={{ textAlign: "right", fontWeight: 600 }}>{row.subtotal.toFixed(2)}</td>
            <td className="text-[#6a7e90]">{row.source}</td>
            <td className={row.override ? "warn-cell font-semibold" : "text-[#6a7e90]"}>
              {row.override ? "YES" : "—"}
            </td>
          </tr>
        ))}
        {/* Subtotal row */}
        <tr style={{ backgroundColor: "#e4eaf0" }}>
          <td colSpan={5} style={{ fontWeight: 600, textAlign: "right" }}>Subtotal</td>
          <td style={{ textAlign: "right", fontWeight: 600 }}>{subtotal.toFixed(2)}</td>
          <td colSpan={2} />
        </tr>
        {/* Margin row */}
        <tr style={{ backgroundColor: "#e4eaf0" }}>
          <td colSpan={5} style={{ textAlign: "right", color: "#6a7e90" }}>
            Margin ({breakdown.marginPercent ?? 12}%)
          </td>
          <td style={{ textAlign: "right", color: "#6a7e90" }}>{marginAmt.toFixed(2)}</td>
          <td colSpan={2} />
        </tr>
        {/* Total row */}
        <tr style={{ backgroundColor: "#1a3a5c", color: "white" }}>
          <td colSpan={5} style={{ fontWeight: 700, textAlign: "right", color: "white", border: "1px solid #0a2038" }}>
            TOTAL ESTIMATED VALUE
          </td>
          <td style={{ textAlign: "right", fontWeight: 700, color: "white", border: "1px solid #0a2038" }}>
            {breakdown.total.toFixed(2)}
          </td>
          <td colSpan={2} style={{ border: "1px solid #0a2038" }} />
        </tr>
      </tbody>
    </table>
  );
}
