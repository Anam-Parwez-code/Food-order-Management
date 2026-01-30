import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, UtensilsCrossed, Trash2, 
  CheckCircle, Clock, X, ArrowRight, User, MapPin, Phone, Star 
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

  const handleViewCartClick = () => {
    setIsCartOpen(true);
    setTimeout(() => {
      checkoutSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/orders`, {
        customer, items: cart, total: cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0)
      });
      if (res.data) {
        setOrderId(res.data.id || "SUCCESS-" + Math.floor(Math.random() * 1000));
        setStatus(res.data.status || 'Order Received');
        setCart([]);
        setIsCartOpen(false);
      }
    } catch (err) { 
      alert("Checkout Error: Check if Backend is running.");
    }
  };

  return (
    // Background: Light Steel Gray for a modern touch
    <div className="min-h-screen w-full bg-[#F4F7F9] text-[#0F172A] font-sans selection:bg-[#FDE68A]">
      
      {/* --- PREMIUM NAVBAR: Deep Navy --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F172A] border-b border-[#1E293B] px-8 md:px-20 h-24 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#E2B15B] p-2.5 rounded-xl shadow-lg">
            <UtensilsCrossed className="text-[#0F172A] w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Raft<span className="text-[#E2B15B]">Foods.</span></h1>
        </div>

        <button onClick={handleViewCartClick} className="bg-[#E2B15B] text-[#0F172A] px-10 py-4 rounded-full flex items-center gap-4 hover:bg-white transition-all shadow-xl active:scale-95 group">
          <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className="font-bold text-sm tracking-widest uppercase">My Cart ({cart.length})</span>
        </button>
      </nav>

      {/* --- FULL WIDTH MAIN SECTION --- */}
      <main className="w-full px-8 md:px-20 pt-44 pb-20">
        <header className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#E2B15B]/10 text-[#C6933F] text-xs font-black uppercase tracking-[0.3em] mb-6 border border-[#E2B15B]/20">Gourmet Experience</div>
          <h2 className="text-6xl md:text-8xl font-black text-[#0F172A] leading-[1] mb-8">
            Purely <br /> <span className="italic font-serif text-[#E2B15B]">Exquisite.</span>
          </h2>
          <div className="h-1.5 w-24 bg-[#E2B15B] mx-auto rounded-full" />
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {menu.map(item => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-[40px] p-7 shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <div className="h-64 rounded-[30px] overflow-hidden mb-6 relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                <div className="absolute top-4 right-4 bg-[#0F172A] px-5 py-2 rounded-2xl font-black text-[#E2B15B] shadow-md">
                  ${item.price}
                </div>
              </div>
              <div className="px-1">
                <h4 className="text-2xl font-black text-[#0F172A] mb-3">{item.name}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">"{item.description}"</p>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-[#F1F5F9] text-[#0F172A] py-5 rounded-[22px] font-black text-lg hover:bg-[#E2B15B] hover:text-[#0F172A] transition-all border border-slate-200"
                >
                  Add Selection +
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- CART DRAWER --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-xl bg-white shadow-2xl flex flex-col h-full animate-slide-in">
            <div className="p-10 border-b flex justify-between items-center bg-white z-10 sticky top-0">
              <h2 className="text-4xl font-black text-[#0F172A] tracking-tighter">Your Menu</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-4 hover:bg-slate-100 rounded-full transition"><X className="w-8 h-8 text-[#0F172A]" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {cart.map(c => (
                <div key={c.item.id} className="flex gap-6 items-center bg-slate-50 p-5 rounded-[30px] border border-slate-100 shadow-sm">
                  <img src={c.item.image} className="w-24 h-24 rounded-[22px] object-cover shadow-sm" />
                  <div className="flex-1">
                    <h5 className="font-black text-xl text-[#0F172A]">{c.item.name}</h5>
                    <p className="text-[#C6933F] font-bold text-lg">${c.item.price} × {c.quantity}</p>
                  </div>
                  <button onClick={() => setCart(cart.filter(i => i.item.id !== c.item.id))} className="text-red-400 hover:text-red-600 transition"><Trash2 className="w-6 h-6" /></button>
                </div>
              ))}

              <div ref={checkoutSectionRef} className="pt-12 mt-12 border-t-2 border-dashed border-slate-100 pb-16">
                <h3 className="text-2xl font-black text-[#0F172A] mb-10 text-center uppercase tracking-widest">Delivery Details</h3>
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-4">
                    <input required placeholder="Your Full Name" className="w-full py-7 px-10 rounded-[30px] bg-slate-50 border-2 border-transparent focus:border-[#E2B15B] focus:bg-white outline-none text-xl font-bold transition-all shadow-inner text-[#0F172A]" 
                    value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
                    
                    <input required placeholder="Shipping Address" className="w-full py-7 px-10 rounded-[30px] bg-slate-50 border-2 border-transparent focus:border-[#E2B15B] focus:bg-white outline-none text-xl font-bold transition-all shadow-inner text-[#0F172A]" 
                    value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} />
                    
                    <input required placeholder="Contact Number" className="w-full py-7 px-10 rounded-[30px] bg-slate-50 border-2 border-transparent focus:border-[#E2B15B] focus:bg-white outline-none text-xl font-bold transition-all shadow-inner text-[#0F172A]" 
                    value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
                  </div>
                  
                  <div className="pt-10">
                    <div className="flex justify-between items-center mb-10 px-4">
                      <span className="text-slate-400 font-black uppercase text-xs tracking-widest">Grand Total</span>
                      <span className="text-5xl font-black text-[#0F172A]">${cart.reduce((s, i) => s + (i.item.price * i.quantity), 0).toFixed(2)}</span>
                    </div>
                    <button type="submit" className="w-full bg-[#0F172A] text-white py-8 rounded-[35px] font-black text-2xl shadow-2xl hover:bg-[#1E293B] transition-all flex items-center justify-center gap-4 active:scale-95">
                      Confirm Order <ArrowRight className="w-7 h-7 text-[#E2B15B]" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ORDER STATUS MODAL: Success Screen --- */}
      {orderId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0F172A]/90 backdrop-blur-xl p-6">
          <div className="bg-white w-full max-w-2xl rounded-[60px] p-16 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-green-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-5xl font-black text-[#0F172A] mb-4">Confirmed!</h2>
            <p className="text-slate-400 text-xl font-bold mb-10 italic">Order ID: <span className="text-[#C6933F]">#{orderId.toString().slice(-6).toUpperCase()}</span></p>
            
            <div className="bg-slate-50 p-12 rounded-[45px] border-2 border-dashed border-slate-200 mb-10">
              <p className="text-slate-400 font-black uppercase text-xs tracking-widest mb-6">Live Status</p>
              <div className="flex items-center justify-center gap-6">
                <Clock className="w-10 h-10 text-[#E2B15B] animate-pulse" />
                <p className="text-5xl font-black text-[#0F172A] italic tracking-tighter uppercase">{status}</p>
              </div>
            </div>
            
            <button onClick={() => {setOrderId(null); setStatus('');}} className="text-[#0F172A] font-black text-xl hover:text-[#C6933F] transition underline underline-offset-8">
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;