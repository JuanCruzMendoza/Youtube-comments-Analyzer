import { createClient } from "@supabase/supabase-js";
import { SentimentChart, cn } from "@repo/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force dynamic rendering as we are fetching data that changes
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

const supabase = createClient(supabaseUrl, supabaseKey);

async function getRun(id: string) {
    const { data: run } = await supabase
        .from("video_analysis_runs")
        .select("*")
        .eq("id", id)
        .single();
    return run;
}

async function getClusters(runId: string) {
    const { data: clusters } = await supabase
        .from("comment_clusters")
        .select("*")
        .eq("run_id", runId)
        .order("frequency", { ascending: false });
    return clusters || [];
}

export default async function RunPage({ params }: { params: { id: string } }) {
    const run = await getRun(params.id);

    if (!run) {
        notFound();
    }

    const clusters = await getClusters(params.id);

    // Calculate sentiment distribution from clusters for the chart
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    let totalFreq = 0;

    clusters.forEach((c) => {
        const freq = c.frequency || 0;
        const sentiment = c.sentiment_summary as { positive: number; neutral: number; negative: number };
        if (sentiment) {
            positive += (sentiment.positive || 0) * freq;
            neutral += (sentiment.neutral || 0) * freq;
            negative += (sentiment.negative || 0) * freq;
            totalFreq += freq;
        }
    });

    // Normalize
    if (totalFreq > 0) {
        positive = Math.round(positive / totalFreq);
        neutral = Math.round(neutral / totalFreq);
        negative = Math.round(negative / totalFreq);
    }

    const sentimentData = [
        { name: "Positive", value: positive, color: "#22c55e" }, // green-500
        { name: "Neutral", value: neutral, color: "#94a3b8" }, // slate-400
        { name: "Negative", value: negative, color: "#ef4444" }, // red-500
    ];

    const summaryText = (run.summary as { text: string })?.text || "No summary available.";

    return (
        <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
            <div className="w-full max-w-5xl space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-blue-600 hover:underline">
                        &larr; Analyze another video
                    </Link>
                    <div className="text-sm text-gray-500">
                        Status: <span className="font-semibold uppercase">{run.status}</span>
                    </div>
                </div>

                {run.status === "processing" || run.status === "pending" ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold animate-pulse">Analyzing comments...</h2>
                        <p className="text-gray-500 mt-2">This may take a minute. Refresh the page to check status.</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Section */}
                        <section className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
                            <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
                            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                                {summaryText}
                            </div>
                        </section>

                        {/* Sentiment Chart */}
                        <section className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700">
                            <h2 className="text-xl font-bold mb-6">Sentiment Overview</h2>
                            <SentimentChart data={sentimentData} />
                        </section>

                        {/* Clusters Grid */}
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Thematic Clusters</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {clusters.map((cluster) => (
                                    <div key={cluster.id} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                {cluster.label}
                                            </h3>
                                            <span className={cn(
                                                "px-2 py-1 text-xs rounded-full font-medium uppercase",
                                                cluster.category === "praise" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                                cluster.category === "critique" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                                cluster.category === "recommendation" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                                                cluster.category === "debate" && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
                                                cluster.category === "other" && "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
                                            )}>
                                                {cluster.category}
                                            </span>
                                        </div>

                                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex justify-between mb-2">
                                                <span>Frequency</span>
                                                <span className="font-mono">{cluster.frequency}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${cluster.frequency}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-auto space-y-3">
                                            <div className="text-sm">
                                                <p className="font-semibold mb-1 text-gray-700 dark:text-gray-200">Examples:</p>
                                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                                                    {cluster.examples?.slice(0, 2).map((ex: string, i: number) => (
                                                        <li key={i} className="truncate">"{ex}"</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {cluster.recommendations && cluster.recommendations.length > 0 && (
                                                <div className="text-sm bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                                                    <p className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Recommendation:</p>
                                                    <p className="text-blue-700 dark:text-blue-400">{cluster.recommendations[0]}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    );
}
