const productService = require('../services/productService');
const bulkService = require('../services/bulkService');
const pdfService = require('../services/pdfService');
const logger = require('../config/logger');
const fs = require('fs');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllProducts = async (req, res, next) => {
  try {
    const data = await productService.getAllProducts(req.query);
    return successResponse(res, 200, 'Products fetched successfully', data);
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

const exportProducts = async (req, res, next) => {
  try {
    const csvData = await bulkService.exportProductsToCSV();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    return res.status(200).send(csvData);
  } catch (error) {
    logger.error(`Export failed: ${error.message}`);
    next(error);
  }
};

const importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'No CSV file uploaded. Please ensure you are using the field name "file" and sending the request as multipart/form-data.');
    }

    const summary = await bulkService.importProductsFromCSV(req.file.path);
    
    // Clean up file
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return successResponse(res, 200, 'Products imported successfully', summary);
  } catch (error) {
    logger.error(`Import failed: ${error.message}`);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};

const exportProductsPDF = async (req, res, next) => {
  try {
    const pdfBuffer = await pdfService.generateProductInventoryPDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.pdf');
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    logger.error(`PDF Export failed: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
  importProducts,
  exportProductsPDF
};
