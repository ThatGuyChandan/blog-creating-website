const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { sendUserStatusEmail } = require('../utils/email');
const adminAuthMiddleware = require('../middleware/auth');

// List all users
router.get('/users', adminAuthMiddleware, adminController.listUsers);
// Approve user
router.post('/users/:id/approve', adminAuthMiddleware, adminController.approveUser(sendUserStatusEmail));
// Reject user
router.post('/users/:id/reject', adminAuthMiddleware, adminController.rejectUser(sendUserStatusEmail));

module.exports = router; 