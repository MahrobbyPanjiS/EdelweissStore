import React from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Register() {
  return (
    <div className="max-w-md mx-auto py-16 px-6 animate-in fade-in duration-500">
      <div className="bg-[#1e293b]/30 border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold mb-2">Buat Akun Web</h1>
          <p className="text-gray-400 text-sm">Bergabung dengan portal Edelweiss Craft</p>
        </div>

        {/* Kotak Peringatan Wajib Nickname In-Game */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex gap-3 items-start relative z-10">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-red-200/90 leading-relaxed">
            <span className="font-bold text-red-400 block mb-1">WAJIB BACA!</span>
            Username <strong>HARUS</strong> sama dengan Nickname Minecraft lo. Transaksi Store dan sinkronisasi rank akan gagal jika nama tidak sesuai.
          </div>
        </div>

        <form className="space-y-4 relative z-10" onSubmit={(e) => { e.preventDefault(); alert("Simulasi Register Berhasil!"); }}>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Nickname Minecraft</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                required
                placeholder="Ketik persis seperti di game" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Password Web</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                placeholder="Buat password baru" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Konfirmasi Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CheckCircle2 size={18} className="text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                placeholder="Ulangi password di atas" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 mt-6">
            Daftar Sekarang <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400 relative z-10">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-bold">
            Masuk di sini
          </Link>
        </div>

      </div>
    </div>
  );
}