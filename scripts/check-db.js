const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), "apps/workers/.env.local") });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

async function main() {
    const { data: runs, error } = await supabase
        .from("video_analysis_runs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching runs:", error);
        return;
    }

    console.log("Latest 5 runs:");
    runs.forEach(run => {
        console.log(`ID: ${run.id}, Status: ${run.status}, Created: ${run.created_at}, Video: ${run.video_id}`);
    });

    const specificRunId = "f14dccca-4a64-4b4c-a1c1-f9dbccf0ca66";
    const { data: specificRun } = await supabase
        .from("video_analysis_runs")
        .select("*")
        .eq("id", specificRunId)
        .single();

    if (specificRun) {
        console.log(`\nSpecific Run (${specificRunId}): Status=${specificRun.status}`);
    } else {
        console.log(`\nSpecific Run (${specificRunId}) not found`);
    }
}

main();
