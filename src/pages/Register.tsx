import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, AlertCircle, ArrowRight, CheckCircle2, Loader2, MapPin, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { api } from '../services/api'; // <-- Mengimpor API buatan kita
import { useNotif } from '../context/NotifContext';

// Daftar kota besar sebagai rekomendasi (Bisa ditambahin lagi)
const DAFTAR_KOTA = [
  'Jakarta', 'Surabaya', 'Bandung', 'Depok', 'Medan', 'Semarang', 
  'Makassar', 'Palembang', 'Denpasar', 'Yogyakarta', 'Bogor', 
  'Bekasi', 'Tangerang', 'Cileungsi', 'Malang', 'Balikpapan'
];

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [skinInput, setSkinInput] = useState('');
  
  // State untuk Kota
  const [kota, setKota] = useState('');
  const [showKotaDropdown, setShowKotaDropdown] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const { showNotif } = useNotif();

  // Filter kota berdasarkan ketikan
  const filteredKota = DAFTAR_KOTA.filter(k => k.toLowerCase().includes(kota.toLowerCase()));

  // Menutup dropdown kota kalau klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowKotaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showNotif('Konfirmasi password tidak cocok!', 'error');
      return;
    }

    if (password.length < 6) {
      showNotif('Password minimal harus 6 karakter.', 'error');
      return;
    }

    setLoading(true);
    try {
      // DIBUANG .toLowerCase() AGAR HURUF BESAR/KECIL TETAP SESUAI KETIKAN
      const sanitizedUsername = username.trim();
      
      // Logika pemrosesan Skin (Default vs Custom/Premium URL)
      let finalSkin = 'https://minotar.net/skin/Steve'; // Default jika dikosongkan
      if (skinInput.trim()) {
        if (skinInput.startsWith('http')) {
          finalSkin = skinInput.trim(); // Jika diisi link URL gambar langsung
        } else {
          finalSkin = `https://minotar.net/skin/${skinInput.trim()}`; // Jika diisi Nickname premium
        }
      }

      // 1. Simpan Akun (ID & Pass) ke Google Apps Script
      const res = await api.register(sanitizedUsername, password);
      
      if (res.status === 'error') {
        throw new Error(res.message || 'Nickname ini kemungkinan sudah terdaftar!');
      }

      // 2. Simpan Data Profil Pendukung (Skin & Kota) ke database Supabase
      // Catatan: Pastikan tabel profiles di Supabase RLS-nya memperbolehkan operasi INSERT secara publik/anonim
      const { error: dbError } = await supabase
        .from('profiles')
        .insert([{
          username: sanitizedUsername,
          role: 'player',
          skin_url: finalSkin,
          kota: kota.trim() || 'Tidak diatur'
        }]);

      if (dbError) {
        console.warn('Gagal menyimpan profil ke Supabase, tapi akun GAS berhasil dibuat:', dbError);
        // Kita tidak menolak registrasi jika hanya gagal insert profil tambahan
      }

      showNotif('Pendaftaran berhasil! Silakan masuk dengan akun baru lo.', 'success');
      navigate('/login');
    } catch (error: any) {
      showNotif(`Gagal mendaftar: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

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

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex gap-3 items-start relative z-10">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-red-200/90 leading-relaxed">
            <span className="font-bold text-red-400 block mb-1">WAJIB BACA!</span>
            Username <strong>HARUS</strong> sama dengan Nickname Minecraft lo. Sinkronisasi rank akan gagal jika nama tidak sesuai.
          </div>
        </div>

        <form className="space-y-4 relative z-10" onSubmit={handleRegister}>
          
          {/* Kolom Username / ID */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Nickname Minecraft (ID)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ketik persis seperti di game" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          {/* Kolom Kota (Dengan Autocomplete Dropdown) */}
          <div className="relative" ref={dropdownRef}>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Asal Kota <span className="text-gray-600 text-[10px] normal-case">(Boleh ketik manual)</span></label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                value={kota}
                onChange={(e) => {
                  setKota(e.target.value);
                  setShowKotaDropdown(true);
                }}
                onFocus={() => setShowKotaDropdown(true)}
                placeholder="Contoh: Depok, Cileungsi, dsb..." 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
            
            {/* Pop-up Dropdown Kota */}
            {showKotaDropdown && filteredKota.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-[#1a1a24] border border-gray-700 rounded-xl shadow-xl max-h-40 overflow-y-auto custom-scrollbar">
                {filteredKota.map((k, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      setKota(k);
                      setShowKotaDropdown(false);
                    }}
                    className="px-4 py-2 text-sm text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 cursor-pointer border-b border-gray-800/50 last:border-0"
                  >
                    {k}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kolom Skin URL / Nick Premium (Opsional) */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2 flex items-center gap-2">
              Avatar Skin <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-[9px]">Opsional</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ImageIcon size={18} className="text-gray-500" />
              </div>
              <input 
                type="text" 
                value={skinInput}
                onChange={(e) => setSkinInput(e.target.value)}
                placeholder="URL Gambar / Nick Premium (Kosongin = Steve)" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          {/* Kolom Password */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Password Web</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat password baru" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          {/* Kolom Konfirmasi Password */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Konfirmasi Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CheckCircle2 size={18} className="text-gray-500" />
              </div>
              <input 
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password di atas" 
                className="w-full bg-[#0f0f13] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-white placeholder-gray-600"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 mt-6"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Memproses...</>
            ) : (
              <>Daftar Sekarang <ArrowRight size={18} /></>
            )}
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