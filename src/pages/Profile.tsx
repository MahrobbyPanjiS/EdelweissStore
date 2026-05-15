import React from 'react';
import { User, Wallet, Shield, Calendar, Sword, Award } from 'lucide-react';

export default function Profile() {
  // Simulasi data player (Nanti bisa lo konekin ke API Backend/Database)
  const userData = {
    username: "Mahrobby",
    rank: "Celestial",
    rankColor: "text-purple-400",
    rankBg: "bg-purple-400/10",
    balance: 1500000,
    joinDate: "12 Januari 2026",
    clan: "NEC (Neo Edelweiss Clan)",
    stats: [
      { label: "Kills", value: "1,240", icon: <Sword size={18} /> },
      { label: "Deaths", value: "312", icon: <Shield size={18} /> },
      { label: "Achievements", value: "45/50", icon: <Award size={18} /> },
    ]
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>
              {/* Menggunakan API mc-heads buat nampilin badan skin Minecraft */}
              <img 
                src={`https://mc-heads.net/body/player/${userData.username}`} 
                alt="Minecraft Skin" 
                className="relative z-10 w-32 h-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              />
            </div>
            <h1 className="text-2xl font-bold mb-1">{userData.username}</h1>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border border-current ${userData.rankColor} ${userData.rankBg}`}>
              {userData.rank}
            </div>
          </div>

          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Wallet size={18} /> <span>Balance</span>
              </div>
              <span className="font-bold text-green-400">Rp {userData.balance.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Calendar size={18} /> <span>Joined</span>
              </div>
              <span className="font-medium text-gray-200">{userData.joinDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Shield size={18} /> <span>Clan</span>
              </div>
              <span className="font-medium text-cyan-400">{userData.clan}</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Stats & History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userData.stats.map((stat, idx) => (
              <div key={idx} className="bg-[#1e293b]/20 border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-2">
                <div className="text-cyan-400">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <User size={18} className="text-cyan-400" /> Aktivitas Terakhir
              </h3>
            </div>
            <div className="divide-y divide-gray-800/50">
              {[
                "Membeli rank Celestial via Web Store",
                "Mengalahkan Boss Wither di Dunia Survival",
                "Melakukan setor pajak Clan NEC",
                "Mencapai Level XP 100"
              ].map((act, i) => (
                <div key={i} className="p-4 px-6 text-sm text-gray-400 hover:bg-white/5 transition-colors">
                  {act} <span className="float-right text-xs text-gray-600">{i + 1} hari yang lalu</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}