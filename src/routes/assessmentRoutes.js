const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createAssessment, listAssessments } = require('../controllers/assessmentController');

router.use(auth);
router.post('/', createAssessment);
router.get('/', listAssessments);

module.exports = router;
