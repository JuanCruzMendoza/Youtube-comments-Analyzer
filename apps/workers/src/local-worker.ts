import { Redis } from "@upstash/redis";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
const result = dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

if (result.error) {
    console.error("Error loading .env.local:", result.error);
}

console.log("Loaded GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.substring(0, 5) + "..." : "undefined");

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function main() {
    console.log("👷 Local worker started. Listening for jobs on 'ingestion-queue'...");

    while (true) {
        try {
            // Use lpop for HTTP client (polling)
            const value = await redis.lpop("ingestion-queue");

            if (value) {
                console.log("📥 Received job:", value);

                // Invoke the handler
                // The handler expects an event with a body property (simulating Lambda/HTTP)
                // or the direct object if we adjusted it.
                // Our handler in index.ts handles both:
                // const body = typeof event.body === "string" ? JSON.parse(event.body) : event;

                // Dynamically import handler to ensure env vars are loaded
                const { handler } = await import("./index");
                await handler({ body: value });

                console.log("✅ Job processed successfully");
            } else {
                // Wait if queue is empty
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error("❌ Error processing job:", error);
            // Wait a bit before retrying to avoid tight loop on error
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}

main();
