// [code lama + code hasil pembaharuan = code update]
import React, { useState } from 'react';
import { LayoutDashboard, Smartphone, Tablet, Monitor, Settings } from 'lucide-react';

export default function LayoutBuilder() {
  // State untuk mengontrol lebar kontainer tiruan (dalam persentase 30% - 100%)
  const [containerWidth, setContainerWidth] = useState(100);

  // Menentukan breakpoint layout berdasarkan lebar kontainer
  const isMobile = containerWidth < 50;
  const isTablet = containerWidth >= 50 && containerWidth < 80;
  const isDesktop = containerWidth >= 80;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <LayoutDashboard className="text-cyan-400" size={36} /> Grid Builder Interaktif
        </h1>
        <p className="text-gray-400">Klik tombol perangkat atau geser slider di bawah untuk melihat perubahan layout secara real-time.</p>
      </div>

      <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-8 shadow-2xl">
        
        {/* --- KONTROL ATAS: TOMBOL PERANGKAT (SEKARANG BISA DIKLIK) --- */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setContainerWidth(35)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer hover:bg-cyan-500/10 ${isMobile ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 scale-105' : 'border-gray-700 text-gray-500'}`}
          >
            <Smartphone size={16} /> <span className="text-sm font-bold">Mobile</span>
          </button>
          
          <button 
            onClick={() => setContainerWidth(65)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer hover:bg-purple-500/10 ${isTablet ? 'border-purple-500 bg-purple-500/10 text-purple-400 scale-105' : 'border-gray-700 text-gray-500'}`}
          >
            <Tablet size={16} /> <span className="text-sm font-bold">Tablet</span>
          </button>
          
          <button 
            onClick={() => setContainerWidth(100)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all cursor-pointer hover:bg-green-500/10 ${isDesktop ? 'border-green-500 bg-green-500/10 text-green-400 scale-105' : 'border-gray-700 text-gray-500'}`}
          >
            <Monitor size={16} /> <span className="text-sm font-bold">Desktop</span>
          </button>
        </div>

        {/* --- AREA PREVIEW GRID --- */}
        <div className="bg-[#0f0f13] border-2 border-dashed border-gray-700 rounded-2xl p-4 md:p-8 flex justify-center mb-8 overflow-hidden min-h-[400px]">
          
          {/* Kontainer yang ukurannya berubah-ubah sesuai Slider / Tombol */}
          <div 
            className="transition-all duration-300 ease-out bg-[#14141a] border border-gray-800 rounded-xl p-4 flex flex-col gap-4"
            style={{ width: `${containerWidth}%` }}
          >
            {/* Header (Selalu di atas) */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg p-3 font-bold text-center text-sm">
              HEADER
            </div>

            {/* Area Grid Dinamis */}
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-4'}`}>
              
              {/* Sidebar */}
              <div className={`bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg p-4 flex items-center justify-center font-bold text-sm min-h-[100px] transition-all duration-300 ${isMobile ? 'col-span-1' : isTablet ? 'col-span-2' : 'col-span-1 row-span-2'}`}>
                SIDEBAR
              </div>

              {/* Main Content */}
              <div className={`bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg p-4 flex items-center justify-center font-bold text-sm min-h-[150px] transition-all duration-300 ${isMobile ? 'col-span-1' : isTablet ? 'col-span-2' : 'col-span-3'}`}>
                MAIN CONTENT
              </div>

              {/* Widgets */}
              <div className={`bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-lg p-4 flex items-center justify-center font-bold text-sm min-h-[100px] transition-all duration-300 ${isMobile ? 'col-span-1' : isTablet ? 'col-span-1' : 'col-span-1'}`}>
                WIDGET A
              </div>
              <div className={`bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-lg p-4 flex items-center justify-center font-bold text-sm min-h-[100px] transition-all duration-300 ${isMobile ? 'col-span-1' : isTablet ? 'col-span-1' : 'col-span-2'}`}>
                WIDGET B
              </div>

            </div>

            {/* Footer */}
            <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg p-3 font-bold text-center text-sm mt-auto">
              FOOTER
            </div>
          </div>
        </div>

        {/* --- KONTROL BAWAH: SLIDER UKURAN --- */}
        <div className="max-w-xl mx-auto bg-[#0f0f13] border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-400 flex items-center gap-2"><Settings size={16}/> Sesuaikan Lebar Layout</span>
            <span className="text-cyan-400 font-mono font-bold">{containerWidth}%</span>
          </div>
          
          <input 
            type="range" 
            min="30" 
            max="100" 
            value={containerWidth}
            onChange={(e) => setContainerWidth(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
            <span>Mobile (30%)</span>
            <span>Tablet (50%)</span>
            <span>Desktop (80%+)</span>
          </div>
        </div>

      </div>
    </div>
  );
}