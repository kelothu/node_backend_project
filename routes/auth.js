const express = require('express');
const AuthController = require('../controllers/authController');
const isAdmin = require('../middleware/adminMiddleware'); // Uses the custom admin middleware we built

const router = express.Router();

// Admin login route
router.post('/login', AuthController.loginAdmin);

// Admin logout route
router.post('/logout', AuthController.logoutAdmin);

// Admin Account Details (Needs Admin Token)
router.get('/me', isAdmin, AuthController.accessTokenDetails);

// Admin Change password (Needs Admin Token)
router.post('/change-password', isAdmin, AuthController.changePassword);

// Refreshes the Admin Token securely
router.post('/refresh-token', AuthController.refreshAdminToken);

// Admin create new user route (Super admin can create admin)
// Optionally we could add `isAdmin` around this to ensure only admins make admins
router.post('/create', AuthController.createAdmin);

module.exports = router;
