// server.js
import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 4001;

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // OpenRouter üzerinden Meta Llama 3.3 70B Instruct çağırıyoruz
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // .env içine ekle
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "system",
              content:
                "Sen AURORA adında akıllı bir asistansın. Kullanıcıya sadece Türkçe ve düzgün, anlaşılır cevaplar ver. Türkçe dışında cevap verme, bozuk karakter kullanma.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json({
      reply: data.choices?.[0]?.message?.content || "Cevap alınamadı.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server ${PORT} portunda çalışıyor`);
});
