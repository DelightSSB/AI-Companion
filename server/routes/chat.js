// Route for chat
const express = require("express");
const router = express.Router();
const getChatResponse = require("../openai"); // Adjust if you move openai.js later

// POST /chat
router.post("/", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const aiReply = await getChatResponse(userMessage);
    res.json({ reply: aiReply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "AI failed to respond." });
  }
});

module.exports = router;
