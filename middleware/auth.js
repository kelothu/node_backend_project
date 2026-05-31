const { verifyUserAccessToken, verifyAdminAccessToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Priority: Bearer Token in Authorization Header (Standard for APIs)
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Fallback: Check Cookies (secure for web sessions)
    if (!token) {
      token = req.cookies?.user_token || req.cookies?.admin_token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    // 2. Attempt to verify as a User first
    try {
      const decodedUser = verifyUserAccessToken(token);
      req.userId = decodedUser.id;
      req.userRole = decodedUser.role;
      return next();
    } catch (userErr) {
      // 3. If User verification fails, attempt to verify as an Admin
      try {
        const decodedAdmin = verifyAdminAccessToken(token);
        req.userId = decodedAdmin.id;
        req.userRole = decodedAdmin.role;
        return next();
      } catch (adminErr) {
        // Both failed
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
      }
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Auth processing error' });
  }
};

module.exports = authMiddleware;
