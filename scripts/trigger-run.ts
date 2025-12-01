import fetch from "node-fetch";

async function main() {
    const response = await fetch("http://localhost:3000/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://www.youtube.com/watch?v=jNQXAC9IVRw" }),
    });

    const data = await response.json();
    console.log("Response:", data);
}

main();
