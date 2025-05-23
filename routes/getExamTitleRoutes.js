const express = require('express');
const router = express.Router({ mergeParams: true });
const {getExamTitle} = require('../controllers/getExamTitleController');

router.get ('/', getExamTitle);
module.exports = router;