import React, { useState, useEffect } from 'react';
import { Crown, ShoppingCart, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotif } from '../context/NotifContext';
import { useTicket } from '../context/TicketProvider';
import supabase from '../lib/supabaseClient';

import KatalogPremium from '../components/KatalogPremium';
import type { Product } from '../types/product';
import useProducts from '../hooks/useProducts';

export default function Store() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [topDonators, setTopDonators] = useState<{name: string, total: number}[]>([]);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  
  // STATE BARU: Untuk menampilkan Pop-Up Pilihan Guest / Login
  const [guestModalProduct, setGuestModalProduct] = useState<Product | null>(null);
  
  const { showNotif } = useNotif();
  const { createTicket } = useTicket();
  const navigate = useNavigate();

  const { products } = useProducts();
  const safeProducts = products || [];
  
  const filteredProducts = activeCategory === 'Semua' ? safeProducts : safeProducts.filter(p => p?.category === activeCategory);
  const premiumProducts = safeProducts.filter(p => p?.is_premium === true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from('categories').select('name').order('created_at', { ascending: true });
        if (!error && data) setCategories(['Semua', ...data.map(cat => cat.name)]);
      } catch (e) { console.error("Gagal memuat kategori:", e); }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchTopDonators() {
      try {
        const { data } = await supabase.from('tickets').select('price, username').eq('status', 'success');
        if (data && data.length > 0) {
          const donatorMap: Record<string, number> = {};
          data.forEach(inv => {
            const buyer = inv.username || 'Pahlawan Anonim';
            donatorMap[buyer] = (donatorMap[buyer] || 0) + (Number(inv.price) || 0);
          });
          const sortedDonators = Object.keys(donatorMap)
            .map(name => ({ name, total: donatorMap[name] }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 3);
          setTopDonators(sortedDonators);
        }
      } catch (e) { console.error("Gagal memuat Top Donatur", e); }
    }
    fetchTopDonators();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.stopPropagation(); 
    showNotif(`${productName} ditambahkan ke Keranjang!`, 'success');
  };

  /**
   * Logika Pembelian Hybrid (Login vs Guest)
   */
  const handleBuy = async (product: Product) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Jika belum login, jangan di-redirect paksa. Tampilkan Pop-Up Opsi.
    if (!user) {
      setGuestModalProduct(product);
      return;
    }
    
    // Jika sudah login, langsung buat tiket pakai akunnya.
    await createTicket(product, false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in duration-500 overflow-hidden relative">
      
      {/* ============================================================== */}
      {/* MODAL POP-UP PILIHAN GUEST / LOGIN (MUNCUL JIKA BELUM LOGIN)   */}
      {/* ============================================================== */}
      {guestModalProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#101014] border border-[#3d3d3d] rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
            
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingCart size={32} />
            </div>

            <h3 className="text-2xl font-black text-center text-white mb-2">Pilih Metode Beli</h3>
            <p className="text-sm text-center text-gray-400 mb-8 leading-relaxed">
              Sangat disarankan untuk <strong>Login</strong> agar transaksi lo aman, gampang dilacak Admin, dan tersimpan di riwayat. Tetap mau beli instan tanpa login?
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/login')} 
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(34,211,238,0.3)] active:scale-95"
              >
                <LogIn size={18} /> Login / Daftar Dulu
              </button>
              
              <button 
                onClick={() => { 
                  createTicket(guestModalProduct, true); // Eksekusi dengan mode Guest = true
                  setGuestModalProduct(null); 
                }} 
                className="w-full flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-gray-700 text-white font-bold py-4 rounded-xl border border-gray-700 transition-all active:scale-95"
              >
                <User size={18} /> Lanjut Sebagai Guest
              </button>
              
              <button onClick={() => setGuestModalProduct(null)} className="mt-3 text-sm font-bold text-gray-500 hover:text-gray-300 transition-colors">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* BAGIAN SLIDER KATALOG PREMIUM ATAS                             */}
      {/* ============================================================== */}
      <div className="relative w-full min-h-[600px] bg-gradient-to-b from-[#14151c] to-[#0f0f13] border border-gray-800 rounded-3xl mb-12 flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <KatalogPremium premiumProducts={premiumProducts} onBuyProduct={handleBuy} />
      </div>

      {/* ============================================================== */}
      {/* GRID KONTEN DAFTAR PRODUK DAN SIDEBAR                          */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row gap-8 mt-12">
        
        {/* Kolom Kiri: Grid Semua Produk */}
        <div className="lg:w-3/4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6 relative z-10">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3 text-white tracking-tight">
              <ShoppingCart className="text-cyan-400" size={24} /> Daftar Semua Produk
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8 relative z-10">
            {categories.map(cat => (
              <button key={`filter-${cat}`} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-300 active:scale-95 ${activeCategory === cat ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-[#1e293b]/30 text-gray-400 border-gray-800 hover:border-cyan-500/50 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {(filteredProducts || []).length > 0 ? (
              filteredProducts.map((product) => (
                <div key={`grid-${product?.id}`} className="min-h-[320px] md:min-h-[350px] bg-gradient-to-b from-[#0d0d0f] to-[#121215] border border-[#3d3d3d] rounded-xl flex flex-col overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 group">
                  
                  <div className="h-32 md:h-40 bg-gradient-to-b from-[#1a1a24] to-[#0d0d0f] relative overflow-hidden border-b border-[#3d3d3d]/50 group-hover:border-cyan-500/30 transition-colors">
                    <div className="absolute inset-0 bg-cyan-500/5 blur-xl rounded-full scale-150"></div>
                    <img src={product?.imageUrl} alt={product?.name} className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-2 right-2 z-20 legendary-indicator scale-75 origin-top-right">
                      <Crown size={10} className="mr-1 inline-block"/> {product?.category}
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-grow relative z-10 bg-gradient-to-b from-transparent to-[#0f0f13]/50">
                    <span className="card-brand text-[9px] mb-0.5 block opacity-70">EDELWEISS</span>
                    <h3 className="text-sm font-extrabold mb-1 text-white tracking-tight uppercase group-hover:text-cyan-400 transition-colors leading-tight">{product?.name}</h3>
                    <p className="text-[10px] text-gray-400 mb-3 line-clamp-3 italic opacity-80 flex-grow leading-snug">"{product?.description}"</p>
                    
                    <div className="border-t border-[#3d3d3d]/50 pt-2.5 mt-auto">
                      <div className="text-center font-bold text-sm text-white mb-2 tracking-tight">Rp {product?.price?.toLocaleString('id-ID')}</div>
                      
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => handleBuy(product)} 
                          className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black px-2 py-1.5 rounded-md text-[10px] font-bold transition-all duration-300 active:scale-95 shadow-[0_4px_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] uppercase tracking-wider"
                        >
                          Beli
                        </button>
                        <button 
                          onClick={(e) => handleAddToCart(e, product.name)}
                          className="bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-2 py-1.5 rounded-md transition-all duration-300 active:scale-95 group-hover:border-cyan-400 flex items-center justify-center"
                          title="Tambah ke keranjang"
                        >
                          <ShoppingCart size={14} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            ) : (
               <div className="col-span-full text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-800 text-xs md:text-sm">
                 Tidak ada produk di kategori {activeCategory}.
               </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Sidebar Informasi (Top Donatur) */}
        <div className="lg:w-1/4 space-y-6 relative z-10 mt-8 lg:mt-0">
          <div className="bg-gradient-to-b from-[#1a1a24] to-[#121215] border-2 border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 blur-3xl rounded-full"></div>
            <h3 className="text-lg font-bold flex items-center gap-3 mb-5 text-[#d4af37] relative z-10"><Crown size={22} /> Top Donatur</h3>
            
            <div className="space-y-4 relative z-10">
              {topDonators.length > 0 ? (
                topDonators.map((donator, idx) => (
                  <div key={`donator-${idx}`} className="flex items-center gap-4 bg-[#14141a]/50 p-3 rounded-xl border border-gray-800 hover:border-[#d4af37]/30 transition-colors">
                    <div className={`w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center font-bold text-lg border-2 ${idx === 0 ? 'border-[#d4af37] text-[#d4af37]' : 'border-gray-700 text-gray-400'}`}>{idx + 1}</div>
                    <div>
                      <div className="text-sm font-bold text-white uppercase tracking-wider truncate max-w-[120px]">{donator.name}</div>
                      <div className="text-[10px] text-gray-400 uppercase">Rp {donator.total.toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-gray-500 py-4">Belum ada donatur bulan ini.</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}