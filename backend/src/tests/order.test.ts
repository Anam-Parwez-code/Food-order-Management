import { describe, it, expect } from 'vitest';
import request from 'supertest';
// Maan lijiye humne app ko export kiya hai server.ts se
import { app } from '../server'; 

describe('Order Management API', () => {
  // Test Case: Order placement successful hona chahiye
  it('should place an order successfully', async () => {
    const orderData = {
      customer: { name: 'Ali', address: '123 Street', phone: '1234567890' },
      items: [{ id: 1, quantity: 2 }],
      total: 24
    };

    const res = await request(app).post('/api/orders').send(orderData);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('Order Received'); // Requirement #3 
  });

  // Test Case: Validation check (Phone number missing)
  it('should fail if customer details are missing', async () => {
    const invalidOrder = {
      customer: { name: 'Ali', address: '123 Street' }, // Phone missing
      items: [],
      total: 0
    };

    const res = await request(app).post('/api/orders').send(invalidOrder);
    expect(res.status).toBe(400); // Bad Request [cite: 60]
  });
});