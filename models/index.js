const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const Review = require('./Review');
const RefreshToken = require('./RefreshToken');
const FavoriteProduct = require('./FavoriteProduct');
const sequelize = require( '../config/db');

// ==================== Associations ====================

// Product - Category Association (One-to-Many)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User - Order Association (One-to-Many)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product - Review Association (One-to-Many)
Product.hasMany(Review, { foreignKey: 'product_id', as: 'reviews' });
Review.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User - Review Association (One-to-Many)
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User - FavoriteProduct Association (Many-to-Many via FavoriteProduct)
User.hasMany(FavoriteProduct, { foreignKey: 'userId', as: 'favorites' });
FavoriteProduct.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Product - FavoriteProduct Association
Product.hasMany(FavoriteProduct, { foreignKey: 'productId', as: 'favoritedBy' });
FavoriteProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// User - RefreshToken Association (One-to-Many)
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports ={ User, Product, Category, Order, Review, RefreshToken, FavoriteProduct, sequelize };
