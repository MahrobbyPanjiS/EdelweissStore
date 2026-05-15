import React from 'react';
import { Book } from 'lucide-react';

export default function Wiki() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Book className="text-cyan-400" size={36} /> Panduan Server
      </h1>
      <div className="space-y-6">
        <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Aturan Dasar (Rules)</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm leading-relaxed">
            <li>Dilarang menggunakan cheat, mod ilegal, atau eksploitasi bug (X-Ray, AutoClicker, dll).</li>
            <li>Dilarang melakukan griefing atau mencuri barang di wilayah klaim milik pemain lain.</li>
            <li>Hormati semua pemain. Rasisme, SARA, dan pelecehan tidak ditoleransi.</li>
            <li>Dilarang melakukan spamming atau beriklan server lain di chat global.</li>
          </ul>
        </div>
        <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-cyan-400">Perintah Penting (Commands)</h2>
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
      </div>
    </div>
  );
}