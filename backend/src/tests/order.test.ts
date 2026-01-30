import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Food Order API TDD', () => {
  
  // Test 1: Menu fetch ho raha hai?
  it('should fetch the menu items correctly', async () => {
    const res = await request(app).get('/api/menu');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
  });

  // Test 2: Kya order place ho raha hai?
  it('should place a new order and return 201', async () => {
    const mockOrder = {
      customer: {
        name: "Anam Parwez",
        address: "Patna, Bihar",
        phone: "9876543210"
      },
      items: [{ item: { id: 1, name: "Pizza", price: 12 }, quantity: 1 }],
      total: 12
    };

    const res = await request(app)
      .post('/api/orders')
      .send(mockOrder);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('Order Received');
  });

  // Test 3: Kya galat data par error aa raha hai? (Validation Test)
  it('should return 400 if customer details are missing', async () => {
    const incompleteOrder = {
      items: [],
      total: 0
    };

    const res = await request(app)
      .post('/api/orders')
      .send(incompleteOrder);

    expect(res.status).toBe(400);
  });
});