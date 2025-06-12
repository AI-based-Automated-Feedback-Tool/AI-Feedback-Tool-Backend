const express = require('express');
const router = express.Router();
const {uploadEssayAttachment } = require('../../controllers/createEssayQuestions/fileUploadController');

// Middleware to handle file uploads
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory for processing
const upload = multer({storage});

// Route to handle file uploads
router.post('/', upload.single('attachment'), uploadEssayAttachment);

module.exports = router;