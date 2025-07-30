const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { sendAdminNewUserEmail } = require('../utils/email');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// Register
router.post('/register', authController.register(sendAdminNewUserEmail, salt));
// Login
router.post('/login', authController.login);
// Logout
router.post('/logout', authController.logout);

module.exports = router; 