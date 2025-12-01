import { processIngestion } from "./ingestion";

export const handler = async (event: any) => {
    console.log("Handler received event:", JSON.stringify(event));

    let body;
    if (typeof event.body === "string") {
        body = JSON.parse(event.body);
    } else if (event.body) {
        body = event.body;
    } else {
        body = event;
    }

    console.log("Parsed body:", body);
    const { runId, videoId } = body;

    if (runId && videoId) {
        await processIngestion(runId, videoId);

        // Trigger analysis immediately for MVP
        // In production, this should probably be a separate job enqueued by ingestion
        await import("./analysis").then(m => m.processAnalysis(runId));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Ingestion and Analysis processed" }),
        };
    }

    return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing runId or videoId" }),
    };
};
