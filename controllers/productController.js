const productService = require('../services/productService');
const logger = require('../config/logger');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return successResponse(res, 200, 'Products fetched successfully', products);
  } catch (error) {
    logger.error(`Failed to get all products: ${error.message}`);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return successResponse(res, 200, 'Product fetched successfully', product);
  } catch (error) {
    logger.error(`Failed to get product ${req.params.id}: ${error.message}`);
    if (error.message === 'Product not found') {
      return errorResponse(res, 404, 'Product not found');
    }
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    logger.info(`Product created successfully`);
    return successResponse(res, 201, 'Product created successfully', product);
  } catch (error) {
    logger.error(`Failed to create product: ${error.message}`);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    await productService.updateProduct(req.params.id, req.body);
    logger.info(`Product ${req.params.id} updated successfully`);
    return successResponse(res, 200, 'Product updated successfully');
  } catch (error) {
    logger.error(`Failed to update product ${req.params.id}: ${error.message}`);
    if (error.message === 'Product not found') {
      return errorResponse(res, 404, 'Product not found');
    }
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    logger.info(`Product ${req.params.id} deleted successfully`);
    return successResponse(res, 200, 'Product deleted successfully');
  } catch (error) {
    logger.error(`Failed to delete product ${req.params.id}: ${error.message}`);
    if (error.message === 'Product not found') {
      return errorResponse(res, 404, 'Product not found');
    }
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
