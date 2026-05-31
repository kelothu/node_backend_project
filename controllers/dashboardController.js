const dashboardService = require('../services/dashboardService');
const logger = require('../config/logger');
const { successResponse } = require('../utils/apiResponse');

const getOverview = async (req, res, next) => {
  try {
    const stats = await dashboardService.getOverviewStats();
    return successResponse(res, 200, 'Dashboard statistics fetched successfully', stats);
  } catch (error) {
    logger.error(`Failed to get dashboard overview: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getOverview
};
