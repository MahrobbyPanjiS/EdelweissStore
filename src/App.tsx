// [code lama + code hasil pembaharuan = code update]
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Store from './pages/Store';
import Wiki from './pages/Wiki';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f0f13] text-white flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/help" element={<Help />} />
            <Route path="/profile" element={<Profile />} /> {/* Satu rute untuk Login/Register/Profile */}
            <Route path="/settings" element={<Settings />} /> {/* Tetap sebagai Admin Dashboard */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}