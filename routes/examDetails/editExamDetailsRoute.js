const express = require('express'); 
const router = express.Router()
const {editExamDetailsController} = require('../../controllers/examDetails/editExamDetailsController'); 


router.put('/', editExamDetailsController);
module.exports = router; 