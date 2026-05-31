/**
 * Global API Response formatters for uniform JSON bodies across all endpoints.
 */

const successResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, status, message, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    error: error ? (error.message || error) : undefined
  });
};

module.exports = {
  successResponse,
  errorResponse
};
