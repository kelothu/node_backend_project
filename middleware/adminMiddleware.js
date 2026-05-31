const { verifyAdminAccessToken } = require('../utils/jwtUtils');

const adminMiddleware = (req, res, next) => {
  try {
    let token = req.cookies?.admin_token;

    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No admin token provided' });
    }

    const decodedToken = verifyAdminAccessToken(token);

    // Allow only if they have an admin role
    if (decodedToken.role !== 'admin' && decodedToken.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }

    req.adminId = decodedToken.id;
    req.adminRole = decodedToken.role;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired admin token' });
  }
};

module.exports = adminMiddleware;
