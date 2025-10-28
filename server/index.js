const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const client = new OpenAIApi(cfg);

app.post("/api/ai/describe", async (req, res) => {
  const { name, farmer, location, price, unit, image } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });

  const prompt = `Write a short SEO-friendly product description (40-90 words) and 5 concise tags (comma-separated) for the following product. Respond with JSON: {"description":"...","tags":["tag1","tag2"]} Product:\nName: ${name}\nFarmer: ${farmer}\nLocation: ${location || ""}\nPrice: ${price} ${unit}\nImage: ${image || ""}`;

  try {
    const completion = await client.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: "You are a helpful assistant that returns JSON only." }, { role: "user", content: prompt }],
      max_tokens: 300,
    });
    const text = completion.data.choices[0].message.content;
    // try to parse JSON out of text
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) {
      // attempt to find JSON substring
      const m = text.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : { description: text, tags: [] };
    }
    res.json({ ok: true, result: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: "messages required" });
  try {
    const completion = await client.createChatCompletion({ model: "gpt-4o-mini", messages, max_tokens: 800 });
    res.json({ ok: true, reply: completion.data.choices[0].message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`AI proxy running on ${port}`));
