/**
 * Audit service – activity feed, history, who changed what.
 */

import type { ActivityEvent } from "@/lib/domain/types";
import { activityStore, ensureSeeded, generateId } from "@/lib/data/store";

export function getActivityByChangeOrderId(changeOrderId: string): ActivityEvent[] {
  ensureSeeded();
  return activityStore
    .filter((e) => e.changeOrderId === changeOrderId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function recordActivity(
  changeOrderId: string,
  type: ActivityEvent["type"],
  description: string,
  userId?: string,
  userName?: string,
  payload?: Record<string, unknown>
): ActivityEvent {
  ensureSeeded();
  const event: ActivityEvent = {
    id: generateId("ev"),
    changeOrderId,
    type,
    timestamp: new Date().toISOString(),
    description,
    userId,
    userName,
    payload,
  };
  activityStore.push(event);
  return event;
}
