require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Parts API',
      version: '1.0.0',
      description: 'A production-grade REST API for Vehicle Parts & Inventory Management',
      contact: {
        name: 'Engineering Team',
      },
    },
    servers: [
      {
        url: process.env.APP_BASE_URL || 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Scan both routes and controllers for JSDoc
};

const specs = swaggerJsDoc(options);
module.exports = specs;
