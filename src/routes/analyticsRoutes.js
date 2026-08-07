const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { summary, issueCertificate } = require('../controllers/analyticsController');

router.get('/summary', auth, summary);
router.post('/certificates/issue', auth, issueCertificate);

module.exports = router;
