const express = require('express');
const rateLimit = require('express-rate-limit');
const UserController = require('../controllers/userController.js');
const isAuthenticated = require('../middleware/auth.js');
const authorize = require('../middleware/role.js');
const upload = require('../middleware/upload.js');
const validate = require('../middleware/validate.js');
const { registerRules, loginRules, updateProfileRules } = require('../validations/userValidation.js');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: 'Too many authentication attempts from this IP, please try again in 15 minutes.' }
});

/**
 * @route   POST /api/users/login
 * @desc    Log in a user and set cookies
 * @access  Public
 */
router.post('/login', authLimiter, loginRules, validate, UserController.loginUser);

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authLimiter, registerRules, validate, UserController.registerUser);

/**
 * @route   POST /api/users/refresh-token
 * @desc    Refresh user access token
 * @access  Public
 */
router.post('/refresh-token', UserController.refreshUserToken);

/**
 * @route   POST /api/users/logout
 * @desc    Log out a user
 * @access  Public
 */
router.post('/logout', UserController.logoutUser);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile (requires authentication)
 * @access  Private (User)
 */
router.get('/profile', isAuthenticated, UserController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile with picture support
 * @access  Private (User)
 */
router.put('/profile', isAuthenticated, upload.single('profile_picture'), updateProfileRules, validate, UserController.updateProfile);

/**
 * @route   GET /api/users/
 * @desc    Get all users list
 * @access  Private (Admin)
 */
router.get('/', isAuthenticated, authorize('admin'), UserController.getAllUsers);

module.exports = router;
