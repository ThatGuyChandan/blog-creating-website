const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Update profile
router.put('/', profileController.updateProfile);
// Confirm password
router.post('/', profileController.confirmPassword);
// Get current user profile
router.get('/', profileController.getProfile);

module.exports = router; 