# Change Order Management – Workshop Prototype

A minimal change order flow: **capture a change (field) → suggested price → PM review/approve → finance sees it as billable**. Built for workshops: clone the repo and extend it.

## What's built

- **Create change** (`/new`) – Form: title, description, labor (hours), materials ($), equipment ($). Rules-based “fake AI” pricing suggests a total. Saves as draft.
- **Change detail** (`/[id]`) – Read-only view of one change and suggested total. Link to send to PM review.
- **PM review** (`/pm`) – List of drafts. Open a change to edit **final total** and **Approve**. Approved items move to finance.
- **Finance summary** (`/finance`) – Table of **approved** changes only, with **totals / impact** (sum of final totals).

Data is in-memory and **seeded automatically** on first use (5–10 fake change orders), so no database or seed step required after clone.

## How to run

1. Clone the repo.
2. Install dependencies: `npm install`
3. Run the app: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000). Use the nav: Create change, PM review, Finance summary.

No env vars or database setup needed. Seed data loads when you first list changes.

## Extension ideas (for teams)

See **[GITHUB_ISSUES.md](./GITHUB_ISSUES.md)** for 8–10 extension ideas you can turn into GitHub issues (e.g. label `extension-idea`). Teams can pick one and build on this prototype.

## Tech

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- In-memory store in `lib/data.ts`; rules-based pricing in `lib/pricing.ts`

## Deploy (Vercel)

1. **Push this repo to GitHub** (if you haven’t already).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New → Project**, then **Import** your repository.
4. Leave the defaults (Vercel detects Next.js). Click **Deploy**.
5. When the build finishes, open the generated URL. The flow works end-to-end; no environment variables needed.

**CLI option:** Install `vercel` (`npm i -g vercel`), run `vercel` in this folder, then `vercel --prod` for production.
