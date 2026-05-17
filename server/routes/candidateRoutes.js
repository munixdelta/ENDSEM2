const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.get('/', candidateController.getCandidates);
router.get('/:id', candidateController.getCandidateById);
router.post('/', candidateController.addCandidate);
router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;
