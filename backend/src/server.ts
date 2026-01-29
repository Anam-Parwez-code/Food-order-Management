import express, { Request, Response } from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();

// CORS Error Fix: Ensure cors is used before routes [cite: 19]
app.use(cors()); 
app.use(express.json());

// Interfaces for Type Safety (Sr. Dev Best Practice)
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  customer: { name: string; address: string; phone: string };
  items: any[];
  status: string;
}

// In-memory "Database" [cite: 21]
const menu: MenuItem[] = [
  { id: 1, name: 'Pizza', description: 'Cheesy Pepperoni', price: 12, image: 'https://placehold.co/400x300?text=Pizza' },
  { id: 2, name: 'Burger', description: 'Classic Beef', price: 8, image: 'https://placehold.co/400x300?text=Burger' }
];

// Order Array Fix: Yahan orders ko define karna zaruri hai [cite: 21]
let orders: Order[] = [];

// Menu Retrieval API [cite: 7, 19]
app.get('/api/menu', (req: Request, res: Response) => {
  res.json(menu);
});

// Status Update Simulation Logic [cite: 17, 30]
const updateStatusSequentially = (orderId: string) => {
  const statuses = ["Preparing", "Out for Delivery"];
  
  statuses.forEach((status, index) => {
    setTimeout(() => {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        console.log(`Order ${orderId} status updated to: ${status}`);
      }
    }, (index + 1) * 10000); // 10 seconds interval for simulation [cite: 30]
  });
};

// Order Placement API [cite: 10, 19]
app.post('/api/orders', (req: Request, res: Response) => {
  const { customer, items } = req.body;

  // Input Validation [cite: 24, 60]
  if (!customer?.name || !customer?.address || !customer?.phone) {
    return res.status(400).json({ message: "Delivery details are required" });
  }

  const newOrder: Order = {
    id: nanoid(10),
    customer,
    items,
    status: "Order Received" // Initial Status [cite: 15]
  };

  orders.push(newOrder);
  
  // Start simulation [cite: 17]
  updateStatusSequentially(newOrder.id);

  res.status(201).json(newOrder);
});

// Track Order Status API [cite: 14, 15]
app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

export { app }; // Exporting for TDD tests [cite: 23]