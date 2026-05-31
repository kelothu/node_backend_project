const favoriteProductService = require('../services/favoriteProductService');
const logger = require('../config/logger');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const addToFavorites = async (req, res, next) => {
  try {
    const productId = req.body.product_id || req.body.productId;
    if (!productId) return errorResponse(res, 400, 'Product ID is required');

    const result = await favoriteProductService.addToFavorites(req.userId, productId);
    
    if (result.created) {
      return successResponse(res, 201, 'Product added to favorites successfully', result.favorite);
    } else {
      return successResponse(res, 200, 'Product is already in your favorites', result.favorite);
    }
  } catch (error) {
    logger.error(`Failed to add to favorites: ${error.message}`);
    next(error);
  }
};

const getAllFavorites = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const favoritesData = await favoriteProductService.getAllFavorites(req.userId, page, limit, search);
    
    return successResponse(res, 200, 'Favorites fetched successfully', favoritesData);
  } catch (error) {
    logger.error(`Failed to get favorites: ${error.message}`);
    next(error);
  }
};

const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await favoriteProductService.removeFromFavorites(req.userId, productId);
    
    return successResponse(res, 200, 'Product removed from favorites successfully');
  } catch (error) {
    logger.error(`Failed to remove from favorites: ${error.message}`);
    if (error.message === 'Product is not in your favorites') {
      return errorResponse(res, 404, error.message);
    }
    next(error);
  }
};

const checkIsFavorite = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const isFavorite = await favoriteProductService.checkIsFavorite(req.userId, productId);
    
    return successResponse(res, 200, 'Checked favorite status successfully', { isFavorite });
  } catch (error) {
    logger.error(`Failed to check favorite status: ${error.message}`);
    next(error);
  }
};

const getFavoriteCount = async (req, res, next) => {
  try {
    const count = await favoriteProductService.getFavoriteCount(req.userId);
    return successResponse(res, 200, 'Favorite count fetched successfully', { count });
  } catch (error) {
    logger.error(`Failed to get favorite count: ${error.message}`);
    next(error);
  }
};

const bulkRemoveFromFavorites = async (req, res, next) => {
  try {
    const productIds = req.body.product_ids || req.body.productIds;
    if (!productIds || !Array.isArray(productIds)) {
        return errorResponse(res, 400, 'Product IDs array is required');
    }
    const deletedCount = await favoriteProductService.bulkRemoveFromFavorites(req.userId, productIds);
    
    return successResponse(res, 200, `Successfully removed ${deletedCount} item(s) from favorites`);
  } catch (error) {
    logger.error(`Failed to bulk remove favorites: ${error.message}`);
    return errorResponse(res, 400, error.message);
  }
};

module.exports = {
  addToFavorites,
  getAllFavorites,
  removeFromFavorites,
  checkIsFavorite,
  getFavoriteCount,
  bulkRemoveFromFavorites
};
