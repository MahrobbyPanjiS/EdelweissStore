import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0d] border-t border-gray-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Edelweiss Craft</h3>
          <p className="text-sm text-gray-400">Server Minecraft RPG Komunitas Terbaik di Indonesia.</p>
        </div>
        <div className="text-sm text-gray-500">
          &copy; 2026 Edelweiss Craft. Semua Hak Cipta Dilindungi.<br/>
          Bukan produk resmi Minecraft. Tidak disetujui oleh atau berafiliasi dengan Mojang.
        </div>
      </div>
    </footer>
  );
}