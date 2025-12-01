# External APIs
- **YouTube Data API v3:** `commentThreads.list`, `videos.list` with exponential backoff and quota messaging.
- **Google Vertex AI Gemini 1.5 Pro:** `streamGenerateContent` for narratives; fallback to Gemini Flash during throttling.
- **Slack Webhooks:** Optional but recommended for quota/incident alerts to Creator Success.
