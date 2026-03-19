const { verifyUserAccessToken } = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  try {
    // Check cookies first (most secure for web/mobile browsers)
    let token = req.cookies?.user_token;

    // Fallback to headers (for programmatic API requests)
    if (!token && req.headers.authorization) {
      if (req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    // Verify token using new securely configured JWT utility
    const decodedToken = verifyUserAccessToken(token);

    // Attach user information to request
    req.userId = decodedToken.id;
    req.userRole = decodedToken.role;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authMiddleware;
