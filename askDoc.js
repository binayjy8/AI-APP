require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

// Test it
const sampleDoc = `
Our company, TechNova, was founded in 2019 in Bangalore.
We build productivity software for small businesses.
Our flagship product, TaskFlow, has over 50,000 active users.
The company has 45 employees across 3 offices: Bangalore, Pune, and remote.
`;

async function main() {
  const answer = await askQuestion(sampleDoc, "What is TechNova's revenue?");
  console.log(answer);
}

main();