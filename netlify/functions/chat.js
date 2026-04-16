// =====================================================
// Netlify Serverless Function — Gemini API Proxy
// API key is stored in Netlify Environment Variables
// Dashboard → Site Settings → Environment Variables
//   Key: GEMINI_API_KEY
//   Value: your_gemini_api_key_here
// =====================================================

exports.handler = async (event) => {
    const CORS_HEADERS = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    // Preflight CORS
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: CORS_HEADERS, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: "GEMINI_API_KEY environment variable is not set. Add it in Netlify → Site Settings → Environment Variables." })
        };
    }

    const MODEL = "gemini-flash-lite-latest";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: event.body
        });

        const data = await response.json();
        return {
            statusCode: response.status,
            headers: CORS_HEADERS,
            body: JSON.stringify(data)
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ error: err.message })
        };
    }
};
