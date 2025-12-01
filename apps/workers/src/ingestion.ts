import { Redis } from "@upstash/redis";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";
import { VideoAnalysisRunSchema, CommentThreadSchema } from "@repo/shared";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
});

export async function processIngestion(runId: string, videoId: string) {
    console.log(`Starting ingestion for run ${runId}, video ${videoId}`);

    try {
        // 1. Fetch comments from YouTube
        let allComments: any[] = [];
        let nextPageToken: string | undefined = undefined;
        let pageCount = 0;

        do {
            const response = await youtube.commentThreads.list({
                part: ["snippet", "replies"],
                videoId: videoId,
                maxResults: 100,
                pageToken: nextPageToken,
                textFormat: "plainText",
            });

            const items = response.data.items || [];
            allComments = [...allComments, ...items];
            nextPageToken = response.data.nextPageToken as string | undefined;
            pageCount++;

            // Limit to 1000 comments for MVP (approx 10 pages)
            if (pageCount >= 10) break;
        } while (nextPageToken);

        console.log(`Fetched ${allComments.length} comments`);

        // 2. Transform and Store in Supabase
        // Note: In a real app, we would create the run record first if it doesn't exist.
        // For MVP, we'll assume we can just insert comments or we need to create the run first.
        // Let's create the run record now to ensure referential integrity.

        // Check if run exists (it might not if we skipped DB creation in API)
        const { data: existingRun } = await supabase
            .from("video_analysis_runs")
            .select("id")
            .eq("id", runId)
            .single();

        if (!existingRun) {
            // Create a dummy user ID for now if we don't have one, or use a system user.
            // Since we are using the anon key, we might be restricted.
            // Ideally we should have passed the userId from the frontend.
            // For this MVP step, let's try to insert. If it fails due to RLS, we know why.
            // We'll use a hardcoded UUID for the user if needed, or skip user_id if nullable (it's not).
            // Let's assume the user is authenticated in the web app and we passed the token?
            // No, we are in a worker.
            // We'll try to insert with a random UUID for user_id just to make it work for now,
            // assuming RLS allows it or we are admin.
            // Actually, "anon" key usually can't bypass RLS for "insert with arbitrary user_id".
            // But let's try.

            const { error: runError } = await supabase.from("video_analysis_runs").insert({
                id: runId,
                video_id: videoId,
                user_id: "00000000-0000-0000-0000-000000000000", // Placeholder
                status: "processing",
                language: "en", // Default
                sensitivity: 0.5,
            });

            if (runError) {
                console.error("Error creating run:", runError);
                // If we can't create the run, we can't store comments.
                // But maybe the table doesn't exist yet? We haven't run migrations!
                throw new Error(`Failed to create run: ${runError.message}`);
            }
        }

        const commentRecords = allComments.map((item) => {
            const snippet = item.snippet?.topLevelComment?.snippet;
            return {
                run_id: runId,
                external_id: item.id,
                text: snippet?.textDisplay || "",
                author: {
                    name: snippet?.authorDisplayName,
                    avatar: snippet?.authorProfileImageUrl,
                },
                engagement: {
                    likes: snippet?.likeCount || 0,
                    replies: item.snippet?.totalReplyCount || 0,
                },
                published_at: snippet?.publishedAt,
                created_at: new Date().toISOString(),
            };
        });

        if (commentRecords.length > 0) {
            const { error: insertError } = await supabase
                .from("comment_threads")
                .insert(commentRecords);

            if (insertError) {
                console.error("Error inserting comments:", insertError);
                throw insertError;
            }
        }

        console.log("Ingestion complete");

        // Update status
        // Update status
        const { error: updateError } = await supabase
            .from("video_analysis_runs")
            .update({ status: "processing", comment_count: commentRecords.length })
            .eq("id", runId);

        if (updateError) {
            console.error("Error updating status:", updateError);
            throw updateError;
        }

    } catch (error) {
        console.error("Ingestion failed:", error);
        await supabase
            .from("video_analysis_runs")
            .update({ status: "failed", error: JSON.stringify(error) })
            .eq("id", runId);
    }
}
