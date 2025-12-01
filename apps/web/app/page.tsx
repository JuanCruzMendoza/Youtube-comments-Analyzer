"use client";

import { useState } from "react";
import { cn } from "@repo/ui";

export default function Home() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/runs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            const data = await res.json();
            if (res.ok) {
                // Redirect to the run page
                window.location.href = `/runs/${data.runId}`;
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error) {
            setStatus("Failed to submit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-xl w-full items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8 text-center">YouTube Comment Insights</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Paste YouTube Video URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="p-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Starting..." : "Analyze Comments"}
                    </button>
                </form>

                {status && (
                    <div className="mt-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                        {status}
                    </div>
                )}
            </div>
        </main>
    );
}
