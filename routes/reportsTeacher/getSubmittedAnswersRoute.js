const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getSubmittedAnswersController} = require('../../controllers/reportsTeacher/getSubmittedAnswersController'); 


router.get('/', getSubmittedAnswersController); 
module.exports = router; 