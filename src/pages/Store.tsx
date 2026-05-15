import React, { useState } from 'react';
import { X, Crown, Clock } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Rank' | 'Item' | 'Kosmetik';
}

const PRODUCTS: Product[] = [
  { id: 'rank-mytic', name: 'Mytic Rank', price: 75000, description: 'Akses eksklusif ke fitur premium, kit mingguan, dan prefix [MYTIC].', category: 'Rank' },
  { id: 'rank-vip', name: 'VIP Rank', price: 50000, description: 'Prioritas masuk server saat penuh dan akses command /fly di lobi.', category: 'Rank' },
  { id: 'item-diamond', name: 'Paket Diamond', price: 25000, description: 'Mendapatkan 64x Diamond Block dan 1x Netherite Ingot.', category: 'Item' },
  { id: 'item-spawner', name: 'Zombie Spawner', price: 35000, description: 'Item spawner khusus untuk membuat farm di base Anda.', category: 'Item' },
  { id: 'cosmetic-aura', name: 'Aura Ksatria', price: 30000, description: 'Efek partikel khusus yang mengelilingi karakter Anda di lobi utama.', category: 'Kosmetik' },
  { id: 'cosmetic-pet', name: 'Pet Naga Mini', price: 45000, description: 'Hewan peliharaan kosmetik yang akan mengikuti Anda ke mana saja.', category: 'Kosmetik' }
];

export default function Store() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Rank', 'Item', 'Kosmetik'];
  const filteredProducts = activeCategory === 'Semua' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Toko Resmi Server</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Setiap pembelian Anda sangat berarti untuk mempertahankan server agar terus aktif dan mendapatkan pembaruan fitur terbaru.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Kolom Kiri: Katalog Produk */}
        <div className="lg:w-3/4">
          <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-800 pb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat ? 'bg-cyan-500 text-black' : 'bg-[#1e293b] text-gray-300 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-[#1e293b]/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(34,211,238,0.3)] transition-all duration-300">
                <div>
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">{product.category}</div>
                  <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-6">{product.description}</p>
                </div>
                <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-lg font-bold">Rp {product.price.toLocaleString('id-ID')}</span>
                  <button onClick={() => setSelectedProduct(product)} className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg font-medium transition-transform active:scale-95 duration-200">
                    Beli
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Sidebar FOMO */}
        <div className="lg:w-1/4 space-y-6">
          
          {/* Top Donator */}
          <div className="bg-gradient-to-b from-[#1e293b]/80 to-[#14141a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#d4af37]">
              <Crown size={20} /> Top Donatur
            </h3>
            <div className="space-y-4">
              {['RobbyGamer', 'KsatriaMalam', 'Azelia_22'].map((name, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs border border-[#d4af37]/50">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{name}</div>
                    <div className="text-xs text-gray-400">Pahlawan Server</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Clock size={20} className="text-cyan-400" /> Aktivitas Terkini
            </h3>
            <div className="space-y-4">
              <div className="text-sm">
                <span className="font-bold text-white">PlayerSatu</span> baru saja membeli <span className="text-cyan-400 font-medium">Mytic Rank</span>
                <div className="text-xs text-gray-500 mt-1">10 menit yang lalu</div>
              </div>
              <div className="text-sm">
                <span className="font-bold text-white">Steve_Indo</span> baru saja membeli <span className="text-cyan-400 font-medium">Paket Diamond</span>
                <div className="text-xs text-gray-500 mt-1">1 jam yang lalu</div>
              </div>
              <div className="text-sm">
                <span className="font-bold text-white">Alex_Pro</span> baru saja membeli <span className="text-cyan-400 font-medium">VIP Rank</span>
                <div className="text-xs text-gray-500 mt-1">3 jam yang lalu</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal QRIS (Logika Checkout Tetap Sama) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1a1a24] border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <div className="p-6 border-b border-gray-800 bg-[#1e293b]/30">
              <h3 className="text-xl font-bold mb-1">Penyelesaian Pembayaran</h3>
              <p className="text-sm text-gray-400">Item: <span className="text-cyan-400 font-medium">{selectedProduct.name}</span></p>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-6 p-4 bg-white rounded-xl">
                <p className="text-black font-bold text-sm mb-2 text-center">Scan QRIS</p>
                <img src="https://via.placeholder.com/200x200.png?text=QRIS+Disini" alt="QRIS" className="w-48 h-48 object-cover mb-2 border-2 border-gray-200" />
                <p className="text-black text-lg font-bold">Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); alert("Fitur formulir sukses disimulasikan!"); setSelectedProduct(null); }} className="space-y-4">
                <div>
                  <input type="text" required placeholder="Username Minecraft" className="w-full bg-[#0f0f13] border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg font-bold text-black mt-2 bg-cyan-500 hover:bg-cyan-400 active:scale-95 transition-all">
                  Konfirmasi Pembayaran
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}