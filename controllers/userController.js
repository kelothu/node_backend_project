const { User, RefreshToken } = require('../models/index');
const userService = require('../services/userService');
const logger = require('../config/logger');
const { generateUserAccessToken, generateUserRefreshToken, verifyUserRefreshToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const registerUser = async (req, res, next) => {
  const { name, email, phone, mobile, password, role = 'customer' } = req.body;
  const targetPhone = phone || mobile;
  try {
    const result = await userService.registerUser(name, email, targetPhone, password, role);

    res.cookie('user_token', result.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, path: '/',
    });
    res.cookie('user_refresh_token', result.refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000, path: '/',
    });

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: result.refreshToken, type: 'user', userId: result.user.id, expiresAt });

    logger.info(`User ${email} registered successfully`);
    return successResponse(res, 201, `User ${name} registered successfully`, { user: result.user, token: result.token, refreshToken: result.refreshToken });
  } catch (err) {
    logger.error(`Error registering user: ${err.message}`);
    next(err); // Catch by global middleware for detailed messages
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await userService.loginUser(email, password);

    res.cookie('user_token', result.token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000, path: '/',
    });
    res.cookie('user_refresh_token', result.refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000, path: '/',
    });

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: result.refreshToken, type: 'user', userId: result.user.id, expiresAt });

    logger.info(`User ${email} logged in successfully`);
    return successResponse(res, 200, `User ${email} logged in successfully`, { user: result.user, token: result.token, refreshToken: result.refreshToken });
  } catch (err) {
    logger.error(`Login failed for user ${email}: ${err.message}`);
    next(err);
  }
};

const refreshUserToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.user_refresh_token || req.body?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    const decoded = verifyUserRefreshToken(refreshToken);
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken, userId: decoded.id, type: 'user', expiresAt: { [Op.gt]: new Date() } },
    });

    if (!tokenRecord) return res.status(403).json({ message: 'Invalid or expired refresh token' });

    await tokenRecord.destroy();
    const newAccessToken = generateUserAccessToken({ id: decoded.id, role: decoded.role });
    const newRefreshToken = generateUserRefreshToken({ id: decoded.id }, false);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({ token: newRefreshToken, type: 'user', userId: decoded.id, expiresAt });

    res.cookie('user_token', newAccessToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('user_refresh_token', newRefreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    logger.info(`Token refreshed successfully for user ID ${decoded.id}`);
    return successResponse(res, 200, 'Refreshed Token Successfully', { token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    logger.error(`Token refresh failed: ${err.message}`);
    return errorResponse(res, 401, 'Unauthorized', err.message);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.cookie('user_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0), path: '/', sameSite: 'lax' });
    res.cookie('user_refresh_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0), path: '/', sameSite: 'lax' });

    const refreshToken = req.cookies?.user_refresh_token || req.body?.refreshToken;
    if (refreshToken) await RefreshToken.destroy({ where: { token: refreshToken } });

    logger.info(`User logged out successfully`);
    return successResponse(res, 200, 'Logged out successfully');
  } catch (err) {
    logger.error(`Logout failed: ${err.message}`);
    return errorResponse(res, 500, 'Logout failed', err.message);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.userId);
    return successResponse(res, 200, 'User Fetched Successfully', user);
  } catch (error) {
    logger.error(`Failed to get user profile: ${error.message}`);
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    // If an image was uploaded via Multer, capture the path
    if (req.file) {
      req.body.profile_picture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await userService.updateUserProfile(req.userId, req.body);
    return successResponse(res, 200, 'User Profile Updated Successfully', updatedUser);
  } catch (error) {
    logger.error(`Failed to update user profile: ${error.message}`);
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    logger.error(`Failed to get all users: ${error.message}`);
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  getProfile,
  updateProfile,
  getAllUsers
};
