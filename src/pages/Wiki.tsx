// [code lama + code hasil pembaharuan = code update]
import React, { useState } from 'react';
import { Book, Crown, ShieldAlert, Terminal, Star, ChevronDown, ChevronUp, Zap } from 'lucide-react';

export default function Wiki() {
  const [expandedRank, setExpandedRank] = useState<number | null>(null);

  // Data struktur warisan (Inheritance Data) untuk memudahkan mapping
  const dataWanderer = {
    from: "Wanderer",
    color: "text-gray-400",
    facilities: [
      "Bisa nge-klaim tanah",
      "Akses lelang: Auction House & QuickShop",
      "Akses Kit: Kit Wanderer"
    ],
    commands: [
      { cmd: "/warp", desc: "Akses teleportasi antar wilayah" },
      { cmd: "/ah", desc: "Akses sistem lelang pasar" },
      { cmd: "/shop", desc: "Buka menu toko virtual" },
      { cmd: "/buyclaimblocks", desc: "Beli blok klaim tanah" },
      { cmd: "/trash", desc: "Buka tong sampah portable" }
    ]
  };

  const dataExplorer = {
    from: "Explorer",
    color: "text-emerald-400",
    facilities: [
      "Limit Sethome: 3 Home",
      "Akses Kit: Kit Explorer",
      "Akses Warna: Chat Berwarna Dasar",
      "Akses Menu: Pengaturan UI (/settings)"
    ],
    commands: [
      { cmd: "/workbench", desc: "Akses meja crafting portable" },
      { cmd: "/hat", desc: "Memakai block apapun di kepala" },
      { cmd: "/loom", desc: "Akses alat tenun portable" },
      { cmd: "/stonecutter", desc: "Akses pemotong batu portable" },
      { cmd: "/settings", desc: "Mengatur tampilan antarmuka (UI)" }
    ]
  };

  const dataMercenary = {
    from: "Mercenary",
    color: "text-yellow-400",
    facilities: [
      "Limit Sethome: 5 Home",
      "Akses Kit: Kit Mercenary",
      "Spawner: Ambil spawner dgn Silk Touch"
    ],
    commands: [
      { cmd: "/ec", desc: "Akses Enderchest portable" },
      { cmd: "/clan create", desc: "Membuat klan/guild baru" },
      { cmd: "/grindstone", desc: "Penghapus enchant & repair" }
    ]
  };

  const dataConqueror = {
    from: "Conqueror",
    color: "text-red-400",
    facilities: [
      "Limit Sethome: 10 Home",
      "Akses Kit: Kit Conqueror"
    ],
    commands: [
      { cmd: "/feed", desc: "Mengisi rasa lapar mandiri" },
      { cmd: "/heal", desc: "Mengisi darah mandiri" },
      { cmd: "/nick", desc: "Mengganti nama samaran" },
      { cmd: "/anvil", desc: "Akses paron (anvil) portable" }
    ]
  };

  const dataEdelweiss = {
    from: "Edelweiss",
    color: "text-orange-500",
    facilities: [
      "Limit Sethome: 20 Home",
      "Akses Kit: Kit Edelweiss",
      "Akses Warna: RGB/Hex di chat"
    ],
    commands: [
      { cmd: "/fly", desc: "Terbang bebas di survival" },
      { cmd: "/repair", desc: "Memperbaiki alat di tangan" },
      { cmd: "/smithing", desc: "Akses meja tempa portable" },
      { cmd: "/cartographytable", desc: "Meja pemetaan portable" }
    ]
  };

  // Data Rank Utama
  const serverRanks = [
    {
      name: "Explorer",
      tier: "Tier I",
      status: "SEASONAL (1 SEASON)",
      color: "text-emerald-400",
      badgeBg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      description: "Diperuntukkan bagi kamu yang mulai serius menjelajah dan membangun kekayaan di dunia Edelweiss Craft.",
      facilities: dataExplorer.facilities,
      commands: dataExplorer.commands,
      inherited: [dataWanderer]
    },
    {
      name: "Mercenary",
      tier: "Tier II",
      status: "SEASONAL (1 SEASON)",
      color: "text-yellow-400",
      badgeBg: "bg-yellow-400/10",
      border: "border-yellow-400/20",
      description: "Diperuntukkan bagi para petarung yang butuh ruang penyimpanan ekstra dan mulai mementingkan gaya.",
      facilities: dataMercenary.facilities,
      commands: dataMercenary.commands,
      inherited: [dataExplorer, dataWanderer]
    },
    {
      name: "Conqueror",
      tier: "Tier III",
      status: "SEASONAL (1 SEASON)",
      color: "text-red-400",
      badgeBg: "bg-red-400/10",
      border: "border-red-400/20",
      description: "Rank veteran dengan fitur kemandirian penuh tanpa perlu repot pulang ke base.",
      facilities: dataConqueror.facilities,
      commands: dataConqueror.commands,
      inherited: [dataMercenary, dataExplorer, dataWanderer]
    },
    {
      name: "Edelweiss",
      tier: "Tier IV",
      status: "SEASONAL (1 SEASON)",
      color: "text-orange-500",
      badgeBg: "bg-orange-500/10",
      border: "border-orange-500/20",
      description: "Kasta tertinggi dengan keistimewaan mutlak. Jadilah legenda hidup di server ini!",
      facilities: dataEdelweiss.facilities,
      commands: dataEdelweiss.commands,
      inherited: [dataConqueror, dataMercenary, dataExplorer, dataWanderer]
    },
    {
      name: "Celestial",
      tier: "Tier V",
      status: "PERMANEN (LIFETIME)",
      color: "text-purple-400",
      badgeBg: "bg-purple-400/10",
      border: "border-purple-400/20",
      description: "Kasta tertinggi. Pemegang pangkat ini dianggap sebagai pelindung abadi server.",
      facilities: [
        "Limit Sethome: Unlimited (Tanpa Batas)",
        "Akses Kit: Kit Celestial (Godly)",
        "Slot Prioritas: Bisa masuk saat server penuh"
      ],
      commands: [
        { cmd: "/condense", desc: "Ubah item mentah ke block" },
        { cmd: "/near", desc: "Melihat player di sekitar" },
        { cmd: "/heal & /feed", desc: "Tanpa batas Cooldown" }
      ],
      inherited: [dataEdelweiss, dataConqueror, dataMercenary, dataExplorer, dataWanderer]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Book className="text-cyan-400" size={36} /> Panduan Server
        </h1>
        <p className="text-gray-400">Pahami aturan main dan jelajahi berbagai fitur eksklusif yang ada di Edelweiss Craft.</p>
      </div>
      
      <div className="space-y-8">
        
        {/* Aturan Dasar */}
        <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
            <ShieldAlert size={20} /> Aturan Dasar (Rules)
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm leading-relaxed">
            <li>Dilarang menggunakan cheat, mod ilegal, atau eksploitasi bug (X-Ray, AutoClicker, dll).</li>
            <li>Dilarang melakukan griefing atau mencuri barang di wilayah klaim milik pemain lain.</li>
            <li>Hormati semua pemain. Rasisme, SARA, dan pelecehan tidak ditoleransi.</li>
            <li>Dilarang melakukan spamming atau beriklan server lain di chat global.</li>
          </ul>
        </div>
        
        {/* Perintah Dasar */}
        <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
            <Terminal size={20} /> Perintah Penting (Commands)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800">
              <code className="text-green-400 font-mono text-sm block mb-1">/spawn</code>
              <p className="text-xs text-gray-400">Kembali ke area lobi utama server.</p>
            </div>
            <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800">
              <code className="text-green-400 font-mono text-sm block mb-1">/rtp</code>
              <p className="text-xs text-gray-400">Teleportasi acak ke dunia survival untuk mulai membangun.</p>
            </div>
            <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800">
              <code className="text-green-400 font-mono text-sm block mb-1">/sethome [nama]</code>
              <p className="text-xs text-gray-400">Menyimpan lokasi saat ini agar bisa diteleportasi kembali.</p>
            </div>
            <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800">
              <code className="text-green-400 font-mono text-sm block mb-1">/ah</code>
              <p className="text-xs text-gray-400">Membuka fitur lelang barang antar pemain.</p>
            </div>
          </div>
        </div>

        {/* Informasi Rank (Sesuai In-Game GUI) */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-white">Tingkatan Rank & Detail Fasilitas</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {serverRanks.map((rank, index) => (
              <div 
                key={index} 
                className={`bg-[#0f0f13] rounded-2xl border ${rank.border} overflow-hidden transition-all duration-300 ${expandedRank === index ? 'ring-1 ring-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : ''}`}
              >
                {/* Header Card Rank */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${rank.badgeBg}`}>
                      <Zap className={rank.color} size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-2xl font-bold ${rank.color}`}>{rank.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${rank.badgeBg} ${rank.color} border ${rank.border}`}>
                          {rank.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{rank.description}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setExpandedRank(expandedRank === index ? null : index)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                      expandedRank === index 
                        ? 'bg-cyan-500 text-black' 
                        : 'bg-[#1e293b] text-white hover:bg-gray-700'
                    }`}
                  >
                    {expandedRank === index ? 'Tutup Detail' : 'Lihat Semua Fitur'}
                    {expandedRank === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Konten Detail Expanded */}
                {expandedRank === index && (
                  <div className="px-6 pb-8 pt-2 border-t border-gray-800 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                      
                      {/* --- KOLOM KIRI: FASILITAS --- */}
                      <div className="bg-[#14141a] p-5 rounded-xl border border-gray-800/50">
                        <h4 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
                          <Star size={18} className={rank.color} /> Detail Fasilitas
                        </h4>
                        
                        <div className="space-y-5">
                          {/* Fasilitas Utama Rank Ini */}
                          <div>
                            <p className={`text-sm font-bold mb-2 flex items-center gap-2 ${rank.color}`}>
                              ❖ Fasilitas Utama:
                            </p>
                            <ul className="space-y-1.5 pl-2">
                              {rank.facilities.map((fac, i) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-gray-500 mt-0.5">»</span> 
                                  <span>{fac}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Fasilitas Warisan */}
                          {rank.inherited.map((inherit, i) => (
                            <div key={i}>
                              <p className={`text-sm font-bold mb-2 flex items-center gap-2 ${inherit.color}`}>
                                ❖ Bawaan ({inherit.from}):
                              </p>
                              <ul className="space-y-1.5 pl-2">
                                {inherit.facilities.map((ifac, j) => (
                                  <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-gray-500 mt-0.5">»</span> 
                                    <span>{ifac}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* --- KOLOM KANAN: COMMANDS --- */}
                      <div className="bg-[#14141a] p-5 rounded-xl border border-gray-800/50">
                        <h4 className="text-base font-bold text-white mb-6 flex items-center gap-2 border-b border-gray-800 pb-2">
                          <Terminal size={18} className={rank.color} /> Detail Commands
                        </h4>
                        
                        <div className="space-y-5">
                          {/* Command Utama Rank Ini */}
                          <div>
                            <p className={`text-sm font-bold mb-2 flex items-center gap-2 ${rank.color}`}>
                              ❖ Command Utama:
                            </p>
                            <ul className="space-y-1.5 pl-2">
                              {rank.commands.map((cmdItem, i) => (
                                <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                                  <span className="text-gray-500 mt-0.5">»</span> 
                                  <span><span className="text-yellow-400 font-mono">{cmdItem.cmd}</span> <span className="text-gray-500">-</span> {cmdItem.desc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Command Warisan */}
                          {rank.inherited.map((inherit, i) => (
                            <div key={i}>
                              <p className={`text-sm font-bold mb-2 flex items-center gap-2 ${inherit.color}`}>
                                ❖ Bawaan ({inherit.from}):
                              </p>
                              <ul className="space-y-1.5 pl-2">
                                {inherit.commands.map((icmdItem, j) => (
                                  <li key={j} className="text-sm text-gray-300 flex items-start gap-2">
                                    <span className="text-gray-500 mt-0.5">»</span> 
                                    <span><span className="text-yellow-400 font-mono">{icmdItem.cmd}</span> <span className="text-gray-500">-</span> {icmdItem.desc}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}