export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  items: any[];
  total: number;
  status: 'Order Received' | 'Preparing' | 'Out for Delivery';
  createdAt: Date;
}

// Initial Mock Data
export const menu: MenuItem[] = [
  { id: 1, name: 'Margherita Pizza', description: 'Classic cheese and tomato', price: 12, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500' },
  { id: 2, name: 'Beef Burger', description: 'Juicy patty with cheddar', price: 10, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
  { id: 3, name: 'Pasta Carbonara', description: 'Creamy sauce with bacon', price: 15, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500' }
];

export let orders: Order[] = []; // Ye hamari temporary database hai