/**
 * Change order service – create, read, update; workflow state.
 */

import type {
  ChangeOrder,
  ChangeOrderCreateDto,
  ChangeOrderUpdateDto,
  ScopeItem,
  ApprovalStatus,
} from "@/lib/domain/types";
import { changeOrderStore, ensureSeeded, generateId } from "@/lib/data/store";

export function listChangeOrders(projectId?: string): ChangeOrder[] {
  ensureSeeded();
  const list = [...changeOrderStore];
  if (projectId) return list.filter((c) => c.projectId === projectId);
  return list;
}

export function getChangeOrderById(id: string): ChangeOrder | undefined {
  ensureSeeded();
  return changeOrderStore.find((c) => c.id === id);
}

export function getChangeOrdersByStatus(status: ApprovalStatus): ChangeOrder[] {
  ensureSeeded();
  return changeOrderStore.filter((c) => c.status === status);
}

export function createChangeOrder(
  dto: ChangeOrderCreateDto,
  scopeItems: ScopeItem[],
  recommendedTotal: number
): ChangeOrder {
  ensureSeeded();
  const nextNum = changeOrderStore.length + 12; // demo sequence
  const co: ChangeOrder = {
    id: generateId("co"),
    projectId: dto.projectId,
    changeOrderNumber: `CO-2024-${String(nextNum).padStart(3, "0")}`,
    title: dto.title,
    description: dto.description,
    status: "Draft",
    requester: dto.requester,
    costCode: dto.costCode,
    scopeItems,
    laborHours: dto.laborHours,
    materialTotal: dto.materialTotal,
    equipmentTotal: dto.equipmentTotal,
    subcontractorTotal: dto.subcontractorTotal ?? 0,
    recommendedTotal,
    finalTotal: recommendedTotal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  changeOrderStore.push(co);
  return co;
}

export function updateChangeOrder(
  id: string,
  dto: ChangeOrderUpdateDto
): ChangeOrder | undefined {
  const idx = changeOrderStore.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const now = new Date().toISOString();
  if (dto.title !== undefined) changeOrderStore[idx].title = dto.title;
  if (dto.description !== undefined) changeOrderStore[idx].description = dto.description;
  if (dto.finalTotal !== undefined) changeOrderStore[idx].finalTotal = dto.finalTotal;
  if (dto.status !== undefined) changeOrderStore[idx].status = dto.status;
  changeOrderStore[idx].updatedAt = now;
  return changeOrderStore[idx];
}

export function setCurrentRecommendation(
  changeOrderId: string,
  recommendationId: string
): void {
  const co = changeOrderStore.find((c) => c.id === changeOrderId);
  if (co) co.currentRecommendationId = recommendationId;
}
