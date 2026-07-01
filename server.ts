import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

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

  // API Endpoint: Send OTP (with real dispatch support if keys exist)
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { type, target, code } = req.body;

      if (!target || !code) {
        return res.status(400).json({ error: "Missing target or verification code" });
      }

      let sentReal = false;
      let errorDetails = "";

      if (type === "email") {
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (smtpUser && smtpPass) {
          try {
            const transporter = nodemailer.createTransport({
              host: smtpHost,
              port: smtpPort,
              secure: smtpPort === 465,
              auth: {
                user: smtpUser,
                pass: smtpPass
              }
            });

            const htmlContent = `
              <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e5e5e5; border-radius: 16px; background-color: #fafaf9;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <span style="font-size: 24px; font-weight: 900; color: #d97706;">सत्तू</span>
                  <h2 style="margin: 5px 0 0; font-size: 20px; color: #1c1917;">Bihar Sattu Drink Hub</h2>
                </div>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="font-size: 14px; color: #44403c; line-height: 1.5;">Pranam!</p>
                <p style="font-size: 14px; color: #44403c; line-height: 1.5;">Your secure authentication One-Time Password (OTP) is:</p>
                <div style="text-align: center; margin: 25px 0; padding: 15px; background-color: #fef3c7; border: 1px dashed #f59e0b; border-radius: 12px;">
                  <span style="font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #78350f;">${code}</span>
                </div>
                <p style="font-size: 12px; color: #78716c; line-height: 1.4;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <div style="text-align: center; font-size: 11px; color: #a8a29e;">
                  सत्तू पियो, स्वस्थ जियो! • Built with Love in Bihar
                </div>
              </div>
            `;

            await transporter.sendMail({
              from: `"Bihar Sattu Drink Hub" <${smtpUser}>`,
              to: target,
              subject: `[OTP] ${code} - Sattu Drink Hub Verification Code`,
              text: `Your verification OTP is ${code}. सत्तू पियो, स्वस्थ जियो!`,
              html: htmlContent
            });

            sentReal = true;
          } catch (err: any) {
            console.error("Nodemailer Email dispatch failed:", err);
            errorDetails = err.message || "Mailer configuration mismatch";
          }
        }
      } else if (type === "sms") {
        const twilioSid = process.env.TWILIO_ACCOUNT_SID;
        const twilioToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioFrom = process.env.TWILIO_PHONE_NUMBER;

        if (twilioSid && twilioToken && twilioFrom) {
          try {
            // Clean up target phone (add +91 if needed, assuming Indian numbers default)
            let formattedPhone = target.trim();
            if (!formattedPhone.startsWith("+")) {
              if (formattedPhone.startsWith("91") && formattedPhone.length === 12) {
                formattedPhone = "+" + formattedPhone;
              } else {
                formattedPhone = "+91" + formattedPhone;
              }
            }

            const bodyParams = new URLSearchParams();
            bodyParams.append("To", formattedPhone);
            bodyParams.append("From", twilioFrom);
            bodyParams.append("Body", `Your Bihar Sattu Drink verification OTP is ${code}. Do not share this code. सत्तू पियो, स्वस्थ जियो!`);

            const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
            const basicAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");

            const response = await fetch(twilioUrl, {
              method: "POST",
              headers: {
                "Authorization": `Basic ${basicAuth}`,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              body: bodyParams
            });

            if (response.ok) {
              sentReal = true;
            } else {
              const resData = await response.json();
              errorDetails = resData.message || "Twilio gateway rejection";
            }
          } catch (err: any) {
            console.error("Twilio SMS dispatch failed:", err);
            errorDetails = err.message || "Twilio network timeout";
          }
        }
      }

      return res.json({
        success: true,
        sentReal,
        simulated: !sentReal,
        errorDetails: errorDetails || undefined,
        message: sentReal 
          ? `OTP successfully dispatched to ${target} via live production provider.` 
          : `Dispatched code ${code} to ${target} via sandbox simulator. To enable real cellular/inbox delivery, configure your keys in the Settings Panel.`
      });
    } catch (e: any) {
      console.error("OTP send error:", e);
      return res.status(500).json({ error: "Internal OTP server dispatch error" });
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
