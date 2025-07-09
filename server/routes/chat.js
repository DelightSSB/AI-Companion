// Route for chat
const express = require("express");
const router = express.Router();
const getChatResponse = require("../openai"); // Adjust if you move openai.js later
const chat = require("../models/chat");

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

router.post("/new", async (req, res) => {
  try {
    const newChat = new chat(req.body);
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ error: "Failed to save chat." });
  }
});

module.exports = router;
