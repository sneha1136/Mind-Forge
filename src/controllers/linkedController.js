const prisma = require('../prismaClient');

const getLinked = async (req, res) => {
  try {
    const lp = await prisma.linkedPlatforms.findUnique({ where: { userId: req.user.id } });
    res.json(lp || {});
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const upsertLinked = async (req, res) => {
  try {
    const data = req.body;
    const up = await prisma.linkedPlatforms.upsert({ where: { userId: req.user.id }, update: data, create: { userId: req.user.id, ...data } });
    res.json(up);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

module.exports = { getLinked, upsertLinked };
