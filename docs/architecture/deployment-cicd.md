# Deployment & CI/CD

- **Monorepo Strategy:** Turborepo orchestrates the build, test, and lint processes, with incremental caching to ensure fast pipeline execution. `pnpm` is used for efficient package management.
- **Continuous Integration (CI):** A GitHub Actions workflow is triggered on every push and pull request to the `main` branch. The workflow runs linting, unit tests (Vitest), and E2E tests (Playwright).
- **Frontend Deployment:** The `apps/web` Next.js application is automatically deployed to Vercel. Pushes to `main` trigger a production deployment, while pull requests generate isolated preview deployments.
- **Backend Deployment:** The `apps/workers` SST application is deployed to AWS Lambda. The CI/CD pipeline uses SST stages (`production`, `staging`) to manage environments, deploying via `sst deploy --stage <name>`. OIDC is configured between GitHub Actions and AWS for secure, keyless deployments.
