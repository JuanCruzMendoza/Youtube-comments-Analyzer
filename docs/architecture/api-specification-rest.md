# API Specification (REST)
```yaml
openapi: 3.0.0
info:
  title: YouTube Comment Insights API
  version: v1
servers:
  - url: https://api.youtube-insights.app
  - url: https://staging-api.youtube-insights.app
security:
  - bearerAuth: []
paths:
  /runs:
    post:
      summary: Submit a new analysis run
      responses:
        '202': { description: Accepted }
  /runs/{id}:
    get:
      summary: Retrieve run status + summary
  /runs/{id}/clusters:
    get:
      summary: Fetch thematic clusters
  /runs/{id}/exports:
    get:
      summary: Retrieve signed export URLs
  /quota:
    get:
      summary: Remaining daily quota
```
