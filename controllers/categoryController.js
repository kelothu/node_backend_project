const categoryService = require('../services/categoryService');
const logger = require('../config/logger');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories();
    return successResponse(res, 200, 'Categories fetched successfully', categories);
  } catch (error) {
    logger.error(`Failed to get all categories: ${error.message}`);
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    return successResponse(res, 200, 'Category fetched successfully', category);
  } catch (error) {
    logger.error(`Failed to get category ${req.params.id}: ${error.message}`);
    if (error.message === 'Category not found') {
      return errorResponse(res, 404, 'Category not found');
    }
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    logger.info(`Category created successfully`);
    return successResponse(res, 201, 'Category created successfully', category);
  } catch (error) {
    logger.error(`Failed to create category: ${error.message}`);
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    await categoryService.updateCategory(req.params.id, req.body);
    logger.info(`Category ${req.params.id} updated successfully`);
    return successResponse(res, 200, 'Category updated successfully');
  } catch (error) {
    logger.error(`Failed to update category ${req.params.id}: ${error.message}`);
    if (error.message === 'Category not found') {
      return errorResponse(res, 404, 'Category not found');
    }
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    logger.info(`Category ${req.params.id} deleted successfully`);
    return successResponse(res, 200, 'Category deleted successfully');
  } catch (error) {
    logger.error(`Failed to delete category ${req.params.id}: ${error.message}`);
    if (error.message === 'Category not found') {
      return errorResponse(res, 404, 'Category not found');
    }
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
