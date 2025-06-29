const express = require('express'); 
const router = express.Router({ mergeParams: true }); 
const {getExamController} = require('../../controllers/examDetails/fetchExamController'); 


router.get('/', getExamController); 
module.exports = router; 