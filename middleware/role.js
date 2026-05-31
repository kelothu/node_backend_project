const { User } = require('../models/index');

/**
 * Role-based authorization middleware.
 * Must be used AFTER authMiddleware (requires req.userId).
 * Usage: authorize('admin') or authorize('admin', 'customer')
 */
const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            // Priority 1: Use role already verified and attached by authMiddleware
            let currentRole = req.userRole;

            // Priority 2: Fallback to DB lookup if role is missing from request
            if (!currentRole && req.userId) {
                const user = await User.findByPk(req.userId);
                if (user) {
                    currentRole = user.role;
                }
            }

            if (!currentRole) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            // Standardize to lowercase for robust comparison
            const normalizedRole = currentRole.toLowerCase();
            const normalizedAllowedRoles = roles.map(r => r.toLowerCase());

            if (!normalizedAllowedRoles.includes(normalizedRole)) {
                return res.status(403).json({ 
                    success: false,
                    message: `Access denied. Requied role: [${roles.join(', ')}], Your role: [${currentRole}]` 
                });
            }

            req.userRole = currentRole;
            next();
        } catch (error) {
            console.error('Authorization Error:', error);
            return res.status(500).json({ message: 'Authorization processing failed' });
        }
    };
};

module.exports = authorize;
