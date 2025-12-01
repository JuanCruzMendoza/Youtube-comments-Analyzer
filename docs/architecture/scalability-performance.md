# Scalability & Performance

- **Frontend:** Deployed to Vercel's Edge Network, ensuring low-latency delivery of static assets and server-rendered pages globally.
- **Backend Compute:** The architecture uses auto-scaling, serverless AWS Lambdas for the ingestion and analysis workers. Concurrency limits can be configured to manage costs and downstream API pressure.
- **Database:** Supabase's managed Postgres provides connection pooling via Supavisor. For read-heavy workloads, the schema is designed to allow for materialized views or read replicas if necessary.
- **Queue System:** Upstash Redis (with BullMQ) is a highly-available, serverless solution that can handle millions of jobs, decoupling the UI from backend processing and providing a robust retry mechanism.
- **Identified Bottlenecks:** The primary scaling constraint is the YouTube Data API v3 quota. The system is designed to handle quota exhaustion gracefully by providing clear user feedback and pausing job processing. Proactive monitoring will alert the support team when quotas run low.
