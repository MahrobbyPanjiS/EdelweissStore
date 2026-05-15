// [code lama + code hasil pembaharuan = code update]
import React, { useState, useEffect, useRef } from 'react';
import { User, Wallet, Calendar, CreditCard, ShoppingBag, LifeBuoy, Bell, Lock, Save, ArrowRight, CheckCircle2, Mail, Image as ImageIcon, History, XCircle, Clock, Crown } from 'lucide-react';
import { SkinViewer, IdleAnimation, WalkingAnimation, RunningAnimation, FlyingAnimation } from 'skinview3d';

export default function Profile() {
  // --- LOGIKA PERSISTENCE (LOKAL) ---
  // Menyimpan data tampilan dan URL skin menggunakan LocalStorage agar tidak hilang saat di-refresh
  const savedViewMode = localStorage.getItem('viewMode') as 'login' | 'register' | 'view' || 'login';
  const savedSkinUrl = localStorage.getItem('userSkin') || "https://minotar.net/skin/Steve";

  const [viewMode, setViewMode] = useState<'login' | 'register' | 'view'>(savedViewMode);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [notif, setNotif] = useState(true);

  // State khusus untuk Skin dengan data awal ditarik dari LocalStorage
  const [skinUrl, setSkinUrl] = useState(savedSkinUrl);
  const [inputPremiumName, setInputPremiumName] = useState("");
  const [inputCustomUrl, setInputCustomUrl] = useState("");
  
  // State untuk mengontrol animasi 3D karakter (Ditambah opsi 'spin')
  const [skinAnimation, setSkinAnimation] = useState<'idle' | 'walk' | 'run' | 'fly' | 'spin'>('idle');

  // Referensi untuk merender kanvas 3D
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewer | null>(null);

  // Simulasi data pemain beserta riwayat transaksi sesuai pembaruan metrik
  const userData = {
    username: "Mahrobby",
    role: "Verified Member",
    roleColor: "text-emerald-400",
    roleBg: "bg-emerald-400/10",
    balance: 1500000,
    joinDate: "12 Januari 2026",
    email: "mahrobby@example.com",
    stats: [
      { label: "Total TopUp", value: "Rp 1.500k", icon: <CreditCard size={18} /> },
      { label: "Rank", value: "Celestial", icon: <Crown size={18} /> },
      { label: "Item di beli", value: "2", icon: <ShoppingBag size={18} /> },
      { label: "Ticket Bantuan", value: "0", icon: <LifeBuoy size={18} /> },
    ],
    transactions: [
      { id: "INV-EC-001", date: "15 Mei 2026", item: "Top-Up Saldo Web", amount: 1500000, status: "success" },
      { id: "INV-EC-002", date: "14 Mei 2026", item: "Mytic Rank", amount: 75000, status: "success" },
      { id: "INV-EC-003", date: "10 Mei 2026", item: "Paket Diamond", amount: 25000, status: "pending" },
      { id: "INV-EC-004", date: "05 Mei 2026", item: "Zombie Spawner", amount: 35000, status: "failed" },
    ]
  };

  // Efek samping untuk menyimpan status mode login secara dinamis
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Efek samping untuk inisialisasi dan memuat SkinViewer 3D
  useEffect(() => {
    if (viewMode === 'view' && canvasRef.current) {
      if (!viewerRef.current) {
        // Pembuatan instansi penampil SkinViewer
        viewerRef.current = new SkinViewer({
          canvas: canvasRef.current,
          width: 250,
          height: 350,
          skin: skinUrl
        });
        viewerRef.current.controls.enableRotate = true;
        viewerRef.current.controls.enableZoom = false; 
        viewerRef.current.autoRotate = true;
        viewerRef.current.autoRotateSpeed = 0.5;
        
        // Memuat animasi default saat pertama kali dimuat
        viewerRef.current.animation = new IdleAnimation();
      } else {
        // Memperbarui tekstur 3D secara asinkron jika tautan diubah oleh pengguna
        viewerRef.current.loadSkin(skinUrl).catch(() => {
          viewerRef.current?.loadSkin("https://minotar.net/skin/Steve");
        });
      }
    }
  }, [viewMode, skinUrl]);

  // Efek samping khusus untuk mendengarkan perubahan pada menu pilihan animasi
  useEffect(() => {
    if (viewerRef.current) {
      try {
        // Kembalikan kecepatan rotasi ke standar setiap kali animasi diganti
        viewerRef.current.autoRotateSpeed = 0.5;

        // Menerapkan instance animasi baru secara langsung sesuai perubahan state
        if (skinAnimation === 'walk') {
          viewerRef.current.animation = new WalkingAnimation();
        } else if (skinAnimation === 'run') {
          viewerRef.current.animation = new RunningAnimation();
        } else if (skinAnimation === 'fly') {
          viewerRef.current.animation = new FlyingAnimation();
        } else if (skinAnimation === 'spin') {
          // Akal-akalan untuk efek spin: Gunakan animasi idle tapi rotasi dipercepat drastis
          viewerRef.current.animation = new IdleAnimation();
          viewerRef.current.autoRotateSpeed = 5.0; 
        } else {
          viewerRef.current.animation = new IdleAnimation();
        }
      } catch (error) {
        // Penanganan error agar halaman tidak memutih jika terjadi kegagalan modul animasi
        console.error("Terdapat kesalahan saat memuat modul animasi:", error);
      }
    }
  }, [skinAnimation]);

  // Fungsi untuk menerapkan Skin menggunakan API premium
  const handleSkinPremium = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPremiumName.trim() !== "") {
      const newUrl = `https://minotar.net/skin/${inputPremiumName}`;
      setSkinUrl(newUrl);
      localStorage.setItem('userSkin', newUrl);
      alert(`Skin ${inputPremiumName} berhasil dipasang permanen di peramban ini!`);
      setInputPremiumName("");
    }
  };

  // Fungsi untuk menerapkan Skin menggunakan URL kustom
  const handleSkinUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCustomUrl.trim() !== "") {
      setSkinUrl(inputCustomUrl);
      localStorage.setItem('userSkin', inputCustomUrl);
      alert("Skin URL kustom berhasil dipasang permanen!");
      setInputCustomUrl("");
    }
  };

  // Fungsi untuk keluar dari sesi akun
  const handleLogout = () => {
    localStorage.removeItem('viewMode');
    setViewMode('login');
    window.location.reload(); 
  };

  // --- TAMPILAN 1: MASUK AKUN (LOGIN) ---
  if (viewMode === 'login') {
    return (
      <div className="max-w-md mx-auto py-24 px-6 animate-in fade-in duration-500">
        <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Masuk Akun</h1>
            <p className="text-gray-400 text-sm">Portal Web Edelweiss Craft</p>
          </div>
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setViewMode('view'); }}>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input type="text" placeholder="Username / Email" className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-cyan-500 outline-none" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input type="password" placeholder="Password" className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-cyan-500 outline-none" required />
            </div>
            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95">
              Masuk Sekarang <ArrowRight size={18} />
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Belum punya akun? <button onClick={() => setViewMode('register')} className="text-cyan-500 font-bold">Daftar di sini</button>
          </p>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 2: DAFTAR AKUN (REGISTER) ---
  if (viewMode === 'register') {
    return (
      <div className="max-w-md mx-auto py-16 px-6 animate-in fade-in duration-500">
        <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Buat Akun Baru</h1>
            <p className="text-gray-400 text-sm">Daftarkan akun web lo di sini</p>
          </div>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setViewMode('view'); }}>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input type="text" placeholder="Username" className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 outline-none" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input type="password" placeholder="Password Baru" className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 outline-none" required />
            </div>
            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input type="password" placeholder="Konfirmasi Password" className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-emerald-500 outline-none" required />
            </div>
            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4">
              Daftar & Masuk <ArrowRight size={18} />
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Sudah punya akun? <button onClick={() => setViewMode('login')} className="text-emerald-500 font-bold">Masuk di sini</button>
          </p>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 3: DASBOR PROFIL (TELAH MASUK) ---
  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Avatar Karakter & Informasi Dasar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="relative flex justify-center w-full min-h-[300px] mb-2">
              <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>
              {/* Kanvas untuk merender tampilan 3D dari skin pemain */}
              <canvas ref={canvasRef} className="relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] cursor-grab active:cursor-grabbing"></canvas>
            </div>
            
            {/* Opsi Pemilihan Animasi Karakter */}
            <div className="mb-6 w-full px-4">
              <select 
                value={skinAnimation}
                onChange={(e) => setSkinAnimation(e.target.value as any)}
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-cyan-500 cursor-pointer text-center"
              >
                <option value="idle">Animasi: Berdiri (Idle)</option>
                <option value="walk">Animasi: Berjalan (Walk)</option>
                <option value="run">Animasi: Berlari (Run)</option>
                <option value="fly">Animasi: Terbang (Elytra Pose)</option>
                <option value="spin">Animasi: Berputar (Spin)</option>
              </select>
            </div>

            <h1 className="text-2xl font-bold mb-1">{userData.username}</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border border-current ${userData.roleColor} ${userData.roleBg}`}>{userData.role}</div>
          </div>
          
          {/* Detail Informasi Finansial & Akun */}
          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 space-y-4 text-sm">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <span className="text-gray-400 flex items-center gap-2"><Wallet size={16}/> Saldo Web</span>
              <span className="text-green-400 font-bold text-base">Rp {userData.balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-2"><Mail size={16}/> Email</span>
              <span className="text-white truncate max-w-[150px]">{userData.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 flex items-center gap-2"><Calendar size={16}/> Bergabung</span>
              <span className="text-white">{userData.joinDate}</span>
            </div>
            <button onClick={handleLogout} className="w-full mt-4 py-2.5 text-sm font-bold text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors">
              Logout / Keluar Akun
            </button>
          </div>
        </div>

        {/* Kolom Kanan: Navigasi Konten Detail */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tab Navigasi Antarmuka */}
          <div className="flex gap-2 p-1 bg-[#1e293b]/30 border border-gray-800 rounded-xl w-fit">
            <button onClick={() => setActiveTab('overview')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}>Statistik & Riwayat</button>
            <button onClick={() => setActiveTab('settings')} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}>Pengaturan Akun</button>
          </div>

          {/* Tab Konten 1: Ringkasan Statistik & Riwayat Pembelian */}
          {activeTab === 'overview' ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
              
              {/* Seksi Metrik Utama (4 Kotak Informatif) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userData.stats.map((s, i) => (
                  <div key={i} className="bg-[#1e293b]/20 border border-gray-800 rounded-2xl p-5 flex flex-col items-center justify-center gap-2">
                    <div className="text-cyan-400">{s.icon}</div>
                    <div className="text-xl font-bold">{s.value}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest text-center leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Seksi Riwayat Daftar Transaksi */}
              <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-800 font-bold text-white flex items-center gap-2">
                  <History className="text-cyan-400" size={18}/> Riwayat Transaksi Terakhir
                </div>
                
                <div className="divide-y divide-gray-800/50">
                  {userData.transactions.map((trx, i) => (
                    <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                      <div className="flex items-start gap-4">
                        {/* Ikon Representasi Status Transaksi */}
                        <div className="mt-0.5">
                          {trx.status === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
                          {trx.status === 'pending' && <Clock className="text-yellow-500" size={20} />}
                          {trx.status === 'failed' && <XCircle className="text-red-500" size={20} />}
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1">{trx.item}</div>
                          <div className="text-xs text-gray-400 font-mono">{trx.id} • {trx.date}</div>
                        </div>
                      </div>
                      
                      {/* Informasi Harga dan Lencana Penanda Status */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto">
                        <div className="font-bold text-white mb-1">Rp {trx.amount.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border
                          ${trx.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                            trx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                            'bg-red-500/10 text-red-400 border-red-500/20'}`}
                        >
                          {trx.status === 'success' ? 'Berhasil' : trx.status === 'pending' ? 'Menunggu Pembayaran' : 'Gagal / Dibatalkan'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            
            // Tab Konten 2: Panel Pengaturan Keamanan & Kustomisasi
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><ImageIcon size={18} className="text-cyan-400"/> Penampilan (Ganti Skin)</h3>
                <div className="space-y-6">
                  <form onSubmit={handleSkinPremium}>
                    <label className="text-xs text-gray-500 block mb-2 uppercase font-bold">Nama Akun Premium</label>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Contoh: Dream" value={inputPremiumName} onChange={(e) => setInputPremiumName(e.target.value)} className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500" />
                      <button type="submit" className="bg-cyan-500 text-black px-6 rounded-xl text-sm font-bold">Simpan</button>
                    </div>
                  </form>
                  <form onSubmit={handleSkinUrl}>
                    <label className="text-xs text-gray-500 block mb-2 uppercase font-bold">URL Custom (.png)</label>
                    <div className="flex gap-2">
                      <input type="url" placeholder="https://..." value={inputCustomUrl} onChange={(e) => setInputCustomUrl(e.target.value)} className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-cyan-500" />
                      <button type="submit" className="bg-cyan-500 text-black px-6 rounded-xl text-sm font-bold">Simpan URL</button>
                    </div>
                  </form>
                </div>
              </section>

              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Bell size={18} className="text-cyan-400"/> Notifikasi</h3>
                <div className="flex justify-between items-center text-sm">
                  <span>Notifikasi Promo & Diskon</span>
                  <button onClick={() => setNotif(!notif)} className={`w-10 h-5 rounded-full relative transition-colors ${notif ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notif ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>
              </section>
              
              <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Lock size={18} className="text-cyan-400"/> Keamanan</h3>
                <input type="password" placeholder="Password Baru" className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl px-4 py-3 text-sm mb-4 outline-none focus:border-cyan-500" />
                <button className="bg-[#1e293b] text-white px-6 py-2 rounded-xl text-sm border border-gray-700 hover:bg-gray-700 transition-colors">Update Password</button>
              </section>
              
              <button className="w-full bg-cyan-500 text-black hover:bg-cyan-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"><Save size={20}/> Simpan Perubahan Akun</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}