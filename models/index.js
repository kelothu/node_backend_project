const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const Review = require('./Review');
const RefreshToken = require('./RefreshToken');
const FavoriteProduct = require('./FavoriteProduct');
const CartItem = require('./CartItem');
const OrderItem = require('./OrderItem');
const OrderStatusHistory = require('./OrderStatusHistory'); // Added import
const sequelize = require( '../config/db');

// ==================== Associations ====================

// Product - Category Association (One-to-Many)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Category Self-Referential Association (Hierarchical)
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });

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

// User - CartItem Association (One-to-Many)
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cartItems' });
CartItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product - CartItem Association (One-to-Many)
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Order - OrderItem Association (One-to-Many)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product - OrderItem Association (One-to-Many)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User - RefreshToken Association (One-to-Many)
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order - OrderStatusHistory Association (One-to-Many)
Order.hasMany(OrderStatusHistory, { foreignKey: 'order_id', as: 'statusHistory' });
OrderStatusHistory.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// User - OrderStatusHistory Association (One-to-Many - Actor/Admin)
User.hasMany(OrderStatusHistory, { foreignKey: 'changed_by', as: 'actions' });
OrderStatusHistory.belongsTo(User, { foreignKey: 'changed_by', as: 'actor' });

module.exports = { User, Product, Category, Order, OrderStatusHistory, Review, RefreshToken, FavoriteProduct, CartItem, OrderItem, sequelize };
