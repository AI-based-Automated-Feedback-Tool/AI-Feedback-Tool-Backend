const express = require('express');
const router = express.Router({ mergeParams: true });
const {getExamTitle} = require('../controllers/getExamTitleController');
const { get } = require('./getCourseCode');

router.get ('/', getExamTitle);
module.exports = router;