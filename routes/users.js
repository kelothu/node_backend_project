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
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Customer login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authLimiter, loginRules, validate, UserController.loginUser);

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new customer
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 */
router.post('/register', authLimiter, registerRules, validate, UserController.registerUser);

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh customer access token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh-token', UserController.refreshUserToken);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Customer logout
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', UserController.logoutUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get customer profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', isAuthenticated, UserController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update customer profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               profile_picture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', isAuthenticated, upload.single('profile_picture'), updateProfileRules, validate, UserController.updateProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin Only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/', isAuthenticated, authorize('admin'), UserController.getAllUsers);

module.exports = router;
