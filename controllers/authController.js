const { Op } = require('sequelize');
const authService = require('../services/authService');
const { RefreshToken } = require('../models/index');
const logger = require('../config/logger');
const { generateAdminAccessToken, generateAdminRefreshToken, verifyAdminRefreshToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { admin, token, refreshToken } = await authService.loginAdmin(email, password);

    res.cookie('admin_token', token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 15 * 60 * 1000, path: '/',
    });
    res.cookie('admin_refresh_token', refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, path: '/',
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await RefreshToken.create({ token: refreshToken, type: 'admin', userId: admin.id, expiresAt });

    logger.info(`Admin ${email} logged in successfully`);
    return successResponse(res, 200, `Admin logged in successfully`, { admin, token, refreshToken });
  } catch (err) {
    logger.error(`Admin Login failed for ${email}: ${err.message}`);
    next(err);
  }
};

const refreshAdminToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.admin_refresh_token || req.body?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    const decoded = verifyAdminRefreshToken(refreshToken);
    const tokenRecord = await RefreshToken.findOne({
      where: { token: refreshToken, userId: decoded.id, type: 'admin', expiresAt: { [Op.gt]: new Date() } },
    });

    if (!tokenRecord) return res.status(403).json({ message: 'Invalid or expired admin refresh token' });

    await tokenRecord.destroy();
    const newAccessToken = generateAdminAccessToken({ id: decoded.id, role: decoded.role });
    const newRefreshToken = generateAdminRefreshToken({ id: decoded.id }, false);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({ token: newRefreshToken, type: 'admin', userId: decoded.id, expiresAt });

    res.cookie('admin_token', newAccessToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 15 * 60 * 1000,
    });
    res.cookie('admin_refresh_token', newRefreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    logger.info(`Admin Token refreshed successfully for ID ${decoded.id}`);
    return successResponse(res, 200, 'Admin Token Refreshed Successfully', { token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    logger.error(`Admin Token refresh failed: ${err.message}`);
    next(err);
  }
};

const logoutAdmin = async (req, res, next) => {
  try {
    res.cookie('admin_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0), path: '/', sameSite: 'lax' });
    res.cookie('admin_refresh_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', expires: new Date(0), path: '/', sameSite: 'lax' });

    const refreshToken = req.cookies?.admin_refresh_token || req.body?.refreshToken;
    if (refreshToken) await RefreshToken.destroy({ where: { token: refreshToken } });

    logger.info(`Admin logged out successfully`);
    return successResponse(res, 200, 'Admin Logged out successfully');
  } catch (err) {
    logger.error(`Admin Logout failed: ${err.message}`);
    next(err);
  }
};

const accessTokenDetails = async (req, res, next) => {
  try {
    const admin = await authService.getAdminDetails(req.adminId);
    return successResponse(res, 200, 'Admin Profile Fetched', admin);
  } catch (error) {
    logger.error(`Failed to get admin profile: ${error.message}`);
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  try {
    await authService.changePassword(req.adminId, oldPassword, newPassword);
    return successResponse(res, 200, 'Admin Password Changed Successfully');
  } catch (error) {
    logger.error(`Admin failed to change password: ${error.message}`);
    next(error);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const newAdmin = await authService.createAdmin(req.body);
    return successResponse(res, 201, 'New Admin Account Created Successfully', newAdmin);
  } catch (error) {
    logger.error(`Failed to create admin account: ${error.message}`);
    next(error);
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  accessTokenDetails,
  changePassword,
  refreshAdminToken,
  createAdmin
};
