const express = require('express');
const router = express.Router();
const getCodeQuestions = require('../controllers/createCodeQuestions/getCodeQuestions');

// Route to fetch all code questions
router.get('/', async (req, res) => {
    const { exam_id, course_id } = req.query;
  try {
    const questions = await getCodeQuestions({ exam_id, course_id });
    res.status(200).json({ questions });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;