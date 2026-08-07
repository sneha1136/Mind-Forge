const prisma = require('../prismaClient');
const crypto = require('crypto');

const summary = async (req, res) => {
  try {
    const userId = req.user.id;
    const total = await prisma.flashcard.count({ where: { userId } });
    const mastered = await prisma.flashcard.count({ where: { userId, interval: { gte: 10 } } });
    const retention = total ? Math.round((mastered / total) * 100) : 0;
    // naive streak estimate: count of flashcards reviewed in last 7 days
    const since = new Date(); since.setDate(since.getDate() - 7);
    const recent = await prisma.flashcard.count({ where: { userId, nextReviewDate: { gte: since } } });
    res.json({ total, mastered, retention, recent });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const issueCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const linkedCount = await prisma.linkedPlatforms.count({ where: { userId } });
    const mastered = await prisma.flashcard.count({ where: { userId, interval: { gte: 10 } } });
    if (linkedCount < 1 || mastered < 2) return res.status(400).json({ verified: false, error: 'Requirements not met' });
    const issuedAt = new Date();
    const payload = `${userId}|${issuedAt.toISOString()}`;
    const hmac = crypto.createHmac('sha256', process.env.CERTIFICATE_SECRET || 'dev_secret').update(payload).digest('hex');
    const certificateHash = hmac;
    await prisma.certificate.create({ data: { userId, certificateHash, issuedAt } });
    res.json({ certificateHash, issuedAt, verified: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const listCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const certs = await prisma.certificate.findMany({ where: { userId }, orderBy: { issuedAt: 'desc' } });
    res.json(certs);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

module.exports = { summary, issueCertificate };
