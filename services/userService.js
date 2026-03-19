const { User } = require('../models/index.js');
const bcrypt = require('bcryptjs'); // They used bcryptjs in their snippet/User model previously
const { generateUserAccessToken, generateUserRefreshToken } = require('../utils/jwtUtils');

const registerUser = async (name, email, phone, password, role = 'customer', status = 'active') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    phone: phone || null,
    password: hashedPassword,
    role,
    status
  });

  const token = generateUserAccessToken(user);
  const refreshToken = generateUserRefreshToken(user, false);

  return { token, refreshToken, user };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateUserAccessToken(user);
  const refreshToken = generateUserRefreshToken(user, false);

  return { token, refreshToken, user };
};

const getUserProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.name = updateData.name || user.name;
  user.email = updateData.email || user.email;
  user.phone = updateData.phone || user.phone;
  user.address = updateData.address || user.address;
  user.profile_picture = updateData.profile_picture || user.profile_picture;

  await user.save();
  return user;
};

const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  });
  return users;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers
};
