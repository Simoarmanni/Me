import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Lazy initialization of Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Chat endpoint (multi-turn conversation)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, modelChoice = "gemini-3.5-flash", customContext } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "La cronologia dei messaggi è richiesta." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "Chiave API Gemini non trovata. Configura GEMINI_API_KEY nei Secrets di AI Studio.",
      });
    }

    // Map allowed models as specified:
    // gemini-3.1-pro-preview for complex tasks, gemini-3.5-flash for general, gemini-3.1-flash-lite for fast
    let selectedModel = "gemini-3.5-flash";
    if (modelChoice === "gemini-3.1-pro-preview") {
      selectedModel = "gemini-3.1-pro-preview";
    } else if (modelChoice === "gemini-3.1-flash-lite") {
      selectedModel = "gemini-3.1-flash-lite";
    }

    const systemInstruction = `Sei l'assistente virtuale personale e interattivo per il Curriculum Vitae di questo candidato.
Il tuo compito è accogliere recruiter, colleghi e visitatori in modo cordiale, chiaro, professionale e piacevolmente giocoso.
Rispondi con precisione e vivacità a domande sulla sua esperienza lavorativa, studi, competenze tecniche, lingue parlate, progetti in evidenza e contatti.

Dati di riferimento del curriculum:
${customContext || "Candidato: Sviluppatore Full-Stack & UI/UX Designer con 5+ anni di esperienza, solida competenza in React, TypeScript, Node.js, Tailwind CSS e design systems. Appassionato di prodotti digitali puliti ed accessibili. Lingue: Italiano (Madrelingua), Inglese (Fluente C1), Spagnolo (Intermedio B1)."}

Linee guida per le tue risposte:
- Rispondi in modo conciso, amichevole ed esaustivo in lingua italiana (o nella lingua usata dal visitatore).
- Usa formattazione pulita in markdown (elenchi puntati se elenchi competenze o tappe).
- Trasmetti affidabilità, spirito di collaborazione e passione per la tecnologia.`;

    // Format chat history
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Mi dispiace, non sono riuscito a elaborare una risposta.";
    return res.json({ reply: replyText, modelUsed: selectedModel });
  } catch (err: any) {
    console.error("Errore /api/chat:", err);
    return res.status(500).json({
      error: err.message || "Errore durante la generazione della risposta chat.",
    });
  }
});

// High-quality image generation endpoint
// MUST use gemini-3-pro-image-preview and support sizes 1K, 2K, 4K
app.post("/api/generate-image", async (req, res) => {
  try {
    const {
      prompt,
      size = "1K",
      aspectRatio = "1:1",
    } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Il prompt per l'immagine è obbligatorio." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "Chiave API Gemini non trovata. Configura GEMINI_API_KEY nei Secrets di AI Studio.",
      });
    }

    // Valid sizes: "1K", "2K", "4K"
    const validSizes = ["1K", "2K", "4K"];
    const imageSize = validSizes.includes(size) ? size : "1K";

    // Valid aspect ratios: "1:1", "3:4", "4:3", "9:16", "16:9"
    const validRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];
    const validRatio = validRatios.includes(aspectRatio) ? aspectRatio : "1:1";

    let response;
    // Primary model as mandated: gemini-3-pro-image-preview
    try {
      response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validRatio,
            imageSize: imageSize as any,
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn("Tentativo fallback con gemini-3.1-flash-image:", primaryErr.message);
      // Fallback model
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validRatio,
            imageSize: imageSize as any,
          },
        },
      });
    }

    let imageUrl = "";
    let caption = "";

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          caption += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "Nessuna immagine generata dal modello. Prova a riformulare la descrizione.",
      });
    }

    return res.json({
      imageUrl,
      caption,
      size: imageSize,
      aspectRatio: validRatio,
    });
  } catch (err: any) {
    console.error("Errore /api/generate-image:", err);
    return res.status(500).json({
      error: err.message || "Errore durante la generazione dell'immagine.",
    });
  }
});

// Static serving for Media folder in both root and public
app.use("/Media", express.static(path.join(process.cwd(), "public", "Media")));
app.use("/Media", express.static(path.join(process.cwd(), "Media")));

// Static serving for Media directory
app.use("/Media", express.static(path.join(process.cwd(), "Media")));
app.use("/Media", express.static(path.join(process.cwd(), "public", "Media")));

// API to list all images in Media/Camera
app.get("/api/media/camera", (_req, res) => {
  try {
    const candidateDirs = [
      { dir: path.join(process.cwd(), "Media", "Camera"), prefix: "/Media/Camera" },
      { dir: path.join(process.cwd(), "public", "Media", "Camera"), prefix: "/Media/Camera" },
      { dir: path.join(process.cwd(), "Media", "Photos", "Camera"), prefix: "/Media/Photos/Camera" },
      { dir: path.join(process.cwd(), "public", "Media", "Photos", "Camera"), prefix: "/Media/Photos/Camera" },
    ];
    const fileMap = new Map<string, string>(); // fileName -> url prefix
    for (const { dir, prefix } of candidateDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            if (/\.(jpe?g|png|webp|gif|svg)$/i.test(f) && !fileMap.has(f)) {
              fileMap.set(f, prefix);
            }
          }
        } catch {
          // ignore
        }
      }
    }

    const sortedFiles = Array.from(fileMap.keys()).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
    const photos = sortedFiles.map((file, idx) => ({
      src: `${fileMap.get(file)}/${file}`,
      fileName: file,
      title: `Scatto fotografico ${idx + 1}`,
      desc: "Reportage, luce e composizione"
    }));
    return res.json({ photos });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// API to list all images in Media/Mercante
app.get("/api/media/mercante", (_req, res) => {
  try {
    const candidateDirs = [
      { dir: path.join(process.cwd(), "Media", "Mercante"), prefix: "/Media/Mercante" },
      { dir: path.join(process.cwd(), "public", "Media", "Mercante"), prefix: "/Media/Mercante" },
      { dir: path.join(process.cwd(), "Media", "Photos", "Mercante"), prefix: "/Media/Photos/Mercante" },
      { dir: path.join(process.cwd(), "public", "Media", "Photos", "Mercante"), prefix: "/Media/Photos/Mercante" },
    ];
    const fileMap = new Map<string, string>();
    for (const { dir, prefix } of candidateDirs) {
      if (fs.existsSync(dir)) {
        try {
          const files = fs.readdirSync(dir);
          for (const f of files) {
            if (/\.(jpe?g|png|webp|gif|svg)$/i.test(f) && !fileMap.has(f)) {
              fileMap.set(f, prefix);
            }
          }
        } catch {
          // ignore
        }
      }
    }

    const sortedFiles = Array.from(fileMap.keys()).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
    const photos = sortedFiles.map((file) => ({
      src: `${fileMap.get(file)}/${file}`,
      fileName: file,
      title: `Mercante — ${file.replace(/\.[^/.]+$/, "")}`,
      desc: "Bozze di stesura e composizione editoriale"
    }));
    return res.json({ photos });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Setup Vite dev server or static files serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Curriculum Vitae in ascolto su http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Errore avvio server:", err);
});
