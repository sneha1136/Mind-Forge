const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createFlashcard, updateFlashcard, listFlashcards } = require('../controllers/flashcardController');

router.use(auth);
router.post('/', createFlashcard);
router.get('/', listFlashcards);
router.patch('/:id', updateFlashcard);

module.exports = router;
