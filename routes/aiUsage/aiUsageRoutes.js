const express = require('express');
const router = express.Router();
const {supabaseAuth} = require('../../middleware/supabaseAuth');
const { getAICallUsage } = require('../../controllers/aiUsage/aiUsageController');

router.get('/', supabaseAuth, getAICallUsage);

module.exports = router;