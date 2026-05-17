const express = require('express');
const router = express.Router();
const shortlistController = require('../controllers/shortlistController');

router.post('/save', shortlistController.saveShortlist);
router.get('/', shortlistController.getShortlists);

module.exports = router;
