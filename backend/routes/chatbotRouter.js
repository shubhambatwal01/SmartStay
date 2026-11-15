const chatbotRouter = require("express").Router();

const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 2000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

chatbotRouter.post("/chatbot", async (req, res) => {
  const { messages } = req.body || {};

  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    messages.some(
      (message) =>
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        !message.content.trim() ||
        message.content.length > MAX_MESSAGE_LENGTH,
    ) ||
    messages[messages.length - 1]?.role !== "user"
  ) {
    return res.status(400).json({
      success: false,
      message: "Please send a valid message (up to 2,000 characters).",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("Chatbot request rejected: GEMINI_API_KEY is not configured.");
    return res.status(503).json({
      success: false,
      message: "The SmartStay assistant is not configured yet.",
    });
  }

  const requestBody = {
    systemInstruction: {
      parts: [
        {
          text: "You are SmartStay's friendly accommodation and travel assistant. Help guests understand how to browse homes, compare stays, save favourites, and use the SmartStay booking experience. Be concise, warm, and practical. Do not claim to see live availability, prices, bookings, or account details; direct users to the relevant SmartStay page for current information. Never ask for passwords, payment details, or other sensitive information.",
        },
      ],
    },
    contents: messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content.trim() }],
    })),
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  };

  let geminiResponse;
  try {
    geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify(requestBody),
      },
    );
  } catch (error) {
    console.error("Gemini request failed:", error.message);
    return res.status(502).json({
      success: false,
      message: "The assistant is temporarily unavailable. Please try again.",
    });
  }

  if (!geminiResponse.ok) {
    let providerMessage = "";
    try {
      const errorBody = await geminiResponse.json();
      providerMessage = errorBody.error?.message || "";
    } catch (error) {
      console.error("Could not read Gemini error response:", error.message);
    }

    console.error(
      `Gemini API returned HTTP ${geminiResponse.status} for model ${GEMINI_MODEL}.`,
      providerMessage,
    );

    if (geminiResponse.status === 404) {
      return res.status(502).json({
        success: false,
        message: `Gemini model "${GEMINI_MODEL}" is unavailable for this API key. Set GEMINI_MODEL to a model enabled for your key (for example, gemini-3.5-flash-lite), then restart or redeploy the backend.`,
      });
    }

    if (geminiResponse.status === 429) {
      return res.status(429).json({
        success: false,
        message: "The assistant is busy right now. Please try again shortly.",
      });
    }

    return res.status(502).json({
      success: false,
      message: "The assistant couldn't generate a reply. Please try again.",
    });
  }

  let result;
  try {
    result = await geminiResponse.json();
  } catch (error) {
    console.error("Gemini returned an invalid response:", error.message);
    return res.status(502).json({
      success: false,
      message: "The assistant returned an invalid reply. Please try again.",
    });
  }

  const reply = result.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!reply) {
    return res.status(502).json({
      success: false,
      message: "The assistant returned an empty reply. Please try again.",
    });
  }

  return res.json({ success: true, reply });
});

module.exports = chatbotRouter;
