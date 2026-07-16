const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai'); // Google ka package
require('dotenv').config();

const app = express();
const PORT = 5050;

// Middlewares
app.use(cors());
app.use(express.json());

// Google Gemini Setup (Yahan ab poori tarah Gemini set ho gaya hai)
// Naya safe tarika jo .env se key uthayega:
const aiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: aiKey });

// Testing Route
app.get('/', (req, res) => {
    res.send('Backend Server with Free Gemini AI is Active! 🚀');
});

// 🤖 MAIN AI CODE REVIEW ROUTE
app.post('/api/review', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: "Bhai, code bhejna bhool gaye!" });
    }

    try {
        console.log("🔄 Frontend se code aa gaya, Gemini AI ko bhej raha hun...");
        
        // Gemini Model call
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', 
            contents: `You are an expert code reviewer. Analyze this code for bugs, syntax errors, and optimizations. Give feedback in clear bullet points: \n\n ${code}`,
        });

        console.log("✅ Gemini AI ne jawaab de diya!");
        res.json({ review: response.text }); 
    } catch (error) {
        console.error("❌ BACKEND ERROR:", error.message);
        res.status(500).json({ error: `AI response fail ho gaya bhai! Reason: ${error.message}` });
    }
});

// Server Listen
app.listen(PORT, () => {
    console.log(`Bhai tera Free AI server Port ${PORT} par mast chal raha hai! 🚀`);
});