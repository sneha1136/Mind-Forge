const OpenAI = require('@openai/api');
const prisma = require('../prismaClient');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateQuestion = async (req, res) => {
  const { difficulty, mode, topic } = req.body;
  try {
    const prompt = `Generate one ${mode} question for topic ${topic} at ${difficulty} difficulty. Respond JSON depending on mode.`;
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800
    });
    const text = resp.choices?.[0]?.message?.content || resp?.data?.choices?.[0]?.message?.content;
    // Try to parse JSON if the model returned it
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { parsed = { raw: text }; }
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message || 'OpenAI error' });
  }
};

const rankResources = async (req, res) => {
  const { status, topic } = req.body;
  try {
    const prompt = `User status: ${status}. For topic ${topic} return a ranked list (3) of study subtopics with rationale in JSON.`;
    const resp = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 600 });
    const text = resp.choices?.[0]?.message?.content || resp?.data?.choices?.[0]?.message?.content;
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { parsed = { raw: text }; }
    res.json(parsed);
  } catch (err) { res.status(500).json({ error: err.message || 'OpenAI error' }); }
};

const evaluateAnswer = async (req, res) => {
  const { answer, question } = req.body;
  try {
    const prompt = `Evaluate this answer for question:\nQ: ${question}\nA: ${answer}\nReturn JSON with score (0-100), feedback, and suggestions.`;
    const resp = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 600 });
    const text = resp.choices?.[0]?.message?.content || resp?.data?.choices?.[0]?.message?.content;
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { parsed = { raw: text }; }
    res.json(parsed);
  } catch (err) { res.status(500).json({ error: err.message || 'OpenAI error' }); }
};

module.exports = { generateQuestion, rankResources, evaluateAnswer };
