# Introduction

This document establishes the fullstack architecture for **YouTube Comment Insights**, unifying backend ingestion/analysis services with the Vercel-hosted frontend to satisfy the PRD goals (≤2‑minute turnaround for ≤1 000 comments, bilingual WCAG AA experience, proactive quota monitoring). It is the authoritative reference for all AI agents contributing to this repository.

## Starter Template or Existing Project
- No starter codebase exists; the repo currently stores only documentation.
- Decision: treat as a **greenfield** Turborepo monorepo with Next.js + SST-managed Lambdas.
- Constraint: tooling must maximize developer experience (TypeScript everywhere, shared configs) while keeping open the path to future service extraction.

## Change Log
| Date       | Version | Description                                      | Author  |
| ---------- | ------- | ------------------------------------------------ | ------- |
| 2025-11-24 | 0.1     | Initial fullstack architecture draft (greenfield) | Winston |
| 2025-11-24 | 1.0     | Completed architecture with Security and CI/CD    | Winston |
