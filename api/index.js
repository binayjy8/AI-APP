require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askQuestion(document, question) {
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  const prompt = `You are a helpful assistant. Answer the question using ONLY the information in the document below. If the answer isn't in the document, say "I don't know based on this document."

Document:
"""
${document}
"""

Question: ${question}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

app.post('/api/ask', async (req, res) => {
  try {
    const { document, question } = req.body;

    if (!document || !question) {
      return res.status(400).json({ error: 'document and question are both required' });
    }

    const answer = await askQuestion(document, question);
    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong generating the answer' });
  }
});

module.exports = app;