// server/openai.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getChatResponse(userMessage) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // or "gpt-4"
    messages: [
      { role: "system", content: "You are a romantic AI companion, answering any questions with care, love and affection." },
      { role: "user", content: userMessage }
    ]
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = getChatResponse;
