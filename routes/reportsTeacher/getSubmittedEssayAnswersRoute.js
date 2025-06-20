const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getSubmittedEssayAnswersController} = require('../../controllers/reportsTeacher/getSubmittedEssayAnswersController'); 


router.get('/', getSubmittedEssayAnswersController); 
module.exports = router;