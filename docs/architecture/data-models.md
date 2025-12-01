# Data Models

## VideoAnalysisRun
```typescript
export interface VideoAnalysisRun {
  id: string;
  videoId: string;
  userId: string;
  status: "pending" | "processing" | "completed" | "failed";
  language: string;
  sensitivity: number;
  commentCount: number;
  summary: NarrativeSummary | null;
  exports: ExportLinks | null;
  error?: ErrorPayload;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
```

## CommentThread
```typescript
export interface CommentThread {
  id: string;
  runId: string;
  externalId: string;
  author: CommentAuthor;
  text: string;
  language: string;
  sentiment: number;
  engagement: EngagementMetrics;
  publishedAt: string;
  metadata: Record<string, unknown>;
}
```

## CommentCluster
```typescript
export interface CommentCluster {
  id: string;
  runId: string;
  label: string;
  category: ClusterCategory;
  frequency: number;
  sentimentSummary: SentimentBreakdown;
  examples: string[];
  recommendations?: string[];
  llmTraceId: string;
  confidence: number;
}
```
