// [code lama + code hasil pembaharuan = code update]
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <span className="bg-cyan-500 text-black px-2 py-1 rounded-md text-sm">EC</span>
            Edelweiss Craft
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
            
            {/* Tombol Admin Panel dibuat selalu muncul untuk lo sebagai Developer */}
            <Link to="/settings" className={`p-2 rounded-full transition-colors ${location.pathname === '/settings' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`} title="Admin Dashboard">
              <ShieldAlert size={20} />
            </Link>

            {/* Tombol Profil Tunggal (Jadi Pintu Gerbang Buat Login/Register & Lihat Profil) */}
            <Link to="/profile" className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${location.pathname === '/profile' ? 'bg-cyan-500 text-black font-bold' : 'bg-[#1e293b] hover:bg-gray-700 text-white font-bold'}`}>
              <User size={18} /> Profil
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
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