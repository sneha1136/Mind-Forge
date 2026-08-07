const prisma = require('../prismaClient');

const createFlashcard = async (req, res) => {
  const { question, interval, nextReviewDate } = req.body;
  try {
    const card = await prisma.flashcard.create({ data: { userId: req.user.id, question, interval: interval || 0, nextReviewDate } });
    res.json(card);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const updateFlashcard = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const card = await prisma.flashcard.update({ where: { id }, data });
    res.json(card);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
};

const listFlashcards = async (req, res) => {
  const cards = await prisma.flashcard.findMany({ where: { userId: req.user.id } });
  res.json(cards);
};

module.exports = { createFlashcard, updateFlashcard, listFlashcards };
