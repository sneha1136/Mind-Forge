const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateQuestion, rankResources, evaluateAnswer } = require('../controllers/aiController');

router.post('/generate-question', auth, generateQuestion);
router.post('/rank-resources', auth, rankResources);
router.post('/evaluate-answer', auth, evaluateAnswer);

module.exports = router;
