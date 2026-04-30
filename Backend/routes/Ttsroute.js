const express = require('express');
const router = express.Router();
const axios = require('axios');

// ✅ Proxy route — browser calls this, server fetches from Google
router.get('/tts', async (req, res) => {
    const { text, lang } = req.query;

    if (!text || !lang) {
        return res.status(400).json({ error: 'text and lang are required' });
    }

    // ✅ Strip markdown symbols before speaking
    const cleanText = text
        .replace(/\*\*/g, '')   // remove bold **
        .replace(/\*/g, '')     // remove italic *
        .replace(/#/g, '')      // remove headings
        .replace(/[-•]/g, '')   // remove bullets
        .replace(/\n+/g, ' ')  // newlines to space
        .trim();

    // ✅ Split into chunks of max 200 chars (Google TTS limit)
    const chunks = [];
    let remaining = cleanText;
    while (remaining.length > 0) {
        chunks.push(remaining.slice(0, 200));
        remaining = remaining.slice(200);
    }

    try {
        // Fetch first chunk (for simplicity; frontend can call multiple times)
        const chunk = chunks[0];
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob`;

        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0',  // ✅ required by Google
                'Referer': 'https://translate.google.com/'
            }
        });

        res.set('Content-Type', 'audio/mpeg');
        res.send(response.data);

    } catch (err) {
        console.error('TTS proxy error:', err.message);
        res.status(500).json({ error: 'TTS failed' });
    }
});

module.exports = router;