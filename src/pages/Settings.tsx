import React, { useState } from 'react';
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
  Edit3,
  DollarSign,
  Tag
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // ==========================================
  // STATE MANAJEMEN: SERVER & DASHBOARD
  // ==========================================
  const [serverConfig, setServerConfig] = useState({
    maintenance: false,
    whitelist: false
  });

  // ==========================================
  // STATE MANAJEMEN: BERANDA (SLIDER KOMUNITAS)
  // ==========================================
  const [slides, setSlides] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1605636715104-1b1567d1ab31?q=80&w=1000&auto=format&fit=crop" },
    { id: 2, url: "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=1000&auto=format&fit=crop" }
  ]);

  const handleAddSlide = () => {
    setSlides([...slides, { id: Date.now(), url: "" }]);
  };

  const handleUpdateSlide = (id: number, newUrl: string) => {
    setSlides(slides.map(slide => slide.id === id ? { ...slide, url: newUrl } : slide));
  };

  const handleDeleteSlide = (id: number) => {
    setSlides(slides.filter(slide => slide.id !== id));
  };

  // ==========================================
  // STATE MANAJEMEN: BERANDA (BERITA SERVER)
  // ==========================================
  const [news, setNews] = useState([
    { id: 1, title: "Migrasi Server ke 1.21.11", tag: "TERBARU", content: "Proses pembaruan versi server telah selesai. Seluruh pemain kini dapat menikmati stabilitas yang lebih baik." },
    { id: 2, title: "Sistem Manajemen Kuda Custom", tag: "SEGERA", content: "Tim pengembang sedang merancang plugin eksklusif dari nol untuk memberikan pengalaman manajemen mount." }
  ]);

  const handleAddNews = () => {
    setNews([...news, { id: Date.now(), title: "", tag: "INFO", content: "" }]);
  };

  const handleUpdateNews = (id: number, field: string, value: string) => {
    setNews(news.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDeleteNews = (id: number) => {
    setNews(news.filter(item => item.id !== id));
  };

  // ==========================================
  // STATE MANAJEMEN: STORE (KATALOG PRODUK)
  // ==========================================
  const [storeProducts, setStoreProducts] = useState([
    { id: 1, name: "Mytic Rank", price: 75000, category: "Rank", description: "Akses eksklusif ke fitur premium, kit mingguan, dan prefix [MYTIC]." },
    { id: 2, name: "Paket Diamond", price: 25000, category: "Item", description: "Mendapatkan 64x Diamond Block dan 1x Netherite Ingot." }
  ]);

  const handleAddProduct = () => {
    setStoreProducts([...storeProducts, { id: Date.now(), name: "", price: 0, category: "Item", description: "" }]);
  };

  const handleUpdateProduct = (id: number, field: string, value: string | number) => {
    setStoreProducts(storeProducts.map(product => product.id === id ? { ...product, [field]: value } : product));
  };

  const handleDeleteProduct = (id: number) => {
    setStoreProducts(storeProducts.filter(product => product.id !== id));
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
            { id: 'Pengaturan Server', icon: <Server size={18} /> }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                  : 'bg-[#1e293b]/30 text-gray-400 border border-gray-800 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.id}
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
              
              {/* Modul Kontrol Server Cepat */}
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
                    <button 
                      onClick={() => setServerConfig({...serverConfig, maintenance: !serverConfig.maintenance})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${serverConfig.maintenance ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${serverConfig.maintenance ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">Whitelist Mode</h4>
                      <p className="text-xs text-gray-500">Hanya player terdaftar yang bisa login.</p>
                    </div>
                    <button 
                      onClick={() => setServerConfig({...serverConfig, whitelist: !serverConfig.whitelist})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${serverConfig.whitelist ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${serverConfig.whitelist ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-3 rounded-xl font-bold transition-colors">
                  <Power size={18} /> Restart Web Server
                </button>
              </div>

              {/* Modul Statistik Cepat */}
              <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-cyan-400 mb-6">
                  <Activity size={20} /> Statistik Cepat
                </h3>
                <div className="space-y-3">
                  <div className="bg-[#0f0f13] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total Player Web</span>
                    <span className="font-bold text-cyan-400 text-lg">1,402</span>
                  </div>
                  <div className="bg-[#0f0f13] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-gray-400">Transaksi (Bulan Ini)</span>
                    <span className="font-bold text-green-400 text-lg">Rp 4.250k</span>
                  </div>
                  <div className="bg-[#0f0f13] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tiket Bantuan Aktif</span>
                    <span className="font-bold text-red-400 text-lg">3</span>
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
                  {slides.map((slide, index) => (
                    <div key={slide.id} className="flex flex-col sm:flex-row gap-4 bg-[#0f0f13] p-4 rounded-xl border border-gray-800">
                      {/* Image Preview */}
                      <div className="w-full sm:w-32 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                        {slide.url ? (
                          <img src={slide.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
                        )}
                      </div>
                      
                      {/* Input URL */}
                      <div className="flex-grow flex flex-col justify-center space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">URL Gambar (Imgur/Unsplash)</label>
                        <input 
                          type="text" 
                          value={slide.url}
                          onChange={(e) => handleUpdateSlide(slide.id, e.target.value)}
                          placeholder="https://contoh.com/gambar.jpg"
                          className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" 
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="flex items-center justify-end sm:justify-center">
                        <button 
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {slides.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-700">
                      Tidak ada slide. Klik "Tambah Slide" untuk memulai.
                    </div>
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

                <div className="space-y-6">
                  {news.map((item) => (
                    <div key={item.id} className="bg-[#0f0f13] p-5 rounded-xl border border-gray-800 relative group">
                      
                      {/* Delete News Button (Absolute Top Right) */}
                      <button 
                        onClick={() => handleDeleteNews(item.id)}
                        className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 opacity-0 group-hover:opacity-100"
                        title="Hapus Berita"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-12">
                        {/* Tag Selection */}
                        <div className="md:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori / Tag</label>
                          <select 
                            value={item.tag}
                            onChange={(e) => handleUpdateNews(item.id, 'tag', e.target.value)}
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none"
                          >
                            <option value="TERBARU">TERBARU</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                            <option value="EVENT">EVENT</option>
                            <option value="SEGERA">SEGERA (TEASER)</option>
                            <option value="INFO">INFO UMUM</option>
                          </select>
                        </div>
                        
                        {/* Title Input */}
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Judul Berita</label>
                          <input 
                            type="text" 
                            value={item.title}
                            onChange={(e) => handleUpdateNews(item.id, 'title', e.target.value)}
                            placeholder="Contoh: Update Survival 1.21"
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-bold" 
                          />
                        </div>

                        {/* Content Textarea */}
                        <div className="md:col-span-4 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Isi Konten Berita</span>
                            <span className="text-gray-600 font-normal">Gunakan kalimat yang jelas</span>
                          </label>
                          <textarea 
                            value={item.content}
                            onChange={(e) => handleUpdateNews(item.id, 'content', e.target.value)}
                            placeholder="Tulis detail pembaruan, event, atau informasi di sini..."
                            rows={3}
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-y" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {news.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-700">
                      Belum ada berita. Klik "Buat Berita" untuk menambahkan pengumuman.
                    </div>
                  )}
                </div>
              </section>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: MANAJEMEN STORE (KATALOG PRODUK) */}
          {/* ========================================================= */}
          {activeTab === 'Manajemen Store' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              
              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-800 pb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                      <Store className="text-cyan-400" size={24} /> Editor Katalog Store
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Kelola harga, deskripsi, dan daftar produk yang dijual di web store.</p>
                  </div>
                  <button onClick={handleAddProduct} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm">
                    <Plus size={18} /> Tambah Produk
                  </button>
                </div>

                <div className="space-y-6">
                  {storeProducts.map((product) => (
                    <div key={product.id} className="bg-[#0f0f13] p-5 rounded-xl border border-gray-800 relative group transition-colors hover:border-gray-600">
                      
                      {/* Delete Product Button */}
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 opacity-0 group-hover:opacity-100 z-10"
                        title="Hapus Produk"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pr-12">
                        
                        {/* Product Category */}
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Tag size={12}/> Kategori</label>
                          <select 
                            value={product.category}
                            onChange={(e) => handleUpdateProduct(product.id, 'category', e.target.value)}
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none"
                          >
                            <option value="Rank">Rank Premium</option>
                            <option value="Item">Item / Paket</option>
                            <option value="Kosmetik">Kosmetik</option>
                          </select>
                        </div>
                        
                        {/* Product Name */}
                        <div className="md:col-span-5 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Produk</label>
                          <input 
                            type="text" 
                            value={product.name}
                            onChange={(e) => handleUpdateProduct(product.id, 'name', e.target.value)}
                            placeholder="Contoh: Paket Diamond"
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-bold" 
                          />
                        </div>

                        {/* Product Price */}
                        <div className="md:col-span-4 space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><DollarSign size={12}/> Harga (Rp)</label>
                          <input 
                            type="number" 
                            value={product.price}
                            onChange={(e) => handleUpdateProduct(product.id, 'price', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-2 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500 font-bold" 
                          />
                        </div>

                        {/* Product Description */}
                        <div className="md:col-span-12 space-y-2 mt-2">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi Singkat</label>
                          <textarea 
                            value={product.description}
                            onChange={(e) => handleUpdateProduct(product.id, 'description', e.target.value)}
                            placeholder="Tuliskan benefit atau fasilitas dari produk ini..."
                            rows={2}
                            className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 resize-y" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {storeProducts.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-[#0f0f13] rounded-xl border border-dashed border-gray-700">
                      Katalog toko masih kosong. Klik "Tambah Produk" untuk mulai berjualan.
                    </div>
                  )}
                </div>
              </section>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PENGATURAN SERVER */}
          {/* ========================================================= */}
          {activeTab === 'Pengaturan Server' && (
            <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-12 text-center animate-in slide-in-from-right-4 duration-300">
              <Server className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Konfigurasi Inti</h3>
              <p className="text-sm text-gray-500">Fitur koneksi API RCON ke server Minecraft dan sinkronisasi database Supabase akan tersedia di sini.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
