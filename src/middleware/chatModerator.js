const prisma = require('../prismaClient');
const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FAST_BLOCK = [ 'http://', 'https://', 'buy now', 'subscribe', 'free trial', 'discord.gg', 'discord.com', 'spam' ];

async function semanticCheck(message) {
  try {
    const system = "Is this message strictly academic/study-related context? Reply SAFE or OFF_TOPIC.";
    const resp = await client.chat.completions.create({ model: 'gpt-4o-mini', messages: [{ role: 'system', content: system }, { role: 'user', content: message }], max_tokens: 20 });
    const text = resp.choices?.[0]?.message?.content || resp?.data?.choices?.[0]?.message?.content || '';
    if (/SAFE/i.test(text)) return 'SAFE';
    return 'OFF_TOPIC';
  } catch (e) {
    return 'OFF_TOPIC';
  }
}

async function moderateMessage(userId, message) {
  const low = message.toLowerCase();
  for (const kw of FAST_BLOCK) if (low.includes(kw)) return { verdict: 'OFF_TOPIC', reason: 'keyword' };
  const semantic = await semanticCheck(message);
  return { verdict: semantic, reason: 'semantic' };
}

async function handleViolation(userId) {
  const u = await prisma.user.update({ where: { id: userId }, data: { offenseCount: { increment: 1 } } });
  if (u.offenseCount >= 2) {
    await prisma.user.update({ where: { id: userId }, data: { chatBanned: true } });
    return { banned: true };
  }
  return { banned: false, offenseCount: u.offenseCount };
}

module.exports = { moderateMessage, handleViolation };
