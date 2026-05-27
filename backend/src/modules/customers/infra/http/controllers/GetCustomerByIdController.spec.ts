import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../../../../shared/infra/http/app';
import { prisma } from '../../../../../shared/infra/database/prisma/client';

describe('GetCustomerByIdController', () => {
  let token: string;
  let customerId: number;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test_secret';
    token = jwt.sign({ role: 'admin' }, 'test_secret', { expiresIn: '1d' });

    const createdCustomer = await prisma.customer.create({
      data: {
        first_name: 'Integration',
        last_name: 'Test ID',
        email: 'idtest@example.com',
        city: 'ID City',
      },
    });

    customerId = createdCustomer.id;
  });

  afterAll(async () => {
    await prisma.customer.delete({
      where: { id: customerId },
    });
    await prisma.$disconnect();
    delete process.env.JWT_SECRET;
  });

  it('should be able to get a customer by id via API', async () => {
    const response = await request(app)
      .get(`/customers/${customerId}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(customerId);
    expect(response.body.email).toBe('idtest@example.com');
  });

  it('should return 404 for a non-existing customer via API', async () => {
    const response = await request(app)
      .get('/customers/999999')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Customer not found');
  });

  it('should return 400 if id is not a number', async () => {
    const response = await request(app)
      .get('/customers/invalid-id')
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid ID format');
  });
});