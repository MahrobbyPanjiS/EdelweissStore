import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, Book, LifeBuoy, Menu, X, User, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/', icon: <Home size={18} /> },
    { name: 'Store', path: '/store', icon: <ShoppingCart size={18} /> },
    { name: 'Wiki / Panduan', path: '/wiki', icon: <Book size={18} /> },
    { name: 'Bantuan', path: '/help', icon: <LifeBuoy size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#14141a]/90 backdrop-blur-md border-b border-gray-800">
      
      {/* --- INJEKSI CSS UNTUK ANIMASI SVG DRAWING --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .running-text {
          fill: transparent;
          stroke-width: 1.5px;
          /* PERBAIKAN: 
             Menyesuaikan nilai dasharray dan dashoffset menjadi 110. 
             Nilai ini dipastikan cukup untuk mencakup seluruh panjang garis 
             pada karakter terlebar (seperti huruf 'W'). Dengan demikian, 
             semua huruf akan terisi secara penuh (100%) sebelum animasi 
             memasuki fase mundur (fill out).
          */
          stroke-dasharray: 110; 
          stroke-dashoffset: 110;
          /* PERBAIKAN: 
             Durasi disesuaikan kembali menjadi 2.5s untuk mengakomodasi 
             penambahan panjang jalur (path length) agar pergerakan tetap stabil.
          */
          animation: drawStroke 2.5s linear infinite alternate;
        }

        @keyframes drawStroke {
          0% { 
            stroke-dashoffset: 110; 
          }
          100% {
            stroke-dashoffset: 0; 
          }
        }

        .nav-text-container {
          display: flex;
          align-items: center;
          height: 100%;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link to="/" className="nav-text-container">
            
            {/* --- LOGO TEKS ANIMASI DRAWING (DESKTOP) --- */}
            <svg className="hidden sm:block" width="240" height="40" viewBox="0 0 240 40">
              <defs>
                <linearGradient id="ec-run-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0891b2" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <text x="0" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="900" fill="rgba(34, 211, 238, 0.15)">
                Edelweiss Craft
              </text>
              <text x="0" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="900" className="running-text" stroke="url(#ec-run-grad)">
                Edelweiss Craft
              </text>
            </svg>

            {/* --- LOGO TEKS ANIMASI DRAWING (MOBILE) --- */}
            <svg className="sm:hidden" width="125" height="40" viewBox="0 0 125 40">
              <text x="0" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="900" fill="rgba(34, 211, 238, 0.15)">
                Edelweiss
              </text>
              <text x="0" y="28" fontFamily="system-ui, -apple-system, sans-serif" fontSize="24" fontWeight="900" className="running-text" stroke="url(#ec-run-grad)">
                Edelweiss
              </text>
            </svg>

          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className={`flex items-center gap-2 text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}>
                {link.icon} {link.name}
              </Link>
            ))}
          </div>

          {/* User Actions Desktop */}
          <div className="hidden md:flex items-center gap-3 border-l border-gray-800 ml-4 pl-4">
            
            <Link to="/settings" className={`p-2 rounded-full transition-colors ${location.pathname === '/settings' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} title="Admin Dashboard">
              <ShieldAlert size={20} />
            </Link>

            <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-cyan-500 text-black font-bold' : 'bg-[#1e293b] hover:bg-gray-700 text-white font-bold'}`}>
              <User size={18} /> Profil
            </Link>
          </div>

          {/* Hamburger Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#14141a] border-b border-gray-800 p-4 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-gray-300">{link.icon} {link.name}</Link>
          ))}
          <div className="pt-4 border-t border-gray-800 flex flex-col gap-2">
            <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
              <ShieldAlert size={18} className="mr-2" /> Admin Dashboard
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center py-3 rounded-xl bg-cyan-500 text-black font-bold">
              <User size={18} className="mr-2" /> Profil
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}