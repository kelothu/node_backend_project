const express = require('express');
const ReviewController = require('../controllers/reviewController.js');
const isAuthenticated = require('../middleware/auth.js');
const authorize = require('../middleware/role.js');
const validate = require('../middleware/validate.js');
const { createReviewRules, updateReviewRules } = require('../validations/reviewValidation.js');

const router = express.Router();

/**
 * @route   GET /api/reviews
 * @desc    Get all reviews
 * @access  Public
 */
router.get('/', ReviewController.getAllReviews);

/**
 * @route   GET /api/reviews/:id
 * @desc    Get review by ID
 * @access  Public
 */
router.get('/:id', ReviewController.getReviewById);

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private (User)
 */
router.post('/', isAuthenticated, createReviewRules, validate, ReviewController.createReview);

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update an existing review
 * @access  Private (User)
 */
router.put('/:id', isAuthenticated, updateReviewRules, validate, ReviewController.updateReview);

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private (Admin)
 */
router.delete('/:id', isAuthenticated, authorize('admin'), ReviewController.deleteReview);

module.exports = router;
