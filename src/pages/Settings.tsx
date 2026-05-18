// [code lama + code hasil pembaharuan = code update]
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Image as ImageIcon, 
  Newspaper, 
  Server, 
  Store,
  Plus, 
  Trash2, 
  Save,
  Power,
  Activity,
  DollarSign,
  Tag,
  Star,
  ListPlus,
  Edit,
  X,
  MessageSquare,
  Send
} from 'lucide-react';

import supabase from '../lib/supabaseClient';
import useProducts from '../hooks/useProducts';
import ImageUploader from '../components/ImageUploader';
import { updateInvoiceStatus } from '../services/invoicesService';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [invoicesWaiting, setInvoicesWaiting] = useState<any[]>([]);

  // ==========================================
  // STATE MANAJEMEN: SERVER & DASHBOARD
  // ==========================================
  const [serverConfig, setServerConfig] = useState({
    maintenance: false,
    whitelist: false
  });

  const [dashboardStats, setDashboardStats] = useState({
    revenue: 0,
    pendingInvoices: 0,
    totalPlayers: 1402
  });

  // ==========================================
  // STATE MANAJEMEN: KATEGORI PRODUK
  // ==========================================
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch (e) {
      console.error('Gagal memuat kategori:', e);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return alert('Nama kategori tidak boleh kosong!');
    try {
      const { error } = await supabase.from('categories').insert({ name: newCategoryName.trim() });
      if (error) throw error;
      setNewCategoryName('');
      fetchCategories();
      alert('Kategori berhasil ditambahkan.');
    } catch (e: any) {
      alert('Gagal menambah kategori (Mungkin nama sudah ada): ' + (e.message || String(e)));
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kategori ini? Pastikan tidak ada produk yang masih menggunakan kategori ini.')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      fetchCategories();
      alert('Kategori berhasil dihapus.');
    } catch (e: any) {
      alert('Gagal menghapus kategori: ' + (e.message || String(e)));
    }
  };

  // ==========================================
  // STATE MANAJEMEN: BERANDA (SLIDER KOMUNITAS)
  // ==========================================
  const [slides, setSlides] = useState<{ id: number; url: string }[]>([]);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

  const handleAddSlide = async () => {
    try {
      const { data, error } = await supabase.from('slides').insert({ url: '' }).select();
      if (error) throw error;
      await fetchSlides();
      if (data && data.length > 0) setEditingSlideId(data[0].id);
    } catch (e: any) { 
      console.error('❌ Error menambah slide:', e);
      alert('Gagal menambahkan slide: ' + (e.message || String(e)));
    }
  };

  const handleUpdateSlide = async (id: number, newUrl: string) => {
    try {
      await supabase.from('slides').update({ url: newUrl }).eq('id', id);
      fetchSlides();
    } catch (e) { console.error(e); }
  };

  const handleDeleteSlide = async (id: number) => {
    if (!confirm('Yakin ingin menghapus slide ini?')) return;
    try {
      const { error } = await supabase.from('slides').delete().eq('id', id);
      if (error) throw error;
      await fetchSlides();
    } catch (e: any) { 
      console.error('❌ Error menghapus slide:', e);
      alert('Gagal menghapus slide: ' + (e.message || String(e)));
    }
  };

  // ==========================================
  // STATE MANAJEMEN: BERANDA (BERITA SERVER)
  // ==========================================
  const [news, setNews] = useState<{ id: number; title: string; tag: string; content: string }[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);

  const handleAddNews = async () => {
    try {
      const { data, error } = await supabase.from('news').insert({ title: 'Berita Baru', tag: 'INFO', content: '' }).select();
      if (error) throw error;
      await fetchNews();
      if (data && data.length > 0) setEditingNewsId(data[0].id);
    } catch (e: any) { 
      console.error('❌ Error menambah berita:', e);
      alert('Gagal menambahkan berita: ' + (e.message || String(e)));
    }
  };

  const handleUpdateNews = async (id: number, field: string, value: string) => {
    try {
      await supabase.from('news').update({ [field]: value }).eq('id', id);
      fetchNews();
    } catch (e) { console.error(e); }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Yakin ingin menghapus berita ini?')) return;
    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      await fetchNews();
    } catch (e: any) { 
      console.error('❌ Error menghapus berita:', e);
      alert('Gagal menghapus berita: ' + (e.message || String(e)));
    }
  };

  // ==========================================
  // STATE MANAJEMEN: STORE (KATALOG PRODUK)
  // ==========================================
  const { products: storeProducts, refresh: refreshProducts } = useProducts();
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);

  const handleAddProduct = async () => {
    try {
      const defaultCategory = categories.length > 0 ? categories[0].name : 'Lainnya';
      const newProduct = { name: 'Produk Baru', price: 0, category: defaultCategory, description: '', is_premium: false };
      const { data, error } = await supabase.from('products').insert([newProduct]).select();
      if (error) throw error;
      await refreshProducts();
      if (data && data.length > 0) setEditingProductId(data[0].id);
    } catch (e: any) { 
      console.error('❌ Error menambah produk:', e);
      alert('Gagal menambahkan produk: ' + (e.message || String(e)));
    }
  };

  const handleUpdateProduct = async (id: string | number, field: string, value: string | number | boolean) => {
    try {
      const { error } = await supabase.from('products').update({ [field]: value }).eq('id', id);
      if (error) throw error;
      await refreshProducts();
    } catch (e: any) { 
      console.error(`❌ Error mengupdate field '${field}':`, e);
      alert(`Gagal mengupdate ${field}: ` + (e.message || String(e)));
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      await refreshProducts();
    } catch (e: any) { 
      console.error('❌ Error menghapus produk:', e);
      alert('Gagal menghapus produk: ' + (e.message || String(e)));
    }
  };

  // ==========================================
  // STATE MANAJEMEN: SISTEM TICKETING CHAT
  // ==========================================
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedAdminTicket, setSelectedAdminTicket] = useState<any | null>(null);
  const [adminChatMessages, setAdminChatMessages] = useState<any[]>([]);
  const [adminChatInput, setAdminChatInput] = useState('');
  const adminScrollRef = useRef<HTMLDivElement>(null);

  // AUTO SCROLL ADMIN CHAT
  useEffect(() => {
    if (adminScrollRef.current) {
      adminScrollRef.current.scrollTop = adminScrollRef.current.scrollHeight;
    }
  }, [adminChatMessages]);

  // FETCH DAFTAR TIKET UNTUK ADMIN
  async function fetchTickets() {
    try {
      const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      setTickets(data || []);
    } catch (e) {
      console.error('Gagal mengambil data tiket:', e);
    }
  }

  // REALTIME ADMIN CHAT SUBSCRIPTION
  useEffect(() => {
    if (!selectedAdminTicket) return;
    const fetchAdminMsgs = async () => {
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', selectedAdminTicket.id).order('created_at', { ascending: true });
      setAdminChatMessages(data || []);
    };
    fetchAdminMsgs();

    const channel = supabase.channel(`admin_ticket_${selectedAdminTicket.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${selectedAdminTicket.id}` }, (payload) => {
        setAdminChatMessages(prev => [...prev, payload.new]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `id=eq.${selectedAdminTicket.id}` }, (payload) => {
        setSelectedAdminTicket(payload.new);
        fetchTickets(); 
        fetchDashboardStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedAdminTicket?.id]);

  // FUNGSI CHAT ADMIN
  const sendAdminMessage = async () => {
    if (!adminChatInput.trim() || !selectedAdminTicket) return;
    const msg = adminChatInput;
    setAdminChatInput('');
    try {
      await supabase.from('ticket_messages').insert({ ticket_id: selectedAdminTicket.id, sender_type: 'admin', message: msg });
    } catch (e) {
      console.error('Gagal membalas pesan:', e);
    }
  };

  const handleAdminTicketAction = async (action: 'success' | 'canceled') => {
    if (!selectedAdminTicket) return;
    if (!confirm(`Yakin ingin mengubah status menjadi ${action}?`)) return;
    try {
      await supabase.from('tickets').update({ status: action }).eq('id', selectedAdminTicket.id);
      await supabase.from('ticket_messages').insert({ 
        ticket_id: selectedAdminTicket.id, 
        sender_type: 'system', 
        message: action === 'success' ? '✅ Admin telah memverifikasi pembayaran. Pesanan selesai.' : '❌ Pesanan dibatalkan / ditolak oleh Admin.' 
      });
    } catch (e) {
      console.error('Gagal update status tiket:', e);
    }
  };

  // Helper fetchers
  async function fetchSlides() {
    try {
      const { data } = await supabase.from('slides').select('id, url').order('id');
      setSlides((data || []).map((d: any) => ({ id: d.id, url: d.url })));
    } catch (e) { console.error(e); }
  }

  async function fetchNews() {
    try {
      const { data } = await supabase.from('news').select('id, title, tag, content').order('id');
      setNews((data || []).map((d: any) => ({ id: d.id, title: d.title, tag: d.tag, content: d.content })));
    } catch (e) { console.error(e); }
  }

  async function fetchDashboardStats() {
    try {
      const { data: successData } = await supabase.from('tickets').select('price').eq('status', 'success');
      const totalRevenue = (successData || []).reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
      const { count: pendingCount } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'waiting_confirmation');

      setDashboardStats(prev => ({
        ...prev,
        revenue: totalRevenue,
        pendingInvoices: pendingCount || 0
      }));
    } catch (e) { console.error(e); }
  }

  async function fetchWaitingInvoices() {
    try {
      const { data } = await supabase.from('invoices').select('id, product_id, price, quantity, status, metadata, created_at').eq('status', 'waiting_confirmation').order('created_at', { ascending: true });
      setInvoicesWaiting(data || []);
    } catch (e) { console.error(e); }
  }

  useEffect(() => {
    fetchSlides();
    fetchNews();
    fetchWaitingInvoices();
    fetchDashboardStats(); 
    fetchCategories(); 
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmInvoice = async (id: string) => {
    try {
      await updateInvoiceStatus(id, 'success');
      setInvoicesWaiting((prev) => prev.filter(i => i.id !== id));
      fetchDashboardStats();
      alert('Invoice dikonfirmasi lunas.');
    } catch (e: any) { console.error(e); alert('Gagal konfirmasi: ' + (e.message || String(e))); }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      
      {/* HEADER ADMIN */}
      <div className="bg-[#1e293b]/50 border border-red-500/20 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
            <ShieldAlert size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Control Panel Utama Website & Server Edelweiss Craft</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0f0f13] border border-gray-800 px-5 py-2.5 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">System: <span className="text-green-500 font-bold">Online</span></span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR NAVIGASI */}
        <div className="lg:w-1/4 space-y-2">
          {[
            { id: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'Kontrol Beranda', icon: <Newspaper size={18} /> },
            { id: 'Manajemen Store', icon: <Store size={18} /> },
            { id: 'Sesi Chat Customer', icon: <MessageSquare size={18} /> },
            { id: 'Pengaturan Server', icon: <Server size={18} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'bg-[#1e293b]/30 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                {tab.id}
              </div>
              {tab.id === 'Sesi Chat Customer' && dashboardStats.pendingInvoices > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{dashboardStats.pendingInvoices}</span>
              )}
            </button>
          ))}

          <button className="w-full flex items-center justify-center gap-2 mt-8 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black border border-green-500/50 px-5 py-3.5 rounded-xl text-sm font-bold transition-all">
            <Save size={18} /> Simpan Semua Data
          </button>
        </div>

        {/* AREA KONTEN UTAMA */}
        <div className="lg:w-3/4 space-y-6">
          
          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD UMUM */}
          {/* ========================================================= */}
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-300">
              
              <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400">
                  <Server size={20} /> Kontrol Server
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Maintenance Mode</h4>
                      <p className="text-xs text-gray-500">Matikan akses web untuk player.</p>
                    </div>
                    <button onClick={() => setServerConfig({...serverConfig, maintenance: !serverConfig.maintenance})} className={`w-12 h-6 rounded-full transition-colors relative ${serverConfig.maintenance ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${serverConfig.maintenance ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Whitelist Mode</h4>
                      <p className="text-xs text-gray-500">Hanya player terdaftar yang bisa login.</p>
                    </div>
                    <button onClick={() => setServerConfig({...serverConfig, whitelist: !serverConfig.whitelist})} className={`w-12 h-6 rounded-full transition-colors relative ${serverConfig.whitelist ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${serverConfig.whitelist ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-3 rounded-xl font-bold transition-colors">
                  <Power size={18} /> Restart Web Server
                </button>
              </div>

              <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400 mb-6">
                  <Activity size={20} /> Statistik Cepat
                </h3>
                <div className="space-y-3">
                  <div className="bg-[#0f0f13] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Player Web</span>
                    <span className="font-bold text-cyan-400 text-lg">{dashboardStats.totalPlayers.toLocaleString()}</span>
                  </div>
                  <div className="bg-[#0f0f13] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-gray-400">Transaksi (Sukses)</span>
                    <span className="font-bold text-green-400 text-lg">Rp {dashboardStats.revenue.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-[#0f0f13] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tiket Menunggu Validasi</span>
                    <span className="font-bold text-yellow-400 text-lg">{dashboardStats.pendingInvoices}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: KONTROL BERANDA (CMS SLIDER & NEWS) */}
          {/* ========================================================= */}
          {activeTab === 'Kontrol Beranda' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              {/* EDITOR: CUPLIKAN KOMUNITAS (SLIDER) */}
              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                      <ImageIcon className="text-cyan-400" size={24} /> Editor Cuplikan Komunitas
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Atur gambar slider yang muncul di halaman depan.</p>
                  </div>
                  <button onClick={handleAddSlide} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm">
                    <Plus size={18} /> Tambah Slide
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {slides.map((slide, index) => {
                    const isEditing = editingSlideId === slide.id;

                    return (
                      <div key={slide.id} className="bg-[#0f0f13] rounded-xl border border-gray-800 relative group transition-colors hover:border-gray-700">
                        {isEditing ? (
                          // TAMPILAN EDIT (FULL)
                          <div className="p-5 flex flex-col sm:flex-row gap-6 relative">
                            {/* Tombol Aksi di Kanan Atas yang Rapi */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                              <button onClick={() => setEditingSlideId(null)} className="p-2 bg-gray-800 text-white hover:bg-cyan-500 hover:text-black rounded-lg transition-colors" title="Tutup Editor"><X size={16} /></button>
                              <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Hapus Slide"><Trash2 size={16} /></button>
                            </div>
                            
                            <div className="w-full sm:w-40 h-28 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700 mt-8 sm:mt-0">
                              {slide.url ? (
                                <img src={slide.url} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 text-center px-2">Belum ada gambar</div>
                              )}
                            </div>
                            
                            <div className="flex-grow flex flex-col justify-center space-y-3 mt-4 sm:mt-8">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upload / URL Gambar Slide</label>
                              <ImageUploader onUpload={(publicUrl) => handleUpdateSlide(slide.id, publicUrl)} folder={`slides`} />
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-600 font-bold uppercase">Atau</span>
                                <div className="flex-grow h-px bg-gray-800"></div>
                              </div>
                              <input type="text" value={slide.url} onChange={(e) => handleUpdateSlide(slide.id, e.target.value)} placeholder="Paste link URL eksternal di sini..." className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500" />
                            </div>
                          </div>
                        ) : (
                          // TAMPILAN RINGKAS (COMPACT)
                          <div className="p-4 flex items-center gap-4">
                            <div className="w-24 h-14 bg-gray-900 rounded-md overflow-hidden flex-shrink-0 border border-gray-700">
                              {slide.url ? (
                                <img src={slide.url} className="w-full h-full object-cover" />
                              ) : (
                                <div className="text-[10px] text-gray-500 flex items-center justify-center h-full">No Image</div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm text-gray-300 truncate font-mono">{slide.url || 'URL gambar belum diatur'}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button onClick={() => setEditingSlideId(slide.id)} className="p-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-lg transition-colors"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteSlide(slide.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {slides.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-700">Tidak ada slide. Klik "Tambah Slide" untuk memulai.</div>
                  )}
                </div>
              </section>

              {/* EDITOR: BERITA & PEMBARUAN */}
              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                      <Newspaper className="text-cyan-400" size={24} /> Editor Berita & Pembaruan
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Kendalikan informasi dan patch notes yang dibaca player.</p>
                  </div>
                  <button onClick={handleAddNews} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm">
                    <Plus size={18} /> Buat Berita
                  </button>
                </div>

                <div className="space-y-4">
                  {news.map((item) => {
                    const isEditing = editingNewsId === item.id;

                    return (
                      <div key={item.id} className="bg-[#0f0f13] rounded-xl border border-gray-800 relative group transition-colors hover:border-gray-700">
                        {isEditing ? (
                          // TAMPILAN EDIT (FULL)
                          <div className="p-5 relative">
                            {/* Tombol Aksi di Kanan Atas yang Rapi */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                              <button onClick={() => setEditingNewsId(null)} className="p-2 bg-gray-800 text-white hover:bg-cyan-500 hover:text-black rounded-lg transition-colors" title="Tutup Editor"><X size={16} /></button>
                              <button onClick={() => handleDeleteNews(item.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Hapus Berita"><Trash2 size={16} /></button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                              <div className="md:col-span-1 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tag</label>
                                <select value={item.tag} onChange={(e) => handleUpdateNews(item.id, 'tag', e.target.value)} className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none">
                                  <option value="TERBARU">TERBARU</option>
                                  <option value="MAINTENANCE">MAINTENANCE</option>
                                  <option value="EVENT">EVENT</option>
                                  <option value="SEGERA">SEGERA</option>
                                  <option value="INFO">INFO UMUM</option>
                                </select>
                              </div>
                              <div className="md:col-span-3 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Berita</label>
                                <input type="text" value={item.title} onChange={(e) => handleUpdateNews(item.id, 'title', e.target.value)} className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-bold" />
                              </div>
                              <div className="md:col-span-4 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Isi Konten</label>
                                <textarea value={item.content} onChange={(e) => handleUpdateNews(item.id, 'content', e.target.value)} rows={3} className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-y" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          // TAMPILAN RINGKAS (COMPACT)
                          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex-shrink-0 w-24">
                              <span className="px-2 py-1 text-[10px] font-bold rounded bg-cyan-500/10 text-cyan-400">{item.tag || 'INFO'}</span>
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-sm font-bold text-white truncate">{item.title || 'Judul Kosong'}</h4>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{item.content || 'Belum ada konten...'}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
                              <button onClick={() => setEditingNewsId(item.id)} className="p-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-lg transition-colors"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteNews(item.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {news.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-700">Belum ada berita. Klik "Buat Berita" untuk menambahkan.</div>
                  )}
                </div>
              </section>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: MANAJEMEN STORE (KATALOG PRODUK & KATEGORI) */}
          {/* ========================================================= */}
          {activeTab === 'Manajemen Store' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              {/* SUB-SECTION: PENGATURAN KATEGORI */}
              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                      <ListPlus className="text-cyan-400" size={24} /> Kategori Produk
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Buat kategori baru untuk mengelompokkan item di Web Store.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nama Kategori Baru (Cth: Gacha, Crate, Bundle)..."
                    className="flex-grow bg-[#0f0f13] border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button onClick={handleAddCategory} className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-lg font-bold transition-colors">
                    Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2 bg-[#0f0f13] border border-gray-700 px-4 py-2 rounded-full group hover:border-cyan-500 transition-colors">
                      <span className="text-sm font-bold text-gray-300 group-hover:text-cyan-400">{cat.name}</span>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-gray-500 hover:text-red-500 ml-2"
                        title="Hapus Kategori"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <span className="text-sm text-gray-500 italic">Belum ada kategori yang dibuat.</span>
                  )}
                </div>
              </section>

              {/* SUB-SECTION: EDITOR KATALOG STORE */}
              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                      <Store className="text-cyan-400" size={24} /> Editor Produk
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Kelola harga, deskripsi, dan daftar produk yang dijual di web store.</p>
                  </div>
                  <button onClick={handleAddProduct} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm">
                    <Plus size={18} /> Tambah Produk
                  </button>
                </div>

                <div className="space-y-4">
                  {(storeProducts || []).map((product) => {
                    const isEditing = editingProductId === product.id;

                    return (
                      <div key={product.id} className="bg-[#0f0f13] rounded-xl border border-gray-800 relative group transition-colors hover:border-gray-600">
                        {isEditing ? (
                          // TAMPILAN EDIT (FULL)
                          <div className="p-5 relative">
                            {/* Tombol Aksi di Kanan Atas yang Rapi */}
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                              <button onClick={() => setEditingProductId(null)} className="p-2 bg-gray-800 text-white hover:bg-cyan-500 hover:text-black rounded-lg transition-colors" title="Tutup Editor"><X size={16} /></button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Hapus Produk"><Trash2 size={16} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-8">
                              <div className="md:col-span-3 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Tag size={12}/> Kategori</label>
                                <select value={product.category} onChange={(e) => handleUpdateProduct(product.id, 'category', e.target.value)} className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none">
                                  {categories.map(cat => <option key={`opt-${cat.id}`} value={cat.name}>{cat.name}</option>)}
                                  {categories.length === 0 && <option value="Lainnya">Lainnya</option>}
                                </select>
                              </div>
                              <div className="md:col-span-5 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Produk</label>
                                <input type="text" value={product.name} onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)} className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-bold" />
                              </div>
                              <div className="md:col-span-4 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><DollarSign size={12}/> Harga (Rp)</label>
                                <input type="number" value={product.price} onChange={(e) => handleUpdateProduct(product.id, 'price', parseInt(e.target.value) || 0)} className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500 font-bold" />
                              </div>
                              <div className="md:col-span-12 space-y-2 mt-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi Singkat</label>
                                <textarea value={product.description} onChange={(e) => handleUpdateProduct(product.id, 'description', e.target.value)} rows={2} className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-y" />
                              </div>
                              <div className="md:col-span-12 mt-2 flex items-center gap-3 bg-[#1e293b]/40 p-4 rounded-xl border border-gray-700/50">
                                <input type="checkbox" id={`premium-${product.id}`} checked={product.is_premium || false} onChange={(e) => handleUpdateProduct(product.id, 'is_premium', e.target.checked)} className="w-5 h-5 text-cyan-500 rounded focus:ring-cyan-500 bg-[#0f0f13] border-gray-600 cursor-pointer" />
                                <label htmlFor={`premium-${product.id}`} className="text-sm text-gray-300 font-bold cursor-pointer flex items-center gap-2"><Star className={product.is_premium ? 'text-yellow-400' : 'text-gray-500'} size={18} /> Tampilkan di Katalog Premium</label>
                              </div>
                              <div className="md:col-span-12 mt-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gambar Produk</label>
                                <div className="mt-2">
                                  <div className="mb-3">
                                    {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-32 h-20 object-cover rounded-md border" /> : <div className="w-32 h-20 bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-500">No Image</div>}
                                  </div>
                                  <ImageUploader onUpload={async (publicUrl) => { await handleUpdateProduct(product.id, 'image_url', publicUrl); refreshProducts(); }} folder={`products/${product.id}`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // TAMPILAN RINGKAS (COMPACT)
                          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-16 h-16 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                              {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <div className="text-[10px] text-gray-500 flex items-center justify-center h-full text-center">No Img</div>}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                {product.name || 'Produk Baru'} 
                                {product.is_premium && <Star size={12} className="text-yellow-400 fill-yellow-400" title="Premium" />}
                              </h4>
                              <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{product.category}</p>
                              <p className="text-xs text-gray-500 truncate mt-1">{product.description || 'Tidak ada deskripsi...'}</p>
                            </div>
                            <div className="flex-shrink-0 sm:text-right w-full sm:w-auto mt-2 sm:mt-0 flex justify-between sm:block items-center">
                              <div className="text-sm font-bold text-white sm:mb-2">Rp {(product.price || 0).toLocaleString('id-ID')}</div>
                              <div className="flex items-center gap-2 justify-end">
                                <button onClick={() => setEditingProductId(product.id)} className="p-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-lg transition-colors"><Edit size={16} /></button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(storeProducts || []).length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-700">Katalog toko masih kosong. Klik "Tambah Produk" untuk mulai berjualan.</div>
                  )}
                </div>
              </section>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB BARU: SESI CHAT CUSTOMER (MENGGANTIKAN INVOICE ADMIN)  */}
          {/* ========================================================= */}
          {activeTab === 'Sesi Chat Customer' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 h-full min-h-[600px] flex flex-col">
              
              {!selectedAdminTicket ? (
                // LIST TIKET CHAT
                <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 lg:p-8 flex-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2"><MessageSquare className="text-cyan-400" size={20} /> Sistem Tiket Pesanan</h3>
                      <p className="text-sm text-gray-500 mt-1">Pilih tiket untuk membalas chat dan memvalidasi pembayaran.</p>
                    </div>
                    <button onClick={fetchTickets} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-lg text-sm font-bold transition-colors border border-cyan-500/20">Refresh Tiket</button>
                  </div>

                  <div className="space-y-3">
                    {tickets.length === 0 && <div className="text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-700">Tidak ada tiket pesanan masuk.</div>}
                    
                    {tickets.map((t) => (
                      <div key={t.id} onClick={() => setSelectedAdminTicket(t)} className="bg-[#0f0f13] p-4 rounded-xl border border-gray-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${t.status === 'waiting_confirmation' ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : t.status === 'open' ? 'border-blue-500 text-blue-500 bg-blue-500/10' : t.status === 'success' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-gray-600 text-gray-500 bg-gray-800'}`}>
                            {t.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-bold">{t.ticket_code}</h4>
                              {t.status === 'open' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Menunggu Bayar</span>}
                              {t.status === 'waiting_confirmation' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 animate-pulse">Butuh Konfirmasi</span>}
                              {t.status === 'success' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Selesai</span>}
                              {t.status === 'canceled' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">Batal</span>}
                            </div>
                            <p className="text-xs text-gray-400 mt-1"><span className="text-cyan-400">{t.product_name}</span> • Rp {Number(t.price).toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Klik untuk Buka <Send size={12}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                // UI CHAT ROOM (ADMIN VIEW)
                <div className="bg-[#101014] border border-[#3d3d3d] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl relative h-[600px]">
                  
                  {/* Header Chat Admin */}
                  <div className="p-4 border-b border-[#3d3d3d]/50 bg-[#1a1a24] flex justify-between items-center z-10 shadow-md">
                    <div>
                      <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                        TIKET: <span className="text-cyan-400">{selectedAdminTicket.ticket_code}</span>
                      </h3>
                      <p className="text-xs text-gray-400">Pembeli: {selectedAdminTicket.username} | Item: {selectedAdminTicket.product_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedAdminTicket.status !== 'success' && selectedAdminTicket.status !== 'canceled' && (
                        <div className="flex gap-2 mr-4">
                          <button onClick={() => handleAdminTicketAction('canceled')} className="px-3 py-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors border border-red-500/20">Tolak / Batal</button>
                          <button onClick={() => handleAdminTicketAction('success')} className="px-3 py-1.5 bg-green-500 text-black hover:bg-green-400 rounded-lg text-xs font-bold transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)]">Konfirmasi Lunas</button>
                        </div>
                      )}
                      <button onClick={() => setSelectedAdminTicket(null)} className="text-gray-400 hover:text-white p-1.5 bg-[#0f0f13] rounded-full border border-gray-700"><X size={20} /></button>
                    </div>
                  </div>
                  
                  {/* Pesan Chat */}
                  <div ref={adminScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0d0d0f] to-[#121215]">
                    {adminChatMessages.map((msg, i) => (
                      <div key={i} className={`flex flex-col ${msg.sender_type === 'admin' ? 'items-end' : 'items-start'}`}>
                        {msg.sender_type === 'system_invoice' ? (
                           <div className="w-full bg-[#1a1a24] border border-[#3d3d3d] rounded-xl p-4 mb-2">
                             <p className="text-xs text-cyan-400 font-bold mb-1">SYSTEM</p>
                             <p className="text-sm text-white">Sistem telah mengirimkan Invoice dan Barcode QRIS kepada Player senilai Rp {Number(selectedAdminTicket.price).toLocaleString('id-ID')}.</p>
                           </div>
                        ) : msg.sender_type === 'system' ? (
                          <div className="w-full flex justify-center my-2">
                            <div className="bg-gray-800/50 text-gray-300 text-xs px-3 py-1.5 rounded-full border border-gray-700/50">{msg.message}</div>
                          </div>
                        ) : (
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.sender_type === 'admin' ? 'bg-[#1e293b] border border-cyan-500/30 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'}`}>
                            <p className="text-xs font-bold mb-1 opacity-50">{msg.sender_type === 'admin' ? 'Anda (Admin)' : 'Player'}</p>
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input Chat Admin */}
                  <div className="p-4 bg-[#1a1a24] border-t border-[#3d3d3d]/50">
                    <div className="flex gap-2 items-center bg-[#0f0f13] border border-gray-700 rounded-xl p-1.5 focus-within:border-cyan-500 transition-colors">
                      <input 
                        type="text" 
                        value={adminChatInput} 
                        onChange={e => setAdminChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendAdminMessage()}
                        placeholder={selectedAdminTicket.status === 'canceled' || selectedAdminTicket.status === 'success' ? "Tiket ditutup. Tidak bisa membalas." : "Balas pesan player..."}
                        disabled={selectedAdminTicket.status === 'canceled' || selectedAdminTicket.status === 'success'}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white px-3 disabled:opacity-50"
                      />
                      <button 
                        onClick={sendAdminMessage}
                        disabled={!adminChatInput.trim() || selectedAdminTicket.status === 'canceled' || selectedAdminTicket.status === 'success'}
                        className="p-2.5 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:bg-gray-700 transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}