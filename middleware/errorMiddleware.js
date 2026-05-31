const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = undefined;

  // 1. Specific handling for Sequelize Errors
  if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
    statusCode = 400;
    errors = err.errors.map(e => ({
        field: e.path,
        message: e.message
    }));
    message = 'Validation Error';
  }

  // 2. Specific handling for JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  // 3. Specific handling for Multer (File Upload) Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File is too large. Max limit is 2MB.';
  }

  // Log the error using winston
  logger.error(`${req.method} ${req.url} - ${statusCode} - ${message} ${err.stack && process.env.NODE_ENV === 'development' ? '\n' + err.stack : ''}`);

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
