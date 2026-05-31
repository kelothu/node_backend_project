const express = require('express');
const ReviewController = require('../controllers/reviewController.js');
const isAuthenticated = require('../middleware/auth.js');
const authorize = require('../middleware/role.js');
const validate = require('../middleware/validate.js');
const { createReviewRules, updateReviewRules } = require('../validations/reviewValidation.js');

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Reviews list fetched
 */
router.get('/', ReviewController.getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review fetched
 */
router.get('/:id', ReviewController.getReviewById);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */
router.post('/', isAuthenticated, createReviewRules, validate, ReviewController.createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update an existing review (Author Only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put('/:id', isAuthenticated, updateReviewRules, validate, ReviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (Admin Only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete('/:id', isAuthenticated, authorize('admin'), ReviewController.deleteReview);

module.exports = router;
