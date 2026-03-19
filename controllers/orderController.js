const orderService = require('../services/orderService');
const logger = require('../config/logger');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    return successResponse(res, 200, 'Orders fetched successfully', orders);
  } catch (error) {
    logger.error(`Failed to get all orders: ${error.message}`);
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    return successResponse(res, 200, 'Order fetched successfully', order);
  } catch (error) {
    logger.error(`Failed to get order ${req.params.id}: ${error.message}`);
    if (error.message === 'Order not found') {
      return errorResponse(res, 404, 'Order not found');
    }
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body, req.userId);
    logger.info(`Order created successfully`);
    return successResponse(res, 201, 'Order created successfully', order);
  } catch (error) {
    logger.error(`Failed to create order: ${error.message}`);
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    await orderService.updateOrder(req.params.id, req.body);
    logger.info(`Order ${req.params.id} updated successfully`);
    return successResponse(res, 200, 'Order updated successfully');
  } catch (error) {
    logger.error(`Failed to update order ${req.params.id}: ${error.message}`);
    if (error.message === 'Order not found') {
      return errorResponse(res, 404, 'Order not found');
    }
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    await orderService.deleteOrder(req.params.id);
    logger.info(`Order ${req.params.id} deleted successfully`);
    return successResponse(res, 200, 'Order deleted successfully');
  } catch (error) {
    logger.error(`Failed to delete order ${req.params.id}: ${error.message}`);
    if (error.message === 'Order not found') {
      return errorResponse(res, 404, 'Order not found');
    }
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
