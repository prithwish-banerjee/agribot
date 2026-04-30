const express = require('express');
const router = express.Router();
const axios = require('axios');

// 🔥 PUT YOUR OPENROUTER API KEY HERE
const OPENROUTER_API_KEY = "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";

router.post('/chat', async (req, res) => {
    try {
        console.log("CHAT HIT");
        console.log("BODY:", req.body);

        const { message, lang } = req.body;

        // ✅ Declared ONCE
        const langMap = {
            en: "English",
            hi: "Hindi",
            bn: "Bengali"
        };

        const selectedLang = langMap[lang] || "English";

        if (!message) {
            return res.status(400).json({ reply: "No message provided" });
        }

        // 🎯 Prompt
        const prompt = `
You are an agriculture expert helping farmers.

User problem: ${message}

IMPORTANT:
- Understand the user's language automatically
- Respond ONLY in ${selectedLang}

Give:
- Problem
- Causes
- Solution
- Prevention

Keep it simple.
`;

        // 🚀 OpenRouter API call
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: "openai/gpt-oss-120b:free",
                messages: [
                    { role: "user", content: prompt }
                ],
                reasoning: { enabled: true }
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // ✅ Extract reply
        const reply =
            response.data?.choices?.[0]?.message?.content ||
            "No response from AI";

        console.log("AI REPLY:", reply);

        res.json({ reply });

    } catch (err) {
        console.error("OPENROUTER ERROR:", err.response?.data || err.message);

        res.status(500).json({
            reply: "AI not working. Try again later."
        });
    }
});

module.exports = router;