/**
 * In-memory persistence layer. Enterprise-style data access; swappable for SQL/.NET backend.
 */

import type {
  Project,
  ChangeOrder,
  PricingRecommendation,
  ApprovalStep,
  ActivityEvent,
  IntegrationConnection,
} from "@/lib/domain/types";
import {
  mockProjects,
  mockChangeOrders,
  mockRecommendations,
  mockApprovalSteps,
  mockActivityEvents,
  mockIntegrations,
} from "./mockData";

export const projectStore: Project[] = [];
export const changeOrderStore: ChangeOrder[] = [];
export const recommendationStore: PricingRecommendation[] = [];
export const approvalStepStore: ApprovalStep[] = [];
export const activityStore: ActivityEvent[] = [];
export const integrationStore: IntegrationConnection[] = [];

let seeded = false;

export function ensureSeeded(): void {
  if (seeded) return;
  seeded = true;
  projectStore.push(...mockProjects.map((p) => ({ ...p })));
  changeOrderStore.push(...mockChangeOrders.map((c) => ({ ...c, scopeItems: c.scopeItems.map((s) => ({ ...s })) })));
  recommendationStore.push(...mockRecommendations.map((r) => ({ ...r })));
  approvalStepStore.push(...mockApprovalSteps.map((a) => ({ ...a })));
  activityStore.push(...mockActivityEvents.map((e) => ({ ...e })));
  integrationStore.push(...mockIntegrations.map((i) => ({ ...i })));
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
