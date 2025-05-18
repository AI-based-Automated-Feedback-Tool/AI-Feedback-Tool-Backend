const express = require('express');
const router = express.Router();
const configureExamController = require('../controllers/configureExamController');

// POST /api/configureExam
router.post('/', configureExamController.saveExamConfiguration);

module.exports = router;