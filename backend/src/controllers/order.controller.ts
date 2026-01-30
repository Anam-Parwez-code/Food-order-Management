import { Request, Response } from 'express';
import { orders, menu, Order } from '../models/order.model';
const { nanoid }= require( 'nanoid');

// 1. Get Menu
export const getMenu = (req: Request, res: Response) => {
  res.status(200).json(menu);
};

// 2. Place Order & Simulate Status Updates
export const placeOrder = (req: Request, res: Response) => {
  const { customer, items, total } = req.body;

  // Input Validation (Sr. Dev Requirement)
  if (!customer?.name || !customer?.address || !customer?.phone || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data. Check customer details and cart." });
  }

  const newOrder: Order = {
    id: nanoid(10),
    customer,
    items,
    total,
    status: 'Order Received',
    createdAt: new Date()
  };

  orders.push(newOrder);

  // Real-time Status Simulation (Requirement #7)
  // 10 second baad 'Preparing', 20 second baad 'Out for Delivery'
  setTimeout(() => {
    const order = orders.find(o => o.id === newOrder.id);
    if (order) order.status = 'Preparing';
  }, 10000);

  setTimeout(() => {
    const order = orders.find(o => o.id === newOrder.id);
    if (order) order.status = 'Out for Delivery';
  }, 20000);

  res.status(201).json(newOrder);
};

// 3. Get Order Status
export const getOrderStatus = (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.status(200).json(order);
};