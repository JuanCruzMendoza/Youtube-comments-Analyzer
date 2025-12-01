import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ANALYSIS_PROMPT, AnalysisResponse } from "@repo/prompt-kit";
import { CommentClusterSchema } from "@repo/shared";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
);

export async function processAnalysis(runId: string) {
    console.log(`Starting analysis for run ${runId}`);

    // Lazy initialization to ensure env vars are loaded
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("GOOGLE_API_KEY is not set");
    }
    // Log first 5 chars for debugging
    console.log("Using API Key:", process.env.GOOGLE_API_KEY.substring(0, 5) + "...");

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    try {
        // 1. Fetch comments
        const { data: comments, error: fetchError } = await supabase
            .from("comment_threads")
            .select("text")
            .eq("run_id", runId)
            .limit(500); // Limit context for now

        if (fetchError) throw fetchError;
        if (!comments || comments.length === 0) {
            console.log("No comments to analyze");
            return;
        }

        const commentsText = comments.map((c) => c.text).join("\n---\n");

        // 2. Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = ANALYSIS_PROMPT.replace("{{comments}}", commentsText);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 3. Parse Response
        console.log("Raw Gemini response:", text);

        let jsonString = text;

        // Extract JSON from markdown code block if present
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
            jsonString = codeBlockMatch[1];
        }

        // Ensure we only have the JSON object (find first { and last })
        const jsonStart = jsonString.indexOf("{");
        const jsonEnd = jsonString.lastIndexOf("}");

        if (jsonStart !== -1 && jsonEnd !== -1) {
            jsonString = jsonString.substring(jsonStart, jsonEnd + 1);
        }

        let analysis: AnalysisResponse;
        try {
            analysis = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse JSON:", jsonString);
            throw e;
        }

        // 4. Store Results
        // Store clusters
        const clusters = analysis.clusters.map((cluster) => ({
            id: crypto.randomUUID(),
            run_id: runId,
            label: cluster.label,
            category: cluster.category,
            frequency: cluster.frequency,
            sentiment_summary: cluster.sentimentSummary,
            examples: cluster.examples,
            recommendations: cluster.recommendations,
            created_at: new Date().toISOString(),
        }));

        if (clusters.length > 0) {
            const { error: clusterError } = await supabase
                .from("comment_clusters")
                .insert(clusters);

            if (clusterError) throw clusterError;
        }

        // Update run with summary
        const { error: updateError } = await supabase
            .from("video_analysis_runs")
            .update({
                summary: { text: analysis.summary }, // Storing as JSONB
                status: "completed",
                completed_at: new Date().toISOString(),
            })
            .eq("id", runId);

        if (updateError) throw updateError;

        console.log("Analysis complete");

    } catch (error) {
        console.error("Analysis failed:", error);
        await supabase
            .from("video_analysis_runs")
            .update({ status: "failed", error: JSON.stringify(error) })
            .eq("id", runId);
    }
}
