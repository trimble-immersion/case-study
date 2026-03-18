"use client";

import type { Assumption } from "@/lib/domain/types";

export function AssumptionsPanel({ assumptions }: { assumptions: Assumption[] }) {
  if (!assumptions.length) {
    return <p className="text-[11px] text-[#6a7e90]">No assumptions recorded.</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Assumption</th>
          <th>Source / Basis</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {assumptions.map((a) => (
          <tr key={a.id}>
            <td>{a.description}</td>
            <td className="text-[#6a7e90]">{a.source ?? "—"}</td>
            <td className="text-[#4a7a4a]">Active</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
