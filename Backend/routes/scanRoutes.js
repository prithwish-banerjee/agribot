const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

const upload = multer();

// 🔥 KEYS
const PLANT_API_KEY = "OEDKOyL4g6JgetR9qpQIuBnpacLubF4xaTa5DE3kmP74m8aCdR";
const OPENROUTER_API_KEY = "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";

router.post('/', upload.single('image'), async (req, res) => {
    try {
        console.log("SCAN HIT");

        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const imageBase64 = req.file.buffer.toString('base64');

        // 🌿 1. CALL PLANT.ID
        const plantRes = await axios.post(
            'https://plant.id/api/v3/identification',
            {
                images: [imageBase64],
                health: "all",
                classification_level: "all",
                disease_model: "full",
                similar_images: true
            },
            {
                headers: {
                    'Api-Key': PLANT_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = plantRes.data;

        console.log("PLANT RESPONSE RECEIVED");

        // 🧠 2. EXTRACT DISEASE INFO
        let diseaseName = "No clear disease detected";
        let confidence = 0;

        if (!data.health_assessment) {
            diseaseName = "Unable to analyze image properly";
        }

        if (data.health_assessment?.is_healthy?.binary === false) {
            const diseases = data.health_assessment.diseases;

            if (diseases && diseases.length > 0) {
                diseaseName = diseases[0].name;
                confidence = diseases[0].probability;
            } else {
                diseaseName = "Possible issue detected";
            }
        }

        // 🧠 3. BUILD AI PROMPT
const prompt = `
You are an agriculture expert.

Scan result:
${diseaseName === "No clear disease detected" 
    ? "No clear disease detected from image."
    : `Disease: ${diseaseName}, Confidence: ${confidence}`}

Give:
- Possible issue (if any)
- What farmer should check
- General advice
- Preventive steps

Keep it simple.
`;

        // 🤖 4. CALL OPENROUTER
        const aiRes = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: "openai/gpt-oss-120b:free",
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const aiReply =
            aiRes.data?.choices?.[0]?.message?.content ||
            "AI response not available";

        // ✅ 5. FINAL RESPONSE (ONLY ONCE)
        res.json({
            disease: diseaseName,
            confidence: confidence,
            ai: aiReply
        });

    } catch (err) {
        console.error("SCAN ERROR:", err.response?.data || err.message);

        res.status(500).json({
            error: "Scan + AI failed"
        });
    }
});

module.exports = router;