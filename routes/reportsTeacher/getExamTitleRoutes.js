const express = require('express');
const router = express.Router({ mergeParams: true });
const {getExamTitle} = require('../../controllers/reportsTeacher/getExamTitleController');

router.get ('/', getExamTitle);
module.exports = router;