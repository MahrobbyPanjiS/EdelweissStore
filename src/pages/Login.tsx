import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNotif } from '../context/NotifContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showNotif } = useNotif();

  /**
   * Menangani proses login menggunakan Supabase Auth.
   * Menggunakan format email buatan (@edelweiss.local) untuk melewati validasi email Supabase,
   * karena antarmuka hanya meminta Username Minecraft.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    
    setLoading(true);
    try {
      // Memformat username menjadi format email standar untuk autentikasi Supabase
      const emailFormat = `${username.trim().toLowerCase()}@edelweiss.local`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: emailFormat,
        password: password,
      });

      if (error) throw error;

      showNotif(`Berhasil masuk! Selamat datang kembali, ${username}.`, 'success');
      
      // Mengarahkan pengguna kembali ke halaman utama atau store setelah berhasil masuk
      navigate('/store');
    } catch (error: any) {
      showNotif(error.message === 'Invalid login credentials' 
        ? 'Username atau password salah!' 
        : `Gagal login: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-6 animate-in fade-in duration-500">
      <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold mb-2">Selamat Datang</h1>
          <p className="text-gray-400 text-sm">Masuk ke portal web Edelweiss Craft</p>
        </div>

        {/* Kotak Peringatan Wajib Nickname In-Game */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex gap-3 items-start relative z-10">
          <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-yellow-200/90 leading-relaxed">
            <span className="font-bold text-yellow-500 block mb-1">Perhatian Penting!</span>
            Pastikan Username yang lo masukkan <strong>sama persis</strong> dengan Nickname di dalam game Minecraft.
          </div>
        </div>

        <form className="space-y-5 relative z-10" onSubmit={handleLogin}>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Username Minecraft</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: Mahrobby" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <a href="#" className="text-xs text-cyan-500 hover:text-cyan-400">Lupa Password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 mt-4"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Memproses...</>
            ) : (
              <>Masuk Sekarang <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400 relative z-10">
          Belum punya akun web?{' '}
          <Link to="/register" className="text-cyan-500 hover:text-cyan-400 font-bold">
            Daftar di sini
          </Link>
        </div>

      </div>
    </div>
  );
}