"use client";

import type { AuditRecord } from "@/lib/domain/types";

export function ActivityFeed({ events }: { events: AuditRecord[] }) {
  if (events.length === 0) {
    return <p className="text-[11px] text-[#6a7e90]">No audit records found.</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Event Type</th>
          <th>Description</th>
          <th>User</th>
          <th>User ID</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e) => (
          <tr key={e.id}>
            <td className="text-[#4a5a6a] whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</td>
            <td className="font-medium whitespace-nowrap">{e.eventType}</td>
            <td>{e.description}</td>
            <td>{e.userName ?? "—"}</td>
            <td className="text-[#6a7e90]">{e.userId ?? "SYSTEM"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
