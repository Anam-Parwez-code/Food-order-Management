import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Package, MapPin, Phone, User, CheckCircle } from 'lucide-react';

// Interfaces for Type Safety [cite: 9, 21]
interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem {
  item: FoodItem;
  quantity: number;
}

const App = () => {
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '' });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  // 1. Fetch Menu [cite: 7, 19]
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/menu');
        setMenu(res.data);
      } catch (err) {
        console.error("Error fetching menu", err);
      }
    };
    fetchMenu();
  }, []);

  // 2. Poll for Status Updates (Real-time Simulation) 
 // Poll for Status Updates (Real-time Simulation) [cite: 17, 30]
useEffect(() => {
  let interval: any; // NodeJS.Timeout ki jagah 'any' use karein taaki error na aaye
  
  if (orderId && status !== 'Out for Delivery') {
    interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
        setStatus(res.data.status); // Requirement: Real-time updates [cite: 15, 17]
      } catch (err) {
        console.error("Error polling status", err);
      }
    }, 5000); // Har 5 second baad status check hoga [cite: 30]
  }
  
  return () => clearInterval(interval); // Cleanup to prevent memory leaks
}, [orderId, status]);
  // Add to Cart Logic [cite: 11, 12]
  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  // 3. Place Order [cite: 13, 27]
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      const payload = {
        customer,
        items: cart,
        total: cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0)
      };
      const res = await axios.post('http://localhost:3001/api/orders', payload);
      setOrderId(res.data.id);
      setStatus(res.data.status);
      setCart([]); // Clear cart after success
    } catch (err) {
      alert("Order failed. Please check your details.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-orange-600">RaftFoods</h1>
        <div className="relative">
          <ShoppingCart className="w-8 h-8 text-gray-700" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
            {cart.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Menu Section [cite: 8] */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="text-orange-500" /> Our Menu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <span className="text-orange-600 font-bold">${item.price}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{item.description}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout & Status Section [cite: 13, 15] */}
        <div className="space-y-6">
          {orderId ? (
            <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-100">
              <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <CheckCircle /> Order Placed!
              </h2>
              <p className="text-sm text-gray-500 mb-2">Order ID: <span className="font-mono font-bold text-gray-800">{orderId}</span></p>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-orange-800 font-medium">Current Status:</p>
                <p className="text-2xl font-black text-orange-600 animate-pulse uppercase">{status}</p>
              </div>
              <button onClick={() => setOrderId(null)} className="mt-6 text-orange-500 text-sm font-semibold underline">Place another order</button>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-bold mb-6">Checkout</h2>
              
              {/* Cart Summary [cite: 12] */}
              <div className="mb-6 space-y-3">
                {cart.map(c => (
                  <div key={c.item.id} className="flex justify-between text-sm">
                    <span>{c.item.name} x {c.quantity}</span>
                    <span className="font-bold">${(c.item.price * c.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">
                    ${cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Form [cite: 13] */}
              <form onSubmit={handleCheckout} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    required 
                    placeholder="Full Name" 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    value={customer.name}
                    onChange={e => setCustomer({...customer, name: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    required 
                    placeholder="Delivery Address" 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    value={customer.address}
                    onChange={e => setCustomer({...customer, address: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input 
                    required 
                    type="tel"
                    placeholder="Phone Number" 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    value={customer.phone}
                    onChange={e => setCustomer({...customer, phone: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={cart.length === 0}
                  className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 disabled:bg-gray-300 transition"
                >
                  Place Order
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;