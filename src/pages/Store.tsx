// [code lama + code hasil pembaharuan = code update]
import React, { useState, useEffect, useRef } from 'react';
import { Crown, ShoppingCart, X, Send, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useNotif } from '../context/NotifContext';

// =========================================================================
// IMPORT KOMPONEN MASTER & DATA PRODUCTS
// =========================================================================
import KatalogPremium from '../components/KatalogPremium';
import type { Product } from '../types/product';
import useProducts from '../hooks/useProducts';
import supabase from '../lib/supabaseClient';

// =========================================================================
// IMPORT GAMBAR QRIS DARI FOLDER ASSETS
// =========================================================================
import gambarQris from '../assets/qris.jpg';

export default function Store() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  
  // STATE SISTEM TICKETING CHAT
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  
  const { showNotif } = useNotif();
  const [topDonators, setTopDonators] = useState<{name: string, total: number}[]>([]);
  const [categories, setCategories] = useState<string[]>(['Semua']);

  const { products } = useProducts();
  const safeProducts = products || [];
  
  const filteredProducts = activeCategory === 'Semua' ? safeProducts : safeProducts.filter(p => p?.category === activeCategory);
  const premiumProducts = safeProducts.filter(p => p?.is_premium === true);

  // Auto-scroll chat ke paling bawah
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

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
            const buyer = inv.username || 'Unknown Hero';
            donatorMap[buyer] = (donatorMap[buyer] || 0) + (Number(inv.price) || 0);
          });
          const sortedDonators = Object.keys(donatorMap).map(name => ({ name, total: donatorMap[name] })).sort((a, b) => b.total - a.total).slice(0, 3);
          setTopDonators(sortedDonators);
        }
      } catch (e) { console.error("Gagal memuat Top Donatur", e); }
    }
    fetchTopDonators();
  }, []);

  // REALTIME CHAT SUBSCRIPTION
  useEffect(() => {
    if (!activeTicket) return;

    // Load initial messages
    const fetchMessages = async () => {
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', activeTicket.id).order('created_at', { ascending: true });
      setChatMessages(data || []);
    };
    fetchMessages();

    // Subscribe realtime updates
    const channel = supabase.channel(`ticket_${activeTicket.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${activeTicket.id}` }, (payload) => {
        setChatMessages(prev => [...prev, payload.new]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `id=eq.${activeTicket.id}` }, (payload) => {
        setActiveTicket(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTicket?.id]);

  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.stopPropagation(); 
    showNotif(`${productName} ditambahkan ke Keranjang!`, 'success');
  };

  // FIX UTAMA: KINI MEMANGGIL MECHANISME TICKET CHAT LANGSUNG SAAT KLIK BELI
  const handleBuy = async (product: Product) => {
    try {
      setSelectedProduct(product);
      const username = localStorage.getItem('mc_username') || 'Player_Anon';
      
      // Hitung tiket player ini untuk generate ID (Misal: Roppan#0001)
      const { count } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('username', username);
      const ticketSequence = String((count || 0) + 1).padStart(4, '0');
      const ticketCode = `${username}#${ticketSequence}`;

      // Insert ke tabel tickets di Supabase
      const { data: ticketData, error: ticketErr } = await supabase.from('tickets').insert({
        ticket_code: ticketCode,
        username: username,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        status: 'open'
      }).select().single();

      if (ticketErr) throw ticketErr;

      // Insert Auto-System Message (Invoice QRIS) ke dalam room chat tiket
      await supabase.from('ticket_messages').insert({
        ticket_id: ticketData.id,
        sender_type: 'system_invoice',
        message: 'Pesanan Dibuat'
      });

      // Set active ticket untuk langsung mentrigger dan membuka modal chat box
      setActiveTicket(ticketData);
      showNotif(`Sesi chat pesanan ${ticketCode} berhasil dibuat.`, 'success');
    } catch (e: any) {
      showNotif('Gagal membuat pesanan: ' + (e.message || 'Error database'), 'error');
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !activeTicket) return;
    const msg = chatInput;
    setChatInput('');
    try {
      await supabase.from('ticket_messages').insert({
        ticket_id: activeTicket.id,
        sender_type: 'player',
        message: msg
      });
    } catch (e) {
      showNotif('Gagal mengirim pesan', 'error');
    }
  };

  const handleQuickAction = async (action: 'cancel' | 'paid') => {
    if (!activeTicket) return;
    try {
      if (action === 'cancel') {
        await supabase.from('tickets').update({ status: 'canceled' }).eq('id', activeTicket.id);
        await supabase.from('ticket_messages').insert({ ticket_id: activeTicket.id, sender_type: 'system', message: 'Player membatalkan pesanan.' });
      } else if (action === 'paid') {
        await supabase.from('tickets').update({ status: 'waiting_confirmation' }).eq('id', activeTicket.id);
        await supabase.from('ticket_messages').insert({ ticket_id: activeTicket.id, sender_type: 'player', message: 'Saya sudah melakukan pembayaran.' });
        await supabase.from('ticket_messages').insert({ ticket_id: activeTicket.id, sender_type: 'system', message: 'Pembayaran sedang diproses dan diverifikasi oleh Admin.' });
      }
    } catch (e) {
      showNotif('Gagal memproses aksi', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in duration-500 overflow-hidden">
      
      {/* ============================================================== */}
      {/* BAGIAN SLIDER KATALOG PREMIUM ATAS                             */}
      {/* ============================================================== */}
      <div className="relative w-full min-h-[600px] bg-gradient-to-b from-[#14151c] to-[#0f0f13] border border-gray-800 rounded-3xl mb-12 flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        {/* Menyisipkan data produk premium ke dalam komponen slider KatalogPremium */}
        <KatalogPremium premiumProducts={premiumProducts} />
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

      {/* ============================================================== */}
      {/* MODAL SESI CHAT TICKETING REALTIME                             */}
      {/* ============================================================== */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in transition-all">
          <div className="bg-[#101014] border border-[#3d3d3d] rounded-2xl w-full max-w-lg h-[85vh] flex flex-col overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.15)] relative">
            
            {/* Header Chat */}
            <div className="p-4 border-b border-[#3d3d3d]/50 bg-[#1a1a24] flex justify-between items-center z-10 shadow-md">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  PESANAN <span className="text-cyan-400">{activeTicket.ticket_code}</span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {activeTicket.status === 'open' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1"><Clock size={10}/> Menunggu Pembayaran</span>}
                  {activeTicket.status === 'waiting_confirmation' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1"><Clock size={10}/> Sedang Diperiksa Admin</span>}
                  {activeTicket.status === 'success' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1"><CheckCircle2 size={10}/> Lunas & Selesai</span>}
                  {activeTicket.status === 'canceled' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1"><AlertCircle size={10}/> Dibatalkan</span>}
                </div>
              </div>
              <button onClick={() => { setActiveTicket(null); setSelectedProduct(null); }} className="text-gray-400 hover:text-white p-1.5 bg-[#0f0f13] rounded-full border border-gray-700 transition-colors"><X size={20} /></button>
            </div>
            
            {/* Area Chat Messages */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0d0d0f] to-[#121215]">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender_type === 'player' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Tipe Pesan: SYSTEM INVOICE (PRO SHOP STYLE + FIX SIZE QRIS GEDE 320px) */}
                  {msg.sender_type === 'system_invoice' ? (
                    <div className="w-full bg-[#1a1a24] border border-[#3d3d3d] rounded-xl p-5 mb-2 shadow-lg animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-start border-b border-gray-700 pb-3 mb-3">
                        <div>
                          <p className="text-[#22d3ee] font-black text-xs tracking-widest mb-1 uppercase">EDELWEISS OFFICIAL INVOICE</p>
                          <h4 className="text-lg font-extrabold text-white uppercase">{activeTicket.product_name}</h4>
                          <p className="text-[11px] text-gray-500 mt-1">Status Tagihan: <span className="text-yellow-500 font-bold">BELUM LUNAS</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total Pembayaran:</p>
                          <p className="text-xl font-black text-cyan-400">Rp {Number(activeTicket.price).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      
                      {/* TAMPILAN QRIS YANG SUDAH DINAIKKAN MENJADI W-80 (320px) AGAR SANGAT MUDAH DI-SCAN */}
                      <div className="flex flex-col items-center bg-white p-4 rounded-xl shadow-inner border border-gray-200">
                        <p className="text-black font-black text-xs mb-3 tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-gray-300">SCAN QRIS MERCHANT</p>
                        <img src={gambarQris} alt="QRIS Edelweiss Craft" className="w-80 h-80 object-contain mb-2 border border-gray-300 rounded-lg p-1 bg-white shadow-sm" />
                        <p className="text-gray-500 text-[10px] text-center max-w-[240px]">Pastiin nominal transfer sesuai dengan total tagihan di atas.</p>
                      </div>
                    </div>
                  ) : 
                  /* Tipe Pesan: SYSTEM CONFIRMATION / ANNOUNCEMENT */
                  msg.sender_type === 'system' ? (
                    <div className="w-full flex justify-center my-2 animate-in fade-in duration-300">
                      <div className="bg-gray-800/60 text-gray-300 text-xs px-4 py-2 rounded-xl border border-gray-700 max-w-[90%] text-center leading-relaxed">
                        {msg.message}
                      </div>
                    </div>
                  ) : 
                  /* Tipe Pesan: INTERAKSI PLAYER / ADMIN */
                  (
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-md animate-in slide-in-from-bottom-2 duration-200 ${msg.sender_type === 'player' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-[#1e293b] text-gray-200 border border-gray-700 rounded-bl-none'}`}>
                      <p className="text-[10px] font-bold mb-1 opacity-60 uppercase tracking-wider">{msg.sender_type === 'player' ? 'Anda' : 'Staff Admin'}</p>
                      <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Area Input & Tombol Quick Actions */}
            <div className="p-4 bg-[#1a1a24] border-t border-[#3d3d3d]/50">
              {activeTicket.status === 'open' && (
                <div className="flex gap-2 mb-3">
                  <button onClick={() => handleQuickAction('cancel')} className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95">Batalkan Pesanan</button>
                  <button onClick={() => handleQuickAction('paid')} className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-black text-xs font-bold hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.4)]">Saya Sudah Membayar</button>
                </div>
              )}
              
              <div className="flex gap-2 items-center bg-[#0f0f13] border border-gray-700 rounded-xl p-1.5 focus-within:border-cyan-500 transition-colors">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder={activeTicket.status === 'canceled' || activeTicket.status === 'success' ? "Sesi chat telah ditutup..." : "Ketik pesan untuk Admin di sini..."}
                  disabled={activeTicket.status === 'canceled' || activeTicket.status === 'success'}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white px-3 disabled:opacity-50 focus:outline-none"
                />
                <button 
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || activeTicket.status === 'canceled' || activeTicket.status === 'success'}
                  className="p-2.5 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-500 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}