// =====================================================
// Vercel Serverless Function — Gemini API Proxy
// API key is stored in Vercel Environment Variables
// Dashboard → Project → Settings → Environment Variables
//   Key: GEMINI_API_KEY
//   Value: your_gemini_api_key_here
// =====================================================

export default async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({
            error: "GEMINI_API_KEY environment variable is not set. Add it in Vercel → Project Settings → Environment Variables."
        });
    }

    const MODEL = "gemini-flash-lite-latest";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(GEMINI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
