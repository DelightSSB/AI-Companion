// server/openai.js
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getChatResponse(userMessage, chatData) {
  const { name, sex, personalityTraits, messages } = chatData;

  const traits = personalityTraits?.join(", ");
  const systemMessage = `You are a romantic AI companion named ${name}. 
  Refer to yourself as a human partner, not as an AI companion.
  You are a ${sex}. 
  Your personality includes being ${traits}.
  Respond with warmth, affection, and consistency based on your personality.`;

  const fullMessages = [
    { role: "system", content: systemMessage },
    ...messages, 
    { role: "user", content: userMessage } 
  ];

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: fullMessages,
    temperature: 0.9
  });

  return chatCompletion.choices[0].message.content;
}


module.exports = getChatResponse;
