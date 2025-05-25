const express = require('express');
const router = express.Router({ mergeParams: true });
const { getStudentName } = require('../../controllers/reportsTeacher/getStudentNameController');

router.get('/', getStudentName);
module.exports = router;