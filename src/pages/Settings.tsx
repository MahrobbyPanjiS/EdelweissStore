import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Eye, Lock, Globe, Save } from 'lucide-react';

export default function Settings() {
  const [notif, setNotif] = useState(true);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="text-cyan-400" size={32} />
        <h1 className="text-4xl font-bold">Pengaturan</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          {['Akun', 'Tampilan', 'Privasi', 'Bahasa'].map((item, idx) => (
            <button 
              key={idx} 
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                idx === 0 ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Bell size={18} className="text-cyan-400" /> Preferensi Notifikasi
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notifikasi Discord</p>
                  <p className="text-xs text-gray-500">Kirim pemberitahuan saat item store masuk.</p>
                </div>
                <button 
                  onClick={() => setNotif(!notif)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notif ? 'bg-cyan-500' : 'bg-gray-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notif ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Email Pembaruan</p>
                  <p className="text-xs text-gray-500">Dapatkan info maintenance server lewat email.</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-gray-700 relative">
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"></div>
                </button>
              </div>
            </div>
          </section>

          <section className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Lock size={18} className="text-cyan-400" /> Keamanan Akun
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-2 uppercase tracking-widest font-bold">Ganti Password</label>
                <input 
                  type="password" 
                  placeholder="Password Baru" 
                  className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <button className="bg-[#1e293b] hover:bg-gray-700 text-white text-sm px-6 py-2.5 rounded-xl transition-colors">
                Update Password
              </button>
            </div>
          </section>

          <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95">
            <Save size={20} /> Simpan Semua Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}