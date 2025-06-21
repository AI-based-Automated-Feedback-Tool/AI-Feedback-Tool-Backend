const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getStudentExamDetailsController} = require('../../controllers/reportsTeacher/getStudentExamDetailsController'); 


router.get('/', getStudentExamDetailsController); 
module.exports = router; 