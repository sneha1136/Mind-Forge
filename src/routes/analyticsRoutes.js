const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { summary, issueCertificate, listCertificates } = require('../controllers/analyticsController');

router.get('/summary', auth, summary);
router.post('/certificates/issue', auth, issueCertificate);
router.get('/certificates', auth, listCertificates);

module.exports = router;
