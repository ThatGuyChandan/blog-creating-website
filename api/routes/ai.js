const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { InferenceClient } = require('@huggingface/inference');

const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;
const client = new InferenceClient(HF_TOKEN);
const aiRateLimit = {};

router.post('/suggest-summary', aiController.suggestSummary(client, aiRateLimit));
router.post('/suggest-title', aiController.suggestTitle(client, aiRateLimit));

module.exports = router; 