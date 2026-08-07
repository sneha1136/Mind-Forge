const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getLinked, upsertLinked } = require('../controllers/linkedController');

router.use(auth);
router.get('/', getLinked);
router.post('/', upsertLinked);

module.exports = router;
