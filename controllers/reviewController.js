const reviewService = require('../services/reviewService');
const logger = require('../config/logger');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getAllReviews();
    return successResponse(res, 200, 'Reviews fetched successfully', reviews);
  } catch (error) {
    logger.error(`Failed to get all reviews: ${error.message}`);
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    return successResponse(res, 200, 'Review fetched successfully', review);
  } catch (error) {
    logger.error(`Failed to get review ${req.params.id}: ${error.message}`);
    if (error.message === 'Review not found') {
      return errorResponse(res, 404, 'Review not found');
    }
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    // Pass req.userId to the service
    const review = await reviewService.createReview(req.body, req.userId);
    logger.info(`Review created successfully`);
    return successResponse(res, 201, 'Review created successfully', review);
  } catch (error) {
    logger.error(`Failed to create review: ${error.message}`);
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    await reviewService.updateReview(req.params.id, req.body);
    logger.info(`Review ${req.params.id} updated successfully`);
    return successResponse(res, 200, 'Review updated successfully');
  } catch (error) {
    logger.error(`Failed to update review ${req.params.id}: ${error.message}`);
    if (error.message === 'Review not found') {
      return errorResponse(res, 404, 'Review not found');
    }
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    logger.info(`Review ${req.params.id} deleted successfully`);
    return successResponse(res, 200, 'Review deleted successfully');
  } catch (error) {
    logger.error(`Failed to delete review ${req.params.id}: ${error.message}`);
    if (error.message === 'Review not found') {
      return errorResponse(res, 404, 'Review not found');
    }
    next(error);
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview
};
