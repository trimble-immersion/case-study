# Change Order Pricing – AI-Assisted Enterprise Demo

An **AI-assisted pricing capability for construction change orders** that fits into existing project management, ERP, and estimating systems. Explainable recommendations, approval workflow, and audit trail. Suitable for brownfield adoption.

## What's built

- **Dashboard** – Work queue and summary (pending, approved, billable total).
- **Change Order Intake** – Create change orders with project, scope, labor/material/equipment/subcontractor. Linked project record and cost code.
- **Change order detail** – Tabbed workspace: **Overview**, **Scope review**, **Pricing recommendation**, **Assumptions & evidence**, **Approval workflow**, **Audit history**.
- **Pricing recommendation** – Recommended total, cost breakdown, budget/revenue impact, confidence (High/Medium/Low), basis of estimate, assumptions, evidence references, warnings and missing-information flags.
- **Approval workflow** – Submit for approval from Pricing; approve with final total and comment; approval history.
- **Finance summary** – Approved change orders and total billable impact.
- **Settings** – Integration placeholders (ERP, Project Management, Estimating, Document Control, Event Bus).

Data is in-memory and seeded with realistic construction mock data on first use. No database or env vars required.

## How to run

1. Clone the repo.
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000). Use the left nav: Dashboard, Change Order Intake, Change Orders, Finance summary, Settings.

## Architecture

- **Frontend** – Next.js 14 (App Router), TypeScript, Tailwind. Left nav, header with context, tabbed workspace.
- **Domain** – Typed entities (Project, ChangeOrder, ScopeItem, PricingRecommendation, ApprovalStep, ActivityEvent, etc.) and statuses (Draft, In Review, Priced, Pending Approval, Approved, etc.).
- **AI layer** – `lib/ai/recommendationOrchestrator.ts`: structured input → recommendation with rationale, assumptions, confidence, warnings. Rules-based mock; swappable for real service.
- **Services** – ChangeOrderService, PricingRecommendationService, ApprovalWorkflowService, AuditService, IntegrationService.
- **Persistence** – In-memory store + mock data in `lib/data/`.

See **[REFACTOR_SUMMARY.md](./REFACTOR_SUMMARY.md)** for folder structure, domain models, and mock implementations.

## Extension ideas (for teams)

See **[GITHUB_ISSUES.md](./GITHUB_ISSUES.md)** for extension ideas to turn into GitHub issues.

## Deploy (Vercel)

1. Push the repo to GitHub.
2. At [vercel.com](https://vercel.com), sign in with GitHub, **Add New → Project**, import the repo.
3. Deploy. No environment variables needed.

**CLI:** `npm i -g vercel`, then `vercel` and `vercel --prod`.
