/**
 * Integration service – ERP, PM, Estimating, Document Control, Event Bus.
 * Mock adapters; structure implies .NET/SQL/event-driven compatibility.
 */

import type { IntegrationConnection } from "@/lib/domain/types";
import { integrationStore, ensureSeeded } from "@/lib/data/store";

export function listConnections(): IntegrationConnection[] {
  ensureSeeded();
  return [...integrationStore];
}

export function getConnectionBySystem(
  system: IntegrationConnection["system"]
): IntegrationConnection | undefined {
  ensureSeeded();
  return integrationStore.find((c) => c.system === system);
}
