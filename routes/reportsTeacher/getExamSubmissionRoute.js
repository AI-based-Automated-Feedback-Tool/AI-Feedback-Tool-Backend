const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getExamSubmissionController} = require('../../controllers/reportsTeacher/getExamSubmissionController'); 


router.get('/', getExamSubmissionController); 
module.exports = router; 