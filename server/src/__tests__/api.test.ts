import request from 'supertest';
import express from 'express';
import { apiRouter } from '../api/routes';

// Mock services
jest.mock('../ai/aiService');
jest.mock('../puzzle/puzzleService');
jest.mock('../auth/userService');

const app = express();
app.use(express.json());
app.use('/api', apiRouter);

// Add health check like in main app
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

describe('API Routes', () => {
  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/admin/login', () => {
    test('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({ password: 'wrong_password' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    test('should accept valid password', async () => {
      process.env.ADMIN_PASSWORD = 'test123';
      
      const response = await request(app)
        .post('/api/admin/login')
        .send({ password: 'test123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    test('should require password field', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({});
      
      expect(response.status).toBe(401);
    });
  });
});
