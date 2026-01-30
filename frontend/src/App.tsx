import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, UtensilsCrossed, Trash2, 
  CheckCircle, Clock, X, ArrowRight, Utensils, Inbox
} from 'lucide-react';

// Localhost hata kar apna backend link daal dein
const API_BASE_URL = 'https://food-order-management-eight.vercel.app';

const App = () => {
  const [menu, setMenu] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '' });
  const [orderId, setOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const checkoutSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/menu`);
        setMenu(res.data);
      } catch (err) { console.error("Menu Load Error:", err); }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (isCartOpen && cart.length > 0) {
      setTimeout(() => {
        checkoutSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [isCartOpen]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const isInCart = (id: string) => cart.some(c => c.item.id === id);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders`, {
        customer, items: cart, total: cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0)
      });
      const generatedId = res.data.id || "ORD-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setStatus(res.data.status || 'Preparing Your Meal');
      setCart([]);
      setIsCartOpen(false);
    } catch (err) { alert("Checkout Error!"); }
  };

  return (
    <div style={{ backgroundColor: '#F4F7F9', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      
      {/* NAVBAR */}
      <nav style={{ backgroundColor: '#0A192F' }} className="fixed top-0 w-full z-50 px-6 md:px-16 h-24 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-4">
          <div style={{ backgroundColor: '#E2B15B' }} className="p-3 rounded-2xl shadow-lg">
            <UtensilsCrossed style={{ color: '#0A192F' }} className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Raft<span style={{ color: '#E2B15B' }}>Foods.</span></h1>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)} 
          style={{ backgroundColor: '#E2B15B', color: '#0A192F' }} 
          className="px-8 py-4 rounded-full flex items-center gap-3 font-black shadow-lg hover:scale-105 transition-all relative"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-sm tracking-widest uppercase font-black">My Cart ({cart.length})</span>
        </button>
      </nav>

      {/* MENU GRID (Add to cart buttons are compact again) */}
      <main className="w-full px-6 md:px-16 pt-44 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {menu.map(item => (
            <div key={item.id} className="bg-white rounded-[35px] p-5 shadow-xl border border-slate-100 flex flex-col h-full transition-all hover:shadow-2xl">
              <div className="h-48 rounded-[25px] overflow-hidden relative mb-5">
                <img src={item.image} className="w-full h-full object-cover" />
                <div style={{ backgroundColor: '#0A192F', color: '#E2B15B' }} className="absolute top-3 right-3 px-3 py-1 rounded-lg font-black text-xs shadow-md">
                  ${item.price}
                </div>
              </div>
              
              <div className="flex flex-col flex-1">
                <h4 style={{ color: '#0A192F' }} className="text-lg font-black mb-1">{item.name}</h4>
                <p className="text-slate-400 text-[11px] mb-6 italic line-clamp-2">"{item.description}"</p>
                
                <div className="mt-auto">
                  {/* COMPACT BUTTON FOR MENU */}
                  <button 
                    onClick={() => addToCart(item)}
                    style={{ backgroundColor: isInCart(item.id) ? '#10B981' : '#0A192F' }}
                    className="w-full text-white py-3.5 rounded-xl font-black flex items-center justify-center gap-2 tracking-widest uppercase text-[10px] shadow-md transition-all active:scale-95"
                  >
                    {isInCart(item.id) ? (
                      <><CheckCircle className="w-4 h-4" /> Added</>
                    ) : (
                      <><Utensils className="w-4 h-4" /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* DRAWER (Wide Form and Buttons) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[#0A192F]/70 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="p-10 border-b flex justify-between items-center bg-[#FDFDFD]">
              <h2 style={{ color: '#0A192F' }} className="text-3xl font-black uppercase">Your Tray</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-4 bg-slate-100 rounded-full hover:bg-red-500 hover:text-white transition"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-8">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                  <Inbox className="w-20 h-20 mb-4" />
                  <p className="text-2xl font-black uppercase">Tray is Empty</p>
                </div>
              ) : (
                <>
                  {cart.map(c => (
                    <div key={c.item.id} className="flex gap-6 items-center bg-[#F8FAFC] p-6 rounded-[30px] border border-slate-100 shadow-sm">
                      <img src={c.item.image} className="w-24 h-24 rounded-3xl object-cover" />
                      <div className="flex-1">
                        <h5 style={{ color: '#0A192F' }} className="font-black text-xl">{c.item.name}</h5>
                        <p style={{ color: '#C6933F' }} className="font-bold text-lg">${c.item.price} × {c.quantity}</p>
                      </div>
                      <button onClick={() => setCart(cart.filter(i => i.item.id !== c.item.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-7 h-7" /></button>
                    </div>
                  ))}

                  <div ref={checkoutSectionRef} className="pt-16 mt-16 border-t-4 border-dashed border-slate-100 pb-20">
                    <h3 className="text-sm font-black mb-10 text-center text-[#0A192F] tracking-[0.5em] uppercase opacity-50">Delivery Details</h3>
                    <form onSubmit={handleCheckout} className="space-y-6">
                      <input required style={{ width: '100%', padding: '28px', fontSize: '18px', borderRadius: '22px' }} 
                      className="bg-[#F8FAFC] border-2 border-slate-200 focus:border-[#E2B15B] outline-none font-bold text-[#0A192F] shadow-inner"
                      placeholder="Your Full Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
                      
                      <input required style={{ width: '100%', padding: '28px', fontSize: '18px', borderRadius: '22px' }} 
                      className="bg-[#F8FAFC] border-2 border-slate-200 focus:border-[#E2B15B] outline-none font-bold text-[#0A192F] shadow-inner"
                      placeholder="Complete Address" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} />
                      
                      <input required style={{ width: '100%', padding: '28px', fontSize: '18px', borderRadius: '22px' }} 
                      className="bg-[#F8FAFC] border-2 border-slate-200 focus:border-[#E2B15B] outline-none font-bold text-[#0A192F] shadow-inner"
                      placeholder="Phone Number" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
                      
                      <div className="pt-10">
                        <div className="flex justify-between items-center mb-10 px-4">
                          <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Grand Total</span>
                          <span style={{ color: '#0A192F' }} className="text-6xl font-black">${cart.reduce((s, i) => s + (i.item.price * i.quantity), 0).toFixed(2)}</span>
                        </div>
                        
                        {/* WIDE FORM BUTTON */}
                        <button type="submit" 
                          style={{ width: '100%', padding: '32px', backgroundColor: '#0A192F', borderRadius: '35px' }} 
                          className="text-white font-black text-3xl flex items-center justify-center gap-5 hover:bg-[#1E293B] shadow-2xl transition-all active:scale-95 uppercase"
                        >
                          CONFIRM ORDER <ArrowRight className="w-9 h-9 text-[#E2B15B]" />
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL (Wide Button) */}
      {orderId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0A192F]/98 backdrop-blur-2xl p-6">
          <div style={{ backgroundColor: '#0A192F' }} className="w-full max-w-2xl rounded-[60px] p-16 text-center border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-28 h-28 bg-[#E2B15B] rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
              <CheckCircle className="w-16 h-16 text-[#0A192F]" />
            </div>
            <h2 className="text-5xl font-black mb-4 text-white uppercase tracking-tighter">SUCCESSFUL!</h2>
            <p className="text-slate-400 text-xl font-bold mb-10 italic">Your Order <span style={{ color: '#E2B15B' }}>#{orderId.toString().toUpperCase()}</span> is being prepared.</p>
            
            <button onClick={() => {setOrderId(null); setStatus('');}} 
            style={{ width: '100%', padding: '28px', backgroundColor: '#E2B15B', color: '#0A192F', borderRadius: '25px' }}
            className="font-black text-2xl uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
