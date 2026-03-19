const { body } = require('express-validator');
const { User } = require('../models');

const registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        throw new Error('Email is already in use');
      }
      return true;
    }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // Standardize both 'phone' and 'mobile' check
  body('phone').custom(async (value, { req }) => {
    const phoneNumber = value || req.body.mobile;
    if (!phoneNumber) return true;
    
    const user = await User.findOne({ where: { phone: phoneNumber } });
    if (user) {
      throw new Error('Phone/Mobile number is already in use');
    }
    return true;
  }),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileRules = [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
    .custom(async (value, { req }) => {
      if (!value) return true;
      const user = await User.findOne({ where: { email: value } });
      if (user && user.id !== req.userId) {
        throw new Error('Email is already in use');
      }
      return true;
    }),
  body('phone').custom(async (value, { req }) => {
    const phoneNumber = value || req.body.mobile;
    if (!phoneNumber) return true;
    
    const user = await User.findOne({ where: { phone: phoneNumber } });
    if (user && user.id !== req.userId) {
      throw new Error('Phone/Mobile number is already in use');
    }
    return true;
  }),
];

module.exports = {
  registerRules,
  loginRules,
  updateProfileRules
};
