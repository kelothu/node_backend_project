const express = require('express');
const AuthController = require('../controllers/authController');
const isAdmin = require('../middleware/adminMiddleware'); // Uses the custom admin middleware we built

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
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
router.post('/login', AuthController.loginAdmin);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', AuthController.logoutAdmin);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current admin details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin details fetched
 */
router.get('/me', isAdmin, AuthController.accessTokenDetails);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh admin access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh-token', AuthController.refreshAdminToken);

/**
 * @swagger
 * /api/auth/create:
 *   post:
 *     summary: Create a new admin
 *     tags: [Auth]
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
 *         description: Admin created successfully
 */
router.post('/create', AuthController.createAdmin);

module.exports = router;
