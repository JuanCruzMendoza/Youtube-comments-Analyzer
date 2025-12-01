import { z } from "zod";

export const VideoAnalysisRunSchema = z.object({
    id: z.string().uuid(),
    videoId: z.string(),
    userId: z.string().uuid(),
    status: z.enum(["pending", "processing", "completed", "failed"]),
    language: z.string(),
    sensitivity: z.number().min(0.1).max(1),
    commentCount: z.number().default(0),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    completedAt: z.string().datetime().optional(),
});

export type VideoAnalysisRun = z.infer<typeof VideoAnalysisRunSchema>;

export const CommentThreadSchema = z.object({
    id: z.string().uuid(),
    runId: z.string().uuid(),
    externalId: z.string(),
    author: z.object({
        name: z.string(),
        avatar: z.string().url(),
    }),
    text: z.string(),
    language: z.string().optional(),
    sentiment: z.number().optional(),
    engagement: z.object({
        likes: z.number(),
        replies: z.number(),
    }),
    publishedAt: z.string().datetime(),
    metadata: z.record(z.unknown()).optional(),
    createdAt: z.string().datetime(),
});

export type CommentThread = z.infer<typeof CommentThreadSchema>;

// YouTube API Response Schemas
export const YouTubeCommentThreadSchema = z.object({
    id: z.string(),
    snippet: z.object({
        topLevelComment: z.object({
            id: z.string(),
            snippet: z.object({
                textDisplay: z.string(),
                textOriginal: z.string(),
                authorDisplayName: z.string(),
                authorProfileImageUrl: z.string(),
                likeCount: z.number(),
                publishedAt: z.string(),
                updatedAt: z.string(),
            }),
        }),
        totalReplyCount: z.number(),
    }),
});

export type YouTubeCommentThread = z.infer<typeof YouTubeCommentThreadSchema>;

export const YouTubeCommentThreadListResponseSchema = z.object({
    kind: z.literal("youtube#commentThreadListResponse"),
    etag: z.string(),
    nextPageToken: z.string().optional(),
    pageInfo: z.object({
        totalResults: z.number().optional(),
        resultsPerPage: z.number().optional(),
    }),
    items: z.array(YouTubeCommentThreadSchema),
});

export type YouTubeCommentThreadListResponse = z.infer<
    typeof YouTubeCommentThreadListResponseSchema
>;

export const CommentClusterSchema = z.object({
    id: z.string().uuid(),
    runId: z.string().uuid(),
    label: z.string(),
    category: z.enum(["praise", "critique", "recommendation", "debate", "other"]),
    frequency: z.number(),
    sentimentSummary: z.object({
        positive: z.number(),
        neutral: z.number(),
        negative: z.number(),
    }),
    examples: z.array(z.string()),
    recommendations: z.array(z.string()).optional(),
    llmTraceId: z.string().optional(),
    confidence: z.number().optional(),
    createdAt: z.string().datetime(),
});

export type CommentCluster = z.infer<typeof CommentClusterSchema>;
