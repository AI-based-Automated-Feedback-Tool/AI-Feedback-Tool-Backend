const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getMcqQuestionsController} = require('../../controllers/reportsTeacher/getMcqQuestionsController'); 


router.get('/', getMcqQuestionsController); 
module.exports = router; 