import React from 'react';
import { Terminal } from 'lucide-react';

export default function PerintahPenting() {
  return (
    <section className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
          <Terminal size={20} /> Perintah Penting (Commands)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800 hover:border-cyan-500/50 transition-colors">
            <code className="text-green-400 font-mono text-sm block mb-1">/spawn</code>
            <p className="text-xs text-gray-400">Kembali ke area lobi utama server.</p>
          </div>
          <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800 hover:border-cyan-500/50 transition-colors">
            <code className="text-green-400 font-mono text-sm block mb-1">/rtp</code>
            <p className="text-xs text-gray-400">Teleportasi acak ke dunia survival.</p>
          </div>
          <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800 hover:border-cyan-500/50 transition-colors">
            <code className="text-green-400 font-mono text-sm block mb-1">/sethome [nama]</code>
            <p className="text-xs text-gray-400">Menyimpan lokasi saat ini.</p>
          </div>
          <div className="bg-[#0f0f13] p-4 rounded-lg border border-gray-800 hover:border-cyan-500/50 transition-colors">
            <code className="text-green-400 font-mono text-sm block mb-1">/ah</code>
            <p className="text-xs text-gray-400">Membuka fitur lelang barang.</p>
          </div>
        </div>
      </div>
    </section>
  );
}