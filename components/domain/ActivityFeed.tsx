"use client";

import type { ActivityEvent } from "@/lib/domain/types";

export function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-gray-500">No activity yet.</p>;
  }
  return (
    <ul className="space-y-0">
      {events.map((e) => (
        <li
          key={e.id}
          className="flex gap-3 border-b border-gray-100 py-2 last:border-0"
        >
          <span className="shrink-0 text-xs text-gray-400">
            {new Date(e.timestamp).toLocaleString()}
          </span>
          <span className="text-xs font-medium text-gray-500">{e.type}</span>
          <span className="text-sm text-gray-700">{e.description}</span>
          {e.userName && (
            <span className="text-xs text-gray-400">— {e.userName}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
