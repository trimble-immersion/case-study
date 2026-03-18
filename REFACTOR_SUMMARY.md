# Enterprise Refactor Summary

This document summarizes the refactor from the workshop prototype to an enterprise-style, AI-assisted change order pricing demo for construction software.

---

## 1. What changed

- **Architecture** – Clear layers: frontend (App Router pages + components), domain (types, entities), AI recommendation orchestration, persistence (in-memory store + mock data), and integration adapters (mocked). UI state, workflow state, pricing logic, and audit are separated.
- **Workflow** – Single flow: open change order → review project/context → scope details → AI recommended price → cost breakdown, assumptions, evidence, confidence → edit values → submit for approval → approval with final total → audit trail. No chatbot; no single-number opaque AI output.
- **UX** – Left navigation, top header with project/change order context, tabbed workspace (Overview, Scope review, Pricing recommendation, Assumptions & evidence, Approval workflow, Audit history). Dense tables, detail panels, status badges, approval-oriented layouts.
- **Domain language** – Construction/project-controls terms throughout: Change Order, Scope Change, Recommended Price, Labor, Material, Equipment, Subcontractor, Basis of Estimate, Budget Impact, Revenue Impact, Cost Code, Approval Status, Assumptions, Linked Project Record, Pricing Confidence, Audit Trail.
- **Pricing** – Explainable: recommended total, cost breakdown by category, budget/revenue impact, optional schedule impact, assumptions, confidence (High/Medium/Low), rationale, evidence references, warnings, missing-information flags.
- **Backend shape** – Service boundaries: ChangeOrderService, PricingRecommendationService, ApprovalWorkflowService, AuditService, IntegrationService, ProjectService. DTO-like request/response shapes; APIs under `/api/projects`, `/api/change-orders`, `/api/change-orders/[id]/recommendation`, `/api/change-orders/[id]/submit`, `/api/change-orders/[id]/approve`, `/api/change-orders/[id]/activity`, `/api/change-orders/[id]/approval-steps`, `/api/integrations`.
- **Auditability** – Activity feed (who changed what, when), pricing recommendation timestamp, approval history, sync/export placeholders.
- **Integrations** – Placeholder connections for ERP, Project Management, Estimating, Document Control, Event Bus (mock; structure ready for .NET/SQL/event-driven systems).

---

## 2. New architecture / folder structure

```
app/
  layout.tsx                    # Root layout with AppShell
  page.tsx                      # Dashboard (work queue + summary)
  globals.css
  intake/
    page.tsx                    # Change Order Intake form
  change-orders/
    page.tsx                    # Change orders list
    [id]/
      layout.tsx                # CO context + tabbed workspace
      ChangeOrderDetailLayout.tsx
      page.tsx                  # Tab: Overview
      scope/page.tsx             # Tab: Scope review
      pricing/
        page.tsx                # Tab: Pricing recommendation
        PricingActions.tsx
      assumptions/page.tsx      # Tab: Assumptions & evidence
      approval/
        page.tsx                # Tab: Approval workflow
        ApprovalForm.tsx
      audit/page.tsx            # Tab: Audit history
  finance/page.tsx              # Finance summary (approved, billable)
  settings/page.tsx             # Settings / Integrations placeholder
  api/
    projects/route.ts, [id]/route.ts
    change-orders/route.ts, [id]/route.ts, [id]/recommendation/route.ts,
    [id]/submit/route.ts, [id]/approve/route.ts, [id]/activity/route.ts,
    [id]/approval-steps/route.ts
    integrations/route.ts
  new/, [id]/, pm/, pm/[id]/     # Redirects to intake / change-orders

components/
  layout/
    AppShell.tsx
    LeftNav.tsx
    Header.tsx
    TabbedWorkspace.tsx
  domain/
    StatusBadge.tsx
    CostBreakdownTable.tsx
    AssumptionsPanel.tsx
    ActivityFeed.tsx
    DataPanel.tsx
    ConfidenceBadge.tsx

lib/
  domain/
    types.ts                    # Entities, statuses, DTOs
    index.ts
  ai/
    recommendationOrchestrator.ts  # Structured in/out; mock fallback
    index.ts
  data/
    store.ts                    # In-memory persistence
    mockData.ts                 # Realistic construction records
    index.ts
  services/
    projectService.ts
    changeOrderService.ts
    pricingRecommendationService.ts
    approvalWorkflowService.ts
    auditService.ts
    integrationService.ts
    index.ts
```

---

## 3. Main domain models

- **Project** – id, projectNumber, name, owner, contractValue, linkedProjectRecordId
- **ChangeOrder** – id, projectId, changeOrderNumber, title, description, status, requester, dateSubmitted, costCode, scopeItems, laborHours, materialTotal, equipmentTotal, subcontractorTotal, recommendedTotal, finalTotal, currentRecommendationId, createdAt, updatedAt
- **ScopeItem** – id, changeOrderId, description, quantity, unit, costCode, category (Labor | Material | Equipment | Subcontractor)
- **PricingRecommendation** – id, changeOrderId, recommendedTotal, costBreakdown, assumptions, evidence, confidence, rationale, budgetImpact, revenueImpact, scheduleImpactDays, warnings, missingInfoFlags, createdAt, createdBy
- **CostBreakdown** – laborHours, laborRate, laborTotal, materialTotal, equipmentTotal, subcontractorTotal, total, marginPercent
- **Assumption** – id, recommendationId, description, source
- **EvidenceItem** – id, recommendationId, type, reference, value
- **ApprovalStep** – id, changeOrderId, sequence, status, approvedBy, approvedAt, comment
- **ActivityEvent** – id, changeOrderId, type, timestamp, userId, userName, description, payload
- **IntegrationConnection** – id, system, displayName, connected, lastSync

**Statuses:** Draft, In Review, Priced, Needs Revision, Pending Approval, Approved, Rejected, Synced.

---

## 4. Components and services added

**Layout:** AppShell, LeftNav, Header, TabbedWorkspace.

**Domain components:** StatusBadge, CostBreakdownTable, AssumptionsPanel, ActivityFeed, DataPanel, ConfidenceBadge.

**Services:** ProjectService (list, getById), ChangeOrderService (list, getById, getByStatus, create, update, setCurrentRecommendation), PricingRecommendationService (getById, getByChangeOrderId, getCurrentRecommendation, generateAndStoreRecommendation), ApprovalWorkflowService (getApprovalSteps, submitForApproval, approve, reject), AuditService (getActivityByChangeOrderId, recordActivity), IntegrationService (listConnections, getConnectionBySystem).

**AI layer:** `generatePricingRecommendation(request)` – returns recommendation (total, breakdown, assumptions, evidence, confidence, rationale, budget/revenue impact, warnings, missingInfoFlags). Deterministic rules-based mock; swappable for real service.

---

## 5. Mock implementations

- **Persistence** – In-memory arrays in `lib/data/store.ts`; seeded from `lib/data/mockData.ts` (projects, change orders, approval steps, activity events, integrations). No database.
- **AI** – `lib/ai/recommendationOrchestrator.ts`: labor rate + equipment margin + margin percent; derives confidence from filled cost inputs; builds assumptions, evidence, warnings, missing-info flags. No external LLM.
- **Integrations** – `lib/data/mockData.ts`: IntegrationConnection entries for ERP, ProjectManagement, Estimating, DocumentControl, EventBus; connected/lastSync for demo. No real API calls.

---

## 6. Legacy routes

- `/new` → redirects to `/intake`
- `/[id]` → redirects to `/change-orders/[id]`
- `/pm` → redirects to `/change-orders`
- `/pm/[id]` → redirects to `/change-orders/[id]`

Old `/api/changes` and `/api/changes/[id]` removed; all clients use `/api/change-orders` and related endpoints.
