/**
 * Approval workflow service – submit, approve, reject; record steps.
 */

import type { ApprovalStatus, ApprovalStep, ApprovalSubmitDto } from "@/lib/domain/types";
import { changeOrderStore, approvalStepStore, ensureSeeded, generateId } from "@/lib/data/store";

export function getApprovalSteps(changeOrderId: string): ApprovalStep[] {
  ensureSeeded();
  return approvalStepStore
    .filter((s) => s.changeOrderId === changeOrderId)
    .sort((a, b) => a.sequence - b.sequence);
}

export function submitForApproval(changeOrderId: string): boolean {
  ensureSeeded();
  const idx = changeOrderStore.findIndex((c) => c.id === changeOrderId);
  if (idx === -1) return false;
  changeOrderStore[idx].status = "Pending Approval";
  changeOrderStore[idx].dateSubmitted = new Date().toISOString();
  changeOrderStore[idx].updatedAt = new Date().toISOString();
  const nextSeq = approvalStepStore.filter((s) => s.changeOrderId === changeOrderId).length + 1;
  approvalStepStore.push({
    id: generateId("ap"),
    changeOrderId,
    sequence: nextSeq,
    status: "Pending Approval",
  });
  return true;
}

export function approve(dto: ApprovalSubmitDto): boolean {
  ensureSeeded();
  const idx = changeOrderStore.findIndex((c) => c.id === dto.changeOrderId);
  if (idx === -1) return false;
  changeOrderStore[idx].status = "Approved";
  changeOrderStore[idx].finalTotal = dto.finalTotal;
  changeOrderStore[idx].updatedAt = new Date().toISOString();
  const steps = approvalStepStore.filter((s) => s.changeOrderId === dto.changeOrderId);
  const last = steps[steps.length - 1];
  if (last) {
    last.status = "Approved";
    last.approvedBy = dto.approvedBy;
    last.approvedAt = new Date().toISOString();
    last.comment = dto.comment;
  } else {
    approvalStepStore.push({
      id: generateId("ap"),
      changeOrderId: dto.changeOrderId,
      sequence: 1,
      status: "Approved",
      approvedBy: dto.approvedBy,
      approvedAt: new Date().toISOString(),
      comment: dto.comment,
    });
  }
  return true;
}

export function reject(changeOrderId: string, rejectedBy: string, comment?: string): boolean {
  ensureSeeded();
  const idx = changeOrderStore.findIndex((c) => c.id === changeOrderId);
  if (idx === -1) return false;
  changeOrderStore[idx].status = "Rejected";
  changeOrderStore[idx].updatedAt = new Date().toISOString();
  const steps = approvalStepStore.filter((s) => s.changeOrderId === changeOrderId);
  const last = steps[steps.length - 1];
  if (last) {
    last.status = "Rejected";
    last.approvedBy = rejectedBy;
    last.approvedAt = new Date().toISOString();
    last.comment = comment;
  }
  return true;
}
