const express = require('express'); 
const router = express.Router(); 
const {saveCourse} = require('../../controllers/registerCourse/registerCourseController'); 

router.post('/', saveCourse); 
module.exports = router; 