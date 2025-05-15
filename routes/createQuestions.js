const express = require('express'); // Importing the required modules for express
const router = express.Router(); // Creating a new router instance for handling routes
const {createQuestions} = require('../controllers/createQuestionController'); // Importing the createQuestions function from the controller

router.post('/', createQuestions); // Defining a POST route for creating questions, which calls the createQuestions function

module.exports = router; // Exporting the router instance for use in other files