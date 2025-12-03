# High Level Architecture

## Technical Summary
Creators interact with a Next.js 14 App Router frontend deployed on Vercel Edge. API routes inside the same project serve as a Backend-for-Frontend (BFF) that validates Supabase Auth tokens, enforces quotas, and enqueues asynchronous work on Upstash Redis (BullMQ). Two AWS Lambda workers (ingestion + analysis) orchestrated via SST process jobs: ingestion fetches comments from the YouTube Data API with retries and stores normalized records in Supabase Postgres; analysis runs clustering logic, invokes Gemini 1.5 Pro via Vertex AI for narrative output, and uploads Markdown/PDF exports to S3. Observability spans CloudWatch dashboards, Sentry (frontend and workers), and Vercel Analytics, providing quota/latency alerts to Slack so Creator Success meets the PRD’s <4 h response SLA.

## Platform & Infrastructure Choice
| Option | Pros | Cons |
| ------ | ---- | ---- |
| **Vercel + AWS + Supabase (Hybrid)** | Best-in-class Next.js DX, granular AWS monitoring, Supabase Auth synergy | Multi-provider secrets/IAM to manage |
| **All-in AWS (Amplify, Lambda, RDS)** | Single control plane, CloudWatch-native everything | Slower frontend iteration, manual SSR optimizations |
| **Fly.io Fullstack** | Global deploy, simple Postgres | Less mature observability + LLM integrations |

**Recommendation:** Hybrid Vercel + AWS Lambda + Supabase + Upstash, balancing DX and operational rigor while enabling shared TypeScript packages.

## Repository Structure
- **Structure:** Monorepo with Turborepo workspaces
- **Apps:** `apps/web` (Next.js UI + BFF) and `apps/workers` (SST Lambdas)
- **Packages:** `packages/shared` (types/Zod), `packages/ui` (Radix/Tailwind components), `packages/prompt-kit` (Gemini prompts), `packages/config` (eslint/ts/tailwind presets)

## Architecture Diagram
```mermaid
graph TD
  User[Creator Browser] -->|HTTPS| Frontend[Next.js Frontend (Vercel Edge)]
  Frontend -->|REST| BFF[Next.js API Routes (BFF)]
  BFF -->|enqueue job| Queue[Upstash Redis / BullMQ]
  Queue -->|trigger| Ingest[Ingestion Lambda]
  Ingest -->|YouTube Data API| YouTube[YouTube API]
  Ingest -->|store comments| Supabase[(Supabase Postgres)]
  Ingest -->|enqueue| Queue
  Queue -->|trigger| Analysis[Analysis Lambda]
  Analysis -->|clusters & summary| Supabase
  Analysis -->|exports| S3[(S3 Bucket)]
  Analysis -->|invoke| Gemini[Vertex AI Gemini]
  BFF -->|fetch insights| Supabase
  BFF -->|signed URLs| S3
  BFF -->|metrics| CloudWatch
  Frontend -->|errors| Sentry
```

## Architectural Patterns
- **Serverless Modular Monolith:** Shared repo with BFF + worker functions keeps complexity low until scale demands decomposition.
- **Backend-for-Frontend:** Tailored REST surface for the dashboard ensures bilingual UX and WCAG states are handled centrally.
- **Event-Driven Queue:** BullMQ decouples slow ingestion/LLM tasks, enabling retries and keeping UI latency low.
- **Repository + Zod Validation:** Shared schemas in `packages/shared` prevent contract drift and allow runtime validation at every boundary.
- **CQRS-lite:** Writes happen via workers; reads exposed via Supabase views/materialized summaries for fast dashboards.
- **Observability-as-Code:** Terraform/SST codify CloudWatch dashboards, alarms, and Slack notifications for quota/latency/costs.
