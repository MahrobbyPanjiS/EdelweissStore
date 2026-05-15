// [code lama + code hasil pembaharuan = code update]
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Mengimpor komponen tata letak
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Mengimpor komponen halaman
import Home from './pages/Home';
import Store from './pages/Store';
import Wiki from './pages/Wiki';
import Help from './pages/Help';
import Profile from './pages/Profile'; // Import Profile
import Settings from './pages/Settings'; // Import Settings

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f0f13] text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
        {/* Navbar akan selalu tampil di atas di semua halaman */}
        <Navbar />
        
        {/* Render halaman berdasarkan rute yang aktif */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/help" element={<Help />} />
            <Route path="/profile" element={<Profile />} /> {/* Route Profile */}
            <Route path="/settings" element={<Settings />} /> {/* Route Settings */}
          </Routes>
        </main>
        
        {/* Footer akan selalu tampil di bawah di semua halaman */}
        <Footer />
      </div>
    </Router>
  );
}