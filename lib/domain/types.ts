/**
 * Enterprise domain model for AI-assisted change order pricing.
 * Construction/project-controls language; compatible with brownfield PM/ERP/estimating systems.
 */

export type ApprovalStatus =
  | "Draft"
  | "In Review"
  | "Priced"
  | "Needs Revision"
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Synced";

export type PricingConfidence = "High" | "Medium" | "Low";

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  owner: string;
  contractValue: number;
  linkedProjectRecordId?: string; // ERP/PM system reference
}

export interface ScopeItem {
  id: string;
  changeOrderId: string;
  description: string;
  quantity?: number;
  unit?: string;
  costCode?: string;
  category: "Labor" | "Material" | "Equipment" | "Subcontractor";
}

export interface CostBreakdown {
  laborHours: number;
  laborRate: number;
  laborTotal: number;
  materialTotal: number;
  equipmentTotal: number;
  subcontractorTotal: number;
  total: number;
  marginPercent?: number;
}

export interface Assumption {
  id: string;
  recommendationId: string;
  description: string;
  source?: string; // e.g. "Historical average", "Quote on file"
}

export interface EvidenceItem {
  id: string;
  recommendationId: string;
  type: "Historical" | "Quote" | "Estimate" | "Spec";
  reference: string;
  value?: number;
}

export interface PricingRecommendation {
  id: string;
  changeOrderId: string;
  recommendedTotal: number;
  costBreakdown: CostBreakdown;
  assumptions: Assumption[];
  evidence: EvidenceItem[];
  confidence: PricingConfidence;
  rationale: string; // Basis of estimate
  budgetImpact: number;
  revenueImpact: number;
  scheduleImpactDays?: number;
  warnings: string[];
  missingInfoFlags: string[];
  createdAt: string;
  createdBy?: string;
}

export interface ApprovalStep {
  id: string;
  changeOrderId: string;
  sequence: number;
  status: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: string;
  comment?: string;
}

export interface ActivityEvent {
  id: string;
  changeOrderId: string;
  type: "Created" | "ScopeUpdated" | "PricingGenerated" | "PricingEdited" | "Submitted" | "Approved" | "Rejected" | "Synced";
  timestamp: string;
  userId?: string;
  userName?: string;
  description: string;
  payload?: Record<string, unknown>;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  changeOrderNumber: string;
  title: string;
  description: string;
  status: ApprovalStatus;
  requester?: string;
  dateSubmitted?: string;
  costCode?: string;
  scopeItems: ScopeItem[];
  laborHours: number;
  materialTotal: number;
  equipmentTotal: number;
  subcontractorTotal: number;
  recommendedTotal: number;
  finalTotal: number;
  currentRecommendationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConnection {
  id: string;
  system: "ERP" | "ProjectManagement" | "Estimating" | "DocumentControl" | "EventBus";
  displayName: string;
  connected: boolean;
  lastSync?: string;
}

// DTOs for API / service boundaries
export interface ChangeOrderCreateDto {
  projectId: string;
  title: string;
  description: string;
  requester?: string;
  laborHours: number;
  materialTotal: number;
  equipmentTotal: number;
  subcontractorTotal?: number;
  costCode?: string;
}

export interface ChangeOrderUpdateDto {
  title?: string;
  description?: string;
  finalTotal?: number;
  status?: ApprovalStatus;
}

export interface PricingRecommendationRequest {
  changeOrderId: string;
  projectId: string;
  laborHours: number;
  materialTotal: number;
  equipmentTotal: number;
  subcontractorTotal?: number;
  scopeSummary?: string;
  costCode?: string;
}

export interface PricingRecommendationResponse {
  recommendation: PricingRecommendation;
  warnings: string[];
}

export interface ApprovalSubmitDto {
  changeOrderId: string;
  approvedBy: string;
  comment?: string;
  finalTotal: number;
}
