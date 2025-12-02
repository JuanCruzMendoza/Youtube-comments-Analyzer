const apiKey = process.env.GOOGLE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            console.error(`Error ${response.status}:`, JSON.stringify(data, null, 2));
        } else {
            console.log("Available Models:");
            data.models.forEach(m => console.log(`- ${m.name}`));
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

listModels();
