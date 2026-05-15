// [code lama + code hasil pembaharuan = code update]
import React, { useState } from 'react';
import { ShieldAlert, Server, Activity, Megaphone, Users, Power, Save } from 'lucide-react';

export default function Settings() {
  // Simulasi state buat fitur-fitur panel kontrol Admin
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [whitelistMode, setWhitelistMode] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      
      {/* Header Dashboard Admin */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-500/20 rounded-2xl">
            <ShieldAlert className="text-red-400" size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-red-400/80 text-sm">Control Panel Utama Website & Server Edelweiss Craft</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#0f0f13] px-4 py-2 rounded-xl border border-gray-800">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-mono text-gray-400">System: <span className="text-green-500">Online</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Quick Stats & Server Control */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Server size={18} className="text-cyan-400" /> Kontrol Server
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Maintenance Mode</p>
                  <p className="text-xs text-gray-500">Matikan akses web untuk player.</p>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-red-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Whitelist Mode</p>
                  <p className="text-xs text-gray-500">Hanya player terdaftar yang bisa login.</p>
                </div>
                <button 
                  onClick={() => setWhitelistMode(!whitelistMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${whitelistMode ? 'bg-yellow-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${whitelistMode ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-800">
              <button className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                <Power size={18} /> Restart Web Server
              </button>
            </div>
          </div>

          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity size={18} className="text-cyan-400" /> Statistik Cepat
            </h3>
            <div className="space-y-4">
              <div className="bg-[#0f0f13] p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Player Web</span>
                <span className="font-bold text-cyan-400 font-mono">1,402</span>
              </div>
              <div className="bg-[#0f0f13] p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-400">Transaksi (Bulan ini)</span>
                <span className="font-bold text-green-400 font-mono">Rp 4.250k</span>
              </div>
              <div className="bg-[#0f0f13] p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <span className="text-sm text-gray-400">Tiket Bantuan Aktif</span>
                <span className="font-bold text-red-400 font-mono">3</span>
              </div>
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Pengumuman & Manajemen */}
        <div className="lg:col-span-2 space-y-6">
          
          <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Megaphone size={18} className="text-cyan-400" /> Broadcast Pengumuman
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Buat pengumuman baru yang akan muncul di halaman beranda (Home) semua player.</p>
              <input 
                type="text" 
                placeholder="Judul Pengumuman..." 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <textarea 
                rows={4}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Isi detail pengumuman patch, event, atau maintenance di sini..." 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-transform active:scale-95">
                  <Megaphone size={16} /> Publish Berita
                </button>
              </div>
            </div>
          </section>

          <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Users size={18} className="text-cyan-400" /> Manajemen Web Store
            </h3>
            <p className="text-sm text-gray-400 mb-4">Akses cepat untuk memodifikasi katalog harga rank dan item di Web Store.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-[#0f0f13] border border-gray-800 hover:border-cyan-500 text-left p-4 rounded-xl transition-all group">
                <div className="font-bold text-white group-hover:text-cyan-400 mb-1">Edit Harga Rank</div>
                <div className="text-xs text-gray-500">Ubah harga Celestial, Edelweiss, dll.</div>
              </button>
              <button className="bg-[#0f0f13] border border-gray-800 hover:border-cyan-500 text-left p-4 rounded-xl transition-all group">
                <div className="font-bold text-white group-hover:text-cyan-400 mb-1">Tambah Promo/Diskon</div>
                <div className="text-xs text-gray-500">Buat kode kupon potongan harga.</div>
              </button>
            </div>
          </section>

          <button className="w-full bg-[#1e293b] hover:bg-gray-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 border border-gray-600">
            <Save size={20} /> Simpan Konfigurasi Server
          </button>

        </div>
      </div>
    </div>
  );
}