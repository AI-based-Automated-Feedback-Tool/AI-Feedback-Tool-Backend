const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getCodeQuestionDetails} = require('../../controllers/reportsTeacher/getCodeQuestionsController'); 


router.get('/', getCodeQuestionDetails); 
module.exports = router; 