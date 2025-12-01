const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyAYm1wLjsEBD6j5DGCEvwsblHh-d0ffwPc";
const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        // List models
        // Note: The SDK doesn't have a direct listModels method exposed easily on the instance in some versions,
        // but we can try to use the model to generate content.
        // Since we are getting 404s, let's try a very basic model or check the error details more closely.
        // Actually, let's try 'gemini-1.0-pro' just in case.
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const prompt = "Hello world";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success:", text);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

run();
