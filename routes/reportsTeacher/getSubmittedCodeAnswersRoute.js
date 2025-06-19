const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getSubmittedCodeAnswersController} = require('../../controllers/reportsTeacher/getSubmittedCodeAnswersController'); 


router.get('/', getSubmittedCodeAnswersController); 
module.exports = router; 