# Tech Stack
| Category | Technology | Version | Purpose | Rationale |
| --- | --- | --- | --- | --- |
| Frontend Language | TypeScript | 5.3 | Shared typing across UI/BFF | Enables AI agents to work safely throughout monorepo |
| Frontend Framework | Next.js | 14.1 | App Router UI + API routes | Aligns with PRD assumptions, bilingual routing, edge rendering |
| UI Library | Radix UI + headless primitives | 2.x | Accessible building blocks | WCAG AA out of the box, easy theming |
| State Management | Zustand + TanStack Query | 4.5 / 5 | Local UI state + async polling | Separates UX concerns from network cache |
| Backend Language | TypeScript | 5.3 | Lambdas + shared libs | Single language for all agents |
| Backend Framework | SST 3 (on AWS Lambda) | 3.x | Worker packaging + infra binding | Combines CDK power with batteries-included DX |
| API Style | REST (JSON) | v1 | Job submission & insight fetch | Simple, flexible for future surfaces |
| Database | Supabase Postgres | 15 | 30-day TTL storage | Managed Postgres + built-in Auth |
| Queue/Cache | Upstash Redis | 7 | BullMQ jobs + ephemeral cache | Serverless Redis with metrics/quota alerts |
| File Storage | AWS S3 | latest | Markdown/PDF exports | Durable storage + signed URLs |
| Authentication | Supabase Auth | latest | Creator login/session | Magic link/OAuth + row-level policies |
| LLM Provider | Vertex AI Gemini 1.5 Pro | latest | Narrative summaries | Paid but offers trial credits, meets production needs |
| Frontend Testing | Vitest + Testing Library | latest | Component/unit | Fast ESM runner |
| Backend Testing | Vitest (Node) + MSW | latest | Lambda/service | Same tooling across stack |
| E2E Testing | Playwright | 1.41 | Workflow + a11y | Cross-browser w/ accessibility checks |
| Build Tool | Turborepo + pnpm | latest | Orchestrate builds/lint/tests | Incremental caching, workspace aware |
| Bundler | Next.js (Webpack/Turbopack) | 14.1 | SSR/ISR bundles | Native to Next.js |
| IaC | Terraform + SST bindings | latest | AWS/S3/Upstash/Supabase infra | Declarative + composable |
| CI/CD | GitHub Actions | latest | Lint/test/deploy | Existing host, supports OIDC |
| Monitoring | Sentry + CloudWatch + Vercel Analytics | latest | Error/perf tracking | Covers browser + serverless |
| Logging | CloudWatch Logs + Supabase log drains | latest | Centralized logs | Supports quota dashboards |
| CSS Framework | Tailwind CSS | 3.4 | Utility-first styling | Fast bilingual theming |
