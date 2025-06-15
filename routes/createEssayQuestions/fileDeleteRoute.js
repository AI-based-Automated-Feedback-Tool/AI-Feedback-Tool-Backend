const express = require('express');
const router = express.Router();
const {deleteEssayAttachment } = require('../../controllers/createEssayQuestions/fileDeleteController');

// DELETE /api/questions/delete-attachment
router.delete("/", deleteEssayAttachment);

module.exports = router;