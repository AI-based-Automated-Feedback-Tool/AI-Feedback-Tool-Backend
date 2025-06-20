const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getEssayQuestionDetails} = require('../../controllers/reportsTeacher/getEssayQuestionsController'); 


router.get('/', getEssayQuestionDetails); 
module.exports = router; 