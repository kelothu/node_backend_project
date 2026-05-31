const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/apiResponse');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Extract the first error message or join them all
        const messages = errors.array().map(err => err.msg).join(', ');
        return errorResponse(res, 400, `Validation failed: ${messages}`, errors.array());
    }
    next();
};

module.exports = validate;
