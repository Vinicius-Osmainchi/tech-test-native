import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../../shared/infra/http/app';
import { prisma } from '../../../shared/infra/database/prisma/client';

describe('CreateCustomerController', () => {
  let token: string;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
    token = jwt.sign({ role: 'admin' }, 'test_secret', { expiresIn: '1d' });
  });

  afterAll(async () => {
    await prisma.customer.deleteMany();
    await prisma.$disconnect();
    delete process.env.JWT_SECRET;
  });

  it('should be able to create a new customer via API', async () => {
    const response = await request(app)
      .post('/customers')
      .send({
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@test.com',
        city: 'Test City',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('integration@test.com');
  });

  it('should return 400 when creating a customer with an existing email via API', async () => {
    const response = await request(app)
      .post('/customers')
      .send({
        firstName: 'Another',
        lastName: 'Test',
        email: 'integration@test.com',
        city: 'Test City',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Customer with this email already exists');
  });
});