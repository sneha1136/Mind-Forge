const prisma = require('../prismaClient');

const createAssessment = async (req, res) => {
  try {
    const { subTopic, mode, score, feedback } = req.body;
    const a = await prisma.assessmentResult.create({ data: { userId: req.user.id, subTopic, mode, score: Number(score), feedback } });
    res.json(a);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const listAssessments = async (req, res) => {
  try {
    const list = await prisma.assessmentResult.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
    res.json(list);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

module.exports = { createAssessment, listAssessments };
