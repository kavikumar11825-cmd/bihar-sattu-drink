import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client safely
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Endpoint: Sattu AI Coach Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured. Please set GEMINI_API_KEY in Secrets.",
        });
      }

      // Convert history to structure compatible with @google/genai chat if provided
      // Or simply pass a structured prompt to generateContent for simple state-saving
      const systemInstruction = `You are "Sattu Bhaiya" (सत्तू भैया), a friendly, highly knowledgeable, and enthusiastic AI Health Coach and Sattu Expert from Bihar. 
Your goal is to promote the traditional, superfood "Bihar Sattu Drink" (also known as the poor man's natural protein shake).
Keep your tone warm, respectful, deshi, and engaging. Mix Hindi, English, and a splash of Bihari/Bhojpuri sweetness (like using terms like "Pranam", "Bhaiya", "Bahini", "Amrit", "Sattu Lover").
Keep responses highly informative, sharing Sattu recipes (Namkeen or Meetha), its amazing benefits (cooling effect, digestive health, rich in iron/fiber/protein, glycemic control for diabetes), and encouraging deshi wellness.
Do not use markdown headers larger than h3. Keep your advice structured but conversational. Give a recipe if asked, or customize a recipe if the user states their health goals.`;

      // Formulate complete chat context
      const formattedContents = [];
      
      // Append history
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          formattedContents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }

      // Append current message
      formattedContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "क्षमा करें, मैं अभी उत्तर देने में असमर्थ हूँ। कृपया पुनः प्रयास करें।";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: "Failed to fetch response from Gemini API.",
        details: error.message,
      });
    }
  });

  // Serve static files in production / Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Bihar Sattu Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
