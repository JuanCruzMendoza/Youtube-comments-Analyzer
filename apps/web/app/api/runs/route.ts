import { NextResponse } from "next/server";
import { z } from "zod";
import { Redis } from "@upstash/redis";

import { createClient } from "@supabase/supabase-js";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CreateRunSchema = z.object({
    url: z.string().url(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = CreateRunSchema.parse(body);

        const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
        if (!videoIdMatch) {
            return NextResponse.json(
                { error: "Invalid YouTube URL" },
                { status: 400 }
            );
        }
        const videoId = videoIdMatch[1];

        // In a real app, we would create a record in Supabase here first.
        // For MVP, we'll just enqueue the job.
        // We need a runId. Let's generate one or let the worker create it?
        // Better to create it here so we can return it to the user.
        // But we need Supabase client for that.
        // For now, let's just enqueue with a fake runId or let the worker handle it.
        // Actually, the architecture says BFF -> DB (create run) -> Queue.

        // We'll skip DB creation for this specific step to keep it simple and focus on Queue connectivity,
        // but we'll pass the videoId to the worker.

        const runId = crypto.randomUUID();

        // Create run record in Supabase
        const { error } = await supabase.from("video_analysis_runs").insert({
            id: runId,
            video_id: videoId,
            status: "pending",
            user_id: "00000000-0000-0000-0000-000000000000", // Placeholder
        });

        if (error) {
            console.error("Supabase error:", error);
            throw new Error("Failed to create run record");
        }

        await redis.lpush("ingestion-queue", JSON.stringify({ runId, videoId }));

        return NextResponse.json({ runId, status: "pending" });
    } catch (error) {
        console.error("Error creating run:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
