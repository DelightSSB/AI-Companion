// Route for chat
const express = require("express");
const router = express.Router();
const getChatResponse = require("../openai");
const chat = require("../models/chat");

// Occurs to have the ai respond with context, also saves messages to database
router.post("/", async (req, res) => {
  const { message, chatId } = req.body;

  try {
    const chatDoc = await chat.findById(chatId);
    if (!chatDoc) return res.status(404).json({ error: "Chat not found" });

    const aiReply = await getChatResponse(message, chatDoc);

    chatDoc.messages.push({ role: "user", content: message });
    chatDoc.messages.push({ role: "assistant", content: aiReply });

    await chatDoc.save();

    res.json({ reply: aiReply });
  } catch (err) {
    console.error("Chat update error:", err);
    res.status(500).json({ error: "Failed to update chat." });
  }
});




//Triggers when a new chat is created and saved to mongodb
router.post("/new", async (req, res) => {
  try {    
    const newChat = new chat(req.body);
    const savedChat = await newChat.save();


    if (!savedChat) return res.status(404).json({ error: "Chat not found" });
    const message = "Greet me based on your personality."

    const aiReply = await getChatResponse(message, savedChat);

    savedChat.messages.push({ role: "assistant", content: aiReply });

    await savedChat.save();

    res.status(201).json({ ...savedChat.toObject(), reply: aiReply });
  } catch (err) {
    console.error("Error saving chat:", err);
    res.status(500).json({ error: "Failed to save chat." });
  }
});

//Triggers upon page load to retrive all the made chats. 
router.get("/", async (req, res) => {
  try {
    const chats = await chat.find();
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Failed to fetch chats." });
  }
});

//Triggers to delete a chat
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await chat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Chat not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting chat:", err);
    res.status(500).json({ error: "Failed to delete chat." });
  }
});


module.exports = router;
