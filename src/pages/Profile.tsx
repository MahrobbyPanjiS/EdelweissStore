// [code lama + code hasil pembaharuan = code update]
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Calendar, History, Crown, Loader2, ImageIcon, Bell, User, LogIn, UserPlus, MapPin } from 'lucide-react';
import { SkinViewer, IdleAnimation, WalkingAnimation } from 'skinview3d';
import supabase from '../lib/supabaseClient';
import { useNotif } from '../context/NotifContext';

interface UserData {
  username: string;
  email: string;
  role: string;
  kota: string;
  skin_url: string;
  createdAt: string;
}

interface TicketHistory {
  id: string;
  ticket_code: string;
  product_name: string;
  price: number;
  status: 'open' | 'waiting_confirmation' | 'success' | 'canceled';
  created_at: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [ticketHistory, setTicketHistory] = useState<TicketHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(true);

  const [skinUrl, setSkinUrl] = useState("https://minotar.net/skin/Steve");
  const [inputPremiumName, setInputPremiumName] = useState("");
  const skinContainerRef = useRef<HTMLDivElement>(null);
  const { showNotif } = useNotif();

  // Fungsi pembantu formal untuk memformat tanggal tiket dengan aman dari ancaman RangeError
  const formatTicketDate = (dateStr: string) => {
    if (!dateStr) return 'Tanggal tidak tersedia';
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? 'Tanggal tidak valid' : parsedDate.toLocaleString('id-ID');
  };

  useEffect(() => {
    const fetchUserDataAndHistory = async () => {
      try {
        setLoading(true);
        // Memeriksa status login dari localStorage berdasarkan sistem Google Apps Script
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const localUserStr = localStorage.getItem('currentUser');

        if (isLoggedIn === 'true' && localUserStr) {
          const localUser = JSON.parse(localUserStr);
          const currentUsername = localUser.username;

          // Mengambil data profil tambahan dari tabel public.profiles di Supabase
          const { data: profileData, error: profileErr } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', currentUsername)
            .single();

          // Memaksa pengaturan status pengguna (currentUser) meskipun data profil tidak ditemukan.
          // Hal ini mencegah layar "Belum Masuk Sesi" jika terjadi kegagalan sinkronisasi tabel.
          setCurrentUser({
            username: currentUsername,
            email: '', // Dikosongkan karena sistem baru tidak membutuhkan surel
            role: profileData?.role || 'player',
            kota: profileData?.kota || 'Tidak diatur',
            skin_url: profileData?.skin_url || 'https://minotar.net/skin/Steve',
            createdAt: profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Baru Saja Bergabung'
          });

          // Mengatur URL skin 3D sesuai dengan data yang ditemukan
          if (profileData?.skin_url) {
            setSkinUrl(profileData.skin_url);
          }

          // Mengambil riwayat transaksi tiket pengguna hanya jika identitas (ID) Supabase ditemukan
          if (profileData && profileData.id) {
            const { data: tickets, error: ticketErr } = await supabase
              .from('tickets')
              .select('id, ticket_code, product_name, price, status, created_at')
              .eq('user_id', profileData.id)
              .order('created_at', { ascending: false });

            if (!ticketErr && tickets) {
              setTicketHistory(tickets as TicketHistory[]);
            }
          }
        }
      } catch (err) {
        console.error('Kesalahan saat memuat data profil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndHistory();
  }, []);

  // Efek Hook untuk memuat 3D Skin Viewer dengan proteksi blok try...catch komprehensif
  useEffect(() => {
    if (!skinContainerRef.current || loading || !currentUser) return;

    try {
      skinContainerRef.current.innerHTML = '';

      const viewer = new SkinViewer({
        canvas: document.createElement('canvas'),
        width: 220,
        height: 320,
        skin: skinUrl
      });

      skinContainerRef.current.appendChild(viewer.canvas);
      
      // Memperbaiki pemanggilan API skinview3d: Menggunakan properti 'animation' (tanpa 's') dan menginisialisasi kelas animasi baru
      if (IdleAnimation) {
        viewer.animation = new IdleAnimation();
      }
      // Jika ingin menggunakan animasi berjalan, Anda dapat menghapus komentar pada baris di bawah ini dan mengomentari baris IdleAnimation di atas
      // if (WalkingAnimation) {
      //   viewer.animation = new WalkingAnimation();
      // }
      
      viewer.autoRotate = true;
      viewer.autoRotateSpeed = 0.5;

      return () => {
        viewer.dispose();
      };
    } catch (skinError) {
      console.error('Gagal menginisialisasi 3D Skin Viewer secara aman:', skinError);
    }
  }, [skinUrl, loading, currentUser]);

  const handleApplyPremiumSkin = async () => {
    if (!inputPremiumName.trim()) return showNotif('Masukkan nama premium terlebih dahulu!', 'error');
    if (!currentUser) return;
    
    let newUrl = inputPremiumName.startsWith('http') ? inputPremiumName.trim() : `https://minotar.net/skin/${inputPremiumName.trim()}`;
    
    // Memperbarui tampilan skin secara lokal pada antarmuka
    setSkinUrl(newUrl);
    
    // Menyimpan pembaruan URL skin secara permanen ke tabel profiles di Supabase
    await supabase
      .from('profiles')
      .update({ skin_url: newUrl })
      .eq('username', currentUser.username);
    
    showNotif('Skin premium berhasil diperbarui!', 'success');
    setInputPremiumName('');
  };

  const totalSpent = ticketHistory
    .filter(t => t.status === 'success')
    .reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-cyan-400" size={40} />
        <p className="text-sm text-gray-400">Memuat profil Edelweiss lo...</p>
      </div>
    );
  }

  // Jika state currentUser tetap null, tampilkan layar permintaan masuk
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 animate-in fade-in duration-500">
        <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">Lo Belum Masuk Sesi</h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Silakan masuk atau daftar akun web dulu buat ngelihat data profil, ganti skin 3D, dan ngelacak riwayat pembelian lo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/login" className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black px-6 py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(34,211,238,0.3)] text-sm">
              <LogIn size={18} /> Masuk Akun
            </Link>
            <Link to="/register" className="w-full sm:w-auto min-w-[160px] flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-gray-700 text-white font-bold px-6 py-3.5 rounded-xl border border-gray-700 transition-all text-sm">
              <UserPlus size={18} /> Daftar Baru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* PANEL KIRI: PREVIEW SKIN & IDENTITAS */}
        <div className="lg:w-1/3 bg-[#1e293b]/20 border border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[450px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          
          <div className="legendary-indicator mb-4 z-10 flex items-center gap-1.5 capitalize">
            <Crown size={12} className="text-yellow-400 fill-yellow-400" /> {currentUser.role} Account
          </div>

          <div ref={skinContainerRef} className="w-[220px] h-[320px] mb-4 bg-[#0f0f13]/60 border border-gray-800 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner relative">
            <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none"></div>
          </div>

          <h2 className="text-2xl font-black text-white tracking-wide uppercase">{currentUser.username}</h2>
          
          {/* Menampilkan Asal Kota di bawah nama */}
          <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-2 font-medium">
            <MapPin size={14} className="text-cyan-400" /> {currentUser.kota}
          </div>
        </div>

        {/* PANEL KANAN: KONTEN */}
        <div className="flex-grow lg:w-2/3 space-y-6">
          <div className="flex gap-2 border-b border-gray-800 pb-3">
            <button onClick={() => setActiveTab('overview')} className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${activeTab === 'overview' ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'}`}>Ringkasan Akun</button>
            <button onClick={() => setActiveTab('settings')} className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${activeTab === 'settings' ? 'bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'}`}>Pengaturan Profil</button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0f0f13] border border-gray-800 p-5 rounded-2xl flex items-center justify-between transition-colors">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pengeluaran Web</p>
                    <h3 className="text-xl font-black text-green-400">Rp {totalSpent.toLocaleString('id-ID')}</h3>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><Wallet size={20}/></div>
                </div>
                <div className="bg-[#0f0f13] border border-gray-800 p-5 rounded-2xl flex items-center justify-between transition-colors">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Bergabung Sejak</p>
                    <h3 className="text-sm font-black text-white">{currentUser.createdAt}</h3>
                  </div>
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400"><Calendar size={20}/></div>
                </div>
              </div>

              <div className="bg-[#1e293b]/10 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><History size={18} className="text-cyan-400"/> Riwayat Transaksi Nyata</h3>
                <div className="space-y-3">
                  {ticketHistory.length > 0 ? (
                    ticketHistory.map((ticket) => (
                      <div key={ticket.id} className="bg-[#0f0f13] p-4 rounded-xl border border-gray-800 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-white">{ticket.ticket_code}</span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-xs text-gray-400 uppercase font-semibold">{ticket.product_name}</span>
                          </div>
                          {/* Penerapan pemformatan tanggal aman untuk mencegah kegagalan fatal rendering */}
                          <p className="text-[10px] text-gray-600 mt-1">{formatTicketDate(ticket.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white mb-1">Rp {Number(ticket.price).toLocaleString('id-ID')}</p>
                          {ticket.status === 'success' && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">Selesai</span>}
                          {ticket.status === 'open' && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">Menunggu Bayar</span>}
                          {ticket.status === 'waiting_confirmation' && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">Dicek Admin</span>}
                          {ticket.status === 'canceled' && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">Batal</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-[#0f0f13]/40 rounded-xl border border-dashed border-gray-800 text-xs">
                      Belum ada riwayat transaksi di akun ini.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <section className="bg-[#1e293b]/10 border border-gray-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base flex items-center gap-2"><ImageIcon size={18} className="text-cyan-400"/> Sinkronisasi Avatar Skin</h3>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Ganti URL Gambar / Nick Premium</label>
                  <div className="flex gap-2">
                    <input type="text" value={inputPremiumName} onChange={(e) => setInputPremiumName(e.target.value)} placeholder="Contoh URL atau Nick..." className="flex-1 bg-[#0f0f13] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500" />
                    <button onClick={handleApplyPremiumSkin} className="bg-cyan-500 text-black font-bold px-4 py-2 rounded-xl text-xs hover:bg-cyan-400 transition-colors">Terapkan</button>
                  </div>
                </div>
              </section>

              <section className="bg-[#1e293b]/10 border border-gray-800 rounded-2xl p-6 flex justify-between items-center text-sm">
                <h3 className="font-bold flex items-center gap-2"><Bell size={18} className="text-cyan-400"/> Notifikasi Sistem</h3>
                <button onClick={() => setNotif(!notif)} className={`w-10 h-5 rounded-full relative transition-colors ${notif ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notif ? 'left-6' : 'left-1'}`}></div>
                </button>
              </section>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}