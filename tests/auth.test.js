const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models/index');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Sync DB before tests
    await sequelize.sync({ force: false });
  });

  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      // Cleanup if user exists
      await User.destroy({ where: { email: 'testuser@example.com' } });

      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          phone: '1234567890',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('testuser@example.com');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
  });
});
