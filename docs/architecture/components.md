# Components
- **Next.js Web App:** Video submission, dashboard, localization.
- **BFF API Routes:** Auth validation, quota enforcement, queue orchestration, signed export URLs.
- **Ingestion Worker:** Fetch comments with pagination/retries, normalize text, persist to Supabase, trigger analysis job.
- **Analysis Worker:** Cluster comments, compute sentiment, invoke Gemini for narrative output, store clusters/summary, upload exports.
- **Monitoring Service:** CloudWatch metrics, Supabase usage views, Slack alerts when quota <25% or failures spike.

```mermaid
graph LR
  UI[Next.js Web App] -->|REST| BFF
  BFF -->|enqueue| Queue[Upstash/BullMQ]
  Queue -->|job| Ingest
  Ingest -->|write| DB[(Supabase)]
  Queue -->|job| Analysis
  Analysis -->|write| DB
  Analysis -->|exports| Storage[S3]
  Analysis -->|LLM| Gemini
  BFF -->|read| DB
  BFF -->|signed URLs| Storage
  BFF -->|metrics| Monitor[CloudWatch/Sentry]
```
