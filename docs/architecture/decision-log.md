# Decision Log

- **ADR-001: Monorepo vs. Polyrepo.**
  - **Decision:** Adopt a Turborepo monorepo.
  - **Rationale:** Maximizes code/type sharing (`packages/shared`), simplifies dependency management, and streamlines the developer experience for a small, cross-functional team of AI agents.
- **ADR-002: Hybrid Cloud vs. All-in-one Provider.**
  - **Decision:** Use a hybrid of Vercel (frontend), AWS (workers), Supabase (DB/Auth), and Upstash (Queue).
  - **Rationale:** Leverages the best-in-class developer experience and feature set of each specialized platform, resulting in faster development and a more robust final product.
- **ADR-003: Asynchronous Queue-based Processing vs. Synchronous API Calls.**
  - **Decision:** Implement an asynchronous, queue-based architecture using BullMQ.
  - **Rationale:** Decouples the user-facing API from slow, unpredictable third-party services (YouTube API, Gemini). This improves UI responsiveness, enables robust error handling and retries, and allows for independent scaling of processing workers.