# Security & Compliance

- **Authentication:** Creator identity is managed via Supabase Auth, which provides JWTs for authenticating API requests to the BFF and subsequent service calls.
- **Authorization:** Data access is restricted using Supabase's Row-Level Security (RLS). Policies ensure users can only access `video_analysis_runs` and associated data that they own.
- **Secrets Management:** Vercel Environment Variables are used for frontend/BFF secrets. SST's `Config` feature handles secrets for the Lambda workers, drawing from AWS Secrets Manager.
- **Data Protection:** All data is encrypted at rest by default in Supabase (Postgres) and AWS S3. Communication is secured with TLS 1.2+. The system enforces a 30-day data retention policy via a `DELETE` policy in the database.
- **Compliance:** The frontend will adhere to WCAG AA accessibility standards, enforced through a combination of Radix UI primitives and Playwright-based E2E tests.
