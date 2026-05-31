const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Import database, routes, and custom middlewares
const { sequelize } = require('./models/index');
const errorHandler = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const favoriteRoutes = require('./routes/favorites');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS - Invalid origin'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware setup
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Define routes
app.get("/", (req, res) => {
    return res.send("Node Backend is Running...");
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Global error handler
app.use(errorHandler);

// Database Sync and Server Start Logic
const syncDatabase = async () => {
  const syncOptions = {
    force: process.env.SHOULD_FORCE_WIPE === 'true',
    alter: process.env.SHOULD_ALTER === 'true'
  };

  if (process.env.SHOULD_SYNC === 'true') {
    try {
      await sequelize.sync(syncOptions);
      if (syncOptions.force) {
        console.warn('⚠️ WARNING: Database was FORCED WIPED. Please set SHOULD_FORCE_WIPE=false in your .env now.');
      }
      console.log('Models synced with DB');
    } catch (err) {
      console.error('DB sync failed:', err);
      process.exit(1);
    }
  }
};

const logger = require('./config/logger');

const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

syncDatabase().then(startServer).catch((err) => {
  console.error('Error during startup:', err);
});

module.exports = app;
