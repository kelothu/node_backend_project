const User = require('../models/User.js');

/**
 * Role-based authorization middleware.
 * Must be used AFTER authMiddleware (requires req.userId).
 * Usage: authorize('admin') or authorize('admin', 'customer')
 */
const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }

            req.userRole = user.role;
            next();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Authorization failed' });
        }
    };
};

module.exports = authorize;
