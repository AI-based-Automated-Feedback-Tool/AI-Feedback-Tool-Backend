const express = require('express');
const router = express.Router();
const getCodeQuestions = require('../controllers/createCodeQuestions/getCodeQuestions');

// Route to fetch all code questions
router.get('/', async (req, res) => {
    try {
        //call the controller
        const questions = await getCodeQuestions(); 
        res.status(200).json({ message: "Code questions fetched successfully", questions });
    } catch (error) {
        console.error("Error in route:", error);
        res.status(error.status || 500).json({ message: error.message || "Internal Server Error" });
    }
});

module.exports = router;