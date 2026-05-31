const { successResponse } = require('../utils/apiResponse');

/**
 * Get public configuration and environment metadata.
 * Use for mobile app discovery and frontend environment checks.
 */
const getPublicConfig = async (req, res, next) => {
  try {
    const config = {
      api_name: 'Vehicle Parts API',
      api_version: process.env.API_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      base_url: process.env.APP_BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
      asset_url: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/uploads`,
      support_email: 'support@example.com',
      features: {
        registration_enabled: true,
        guest_checkout: true
      }
    };

    return successResponse(res, 200, 'Public configuration fetched successfully', config);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicConfig
};
