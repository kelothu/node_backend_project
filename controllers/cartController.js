const cartService = require('../services/cartService');
const logger = require('../config/logger');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.userId);
    return successResponse(res, 200, 'Cart items fetched successfully', cart);
  } catch (error) {
    logger.error(`Failed to get cart for user ${req.userId}: ${error.message}`);
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  const productId = req.body.product_id || req.body.productId;
  const { quantity } = req.body;
  try {
    if (!productId) {
      return errorResponse(res, 400, 'Product ID is required');
    }
    const cartItem = await cartService.addToCart(req.userId, productId, quantity);
    return successResponse(res, 201, 'Item added to cart successfully', cartItem);
  } catch (error) {
    logger.error(`Failed to add item to cart for user ${req.userId}: ${error.message}`);
    next(error);
  }
};

const updateCartItemQuantity = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  try {
    const cartItem = await cartService.updateCartItemQuantity(req.userId, productId, quantity);
    return successResponse(res, 200, 'Cart quantity updated', cartItem);
  } catch (error) {
    logger.error(`Failed to update cart quantity for user ${req.userId}: ${error.message}`);
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  try {
    await cartService.removeFromCart(req.userId, productId);
    return successResponse(res, 200, 'Item removed from cart');
  } catch (error) {
    logger.error(`Failed to remove item from cart for user ${req.userId}: ${error.message}`);
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.userId);
    return successResponse(res, 200, 'Cart cleared successfully');
  } catch (error) {
    logger.error(`Failed to clear cart for user ${req.userId}: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};
