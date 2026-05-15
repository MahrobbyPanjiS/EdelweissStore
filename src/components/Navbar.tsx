// [code lama + code hasil pembaharuan = code update]
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home, Book, LifeBuoy, Menu, X, User, Settings } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Bagian Kiri: Logo Aplikasi */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-white flex items-center gap-2 transition-transform active:scale-95">
              <span className="bg-cyan-500 text-black px-2 py-1 rounded-md text-sm">EC</span>
              Edelweiss Craft
            </Link>
          </div>
          
          {/* Bagian Tengah: Menu Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-cyan-500/10 text-cyan-400' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Bagian Kanan: User Actions Desktop */}
          <div className="hidden md:flex items-center gap-3 border-l border-gray-800 ml-4 pl-4">
            <Link 
              to="/settings" 
              className={`p-2 rounded-full transition-colors ${location.pathname === '/settings' ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              title="Pengaturan"
            >
              <Settings size={20} />
            </Link>
            <Link 
              to="/profile" 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                location.pathname === '/profile' 
                  ? 'border-cyan-500 bg-cyan-500 text-black' 
                  : 'border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
              }`}
            >
              <User size={18} />
              <span className="text-xs font-bold font-mono">Mahrobby</span>
            </Link>
          </div>

          {/* Tombol Hamburger Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-400 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu Navigasi Mobile */}
      {isOpen && (
        <div className="md:hidden bg-[#14141a] border-b border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                  location.pathname === link.path ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="my-2 border-t border-gray-800 pt-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${location.pathname === '/profile' ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300'}`}
              >
                <User size={18} /> Profil Saya
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${location.pathname === '/settings' ? 'bg-cyan-500/10 text-cyan-400' : 'text-gray-300'}`}
              >
                <Settings size={18} /> Pengaturan
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}