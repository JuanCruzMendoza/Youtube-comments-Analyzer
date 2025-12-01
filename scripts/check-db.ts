import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "apps/workers/.env.local") });

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
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
}

main();
