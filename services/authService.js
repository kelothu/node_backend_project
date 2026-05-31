const { User } = require('../models/index.js');
const bcrypt = require('bcryptjs'); 
const { generateAdminAccessToken, generateAdminRefreshToken } = require('../utils/jwtUtils');

const createAdmin = async (adminData) => {
  const hashedPassword = await bcrypt.hash(adminData.password, 10);
  const admin = await User.create({
    name: adminData.name,
    email: adminData.email,
    phone: adminData.phone || null,
    password: hashedPassword,
    role: adminData.role || 'admin',
    status: 'active'
  });

  return admin;
};

const loginAdmin = async (email, password) => {
  const admin = await User.findOne({ where: { email } });
  
  if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
    throw new Error('Invalid Admin Credentials');
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new Error('Invalid Admin Credentials');
  }

  const token = generateAdminAccessToken(admin);
  const refreshToken = generateAdminRefreshToken(admin, false);

  return { token, refreshToken, admin };
};

const changePassword = async (adminId, oldPassword, newPassword) => {
  const admin = await User.findByPk(adminId);
  if (!admin) throw new Error('Admin not found');
  
  const isMatch = await bcrypt.compare(oldPassword, admin.password);
  if (!isMatch) throw new Error('Incorrect Old Password');

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  admin.password = hashedNewPassword;
  await admin.save();
  return admin;
};

const getAdminDetails = async (adminId) => {
  const admin = await User.findByPk(adminId, { attributes: { exclude: ['password'] } });
  if (!admin) throw new Error('Admin not found');
  return admin;
};

module.exports = {
  createAdmin,
  loginAdmin,
  changePassword,
  getAdminDetails
};
