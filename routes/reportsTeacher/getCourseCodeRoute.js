const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getCourseCodeController} = require('../../controllers/reportsTeacher/getCourseCodeController'); 


router.get('/course', getCourseCodeController); 
module.exports = router; 