import request from 'supertest';
import app from '../app';

describe('API Integration Tests', () => {
  let token;
  let transactionId;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    token = loginRes.body.token;
  });

  test('GET /transaction should return user transactions', async () => {
    const res = await request(app)
      .get('/transaction')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /transaction should create new transaction', async () => {
    const res = await request(app)
      .post('/transaction')
      .set('Authorization', `Bearer ${token}`)
      .send({
        amount: 50,
        description: 'Test Transaction',
        date: new Date(),
        category_id: 'categoryId'
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Success');
  });
}); 