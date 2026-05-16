// [code lama + code hasil pembaharuan = code update]
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Copy, CheckCircle2, Server, ScrollText } from 'lucide-react';

// Mengimpor library animasi GSAP dan plugin ScrollTrigger
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Mendaftarkan plugin ScrollTrigger agar efek muncul saat di-scroll berfungsi
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // Tata kelola state untuk slider gambar
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1605636715104-1b1567d1ab31?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=1000&auto=format&fit=crop"
  ];

  // Tata kelola state untuk status server dan fitur salin IP
  const [serverStatus, setServerStatus] = useState({ online: false, players: 0, max: 0, loading: true });
  const [copied, setCopied] = useState(false);
  const serverIP = "play.edelweisscraft.com";

  // Referensi kontainer utama untuk membatasi cakupan (scope) animasi GSAP
  const containerRef = useRef<HTMLDivElement>(null);

  // Implementasi animasi GSAP
  useGSAP(() => {
    // 1. Animasi untuk bagian Hero (Muncul pertama kali saat halaman dimuat)
    gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.hero-title', { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero-desc', { y: 30, opacity: 0, duration: 1, delay: 0.4, ease: 'power3.out' });
    gsap.from('.hero-buttons', { y: 30, opacity: 0, duration: 1, delay: 0.6, ease: 'power3.out' });

    // 2. Animasi untuk bagian Berita menggunakan ScrollTrigger (Berurutan / Stagger)
    gsap.from('.news-card', {
      scrollTrigger: {
        trigger: '.news-section',
        start: 'top 80%', // Animasi dimulai saat bagian atas elemen mencapai 80% dari viewport
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2, // Jeda waktu kemunculan antar kartu berita
      ease: 'power3.out'
    });

    // 3. Animasi untuk bagian Slider menggunakan ScrollTrigger
    gsap.from('.slider-section', {
      scrollTrigger: {
        trigger: '.slider-section',
        start: 'top 80%',
      },
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  // Mengambil data status server secara asinkron
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIP}`);
        const data = await response.json();
        setServerStatus({
          online: data.online,
          players: data.players?.online || 0,
          max: data.players?.max || 0,
          loading: false
        });
      } catch (error) {
        console.error("Gagal mengambil status server:", error);
        setServerStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchServerStatus();
    // Memperbarui status setiap 60 detik
    const interval = setInterval(fetchServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Logika pergantian slide otomatis
  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={containerRef} className="overflow-hidden">
      
      {/* Bagian Hero & Status Server */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0f0f13]/85 z-10"></div>
          <img src={slides[0]} alt="Background" className="w-full h-full object-cover opacity-30 blur-sm" />
        </div>
        <div className="relative z-20 max-w-3xl mx-auto">
          <div className="hero-badge mb-6 inline-flex items-center gap-2 bg-[#1e293b]/80 border border-gray-700 rounded-full px-4 py-1.5 text-sm">
            <Server size={16} className={serverStatus.online ? "text-green-500" : "text-red-500"} />
            {serverStatus.loading ? (
              <span className="text-gray-400">Memeriksa status server...</span>
            ) : serverStatus.online ? (
              <span className="text-gray-200"><span className="text-green-400 font-bold">{serverStatus.players}</span> / {serverStatus.max} Pemain Online</span>
            ) : (
              <span className="text-red-400">Server sedang Offline / Maintenance</span>
            )}
          </div>
          <h1 className="hero-title text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Selamat Datang di <span className="text-cyan-400">Edelweiss Craft</span>
          </h1>
          <p className="hero-desc text-lg text-gray-300 mb-8 leading-relaxed">
            Mulailah petualangan epik Anda di dunia yang penuh dengan misteri, sistem RPG yang mendalam, dan komunitas yang ramah. Bangun kerajaan Anda, kalahkan monster tangguh, dan jadilah legenda!
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleCopyIP}
              className="group bg-[#1e293b] border border-gray-700 hover:border-cyan-500 rounded-full px-6 py-3 font-mono text-sm flex items-center gap-3 transition-all cursor-pointer"
            >
              {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400 group-hover:text-cyan-400" />}
              {copied ? <span className="text-green-500 font-bold">IP Tersalin!</span> : serverIP}
            </button>
            <Link to="/store" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-full transition-transform active:scale-95">
              Dukung Server
            </Link>
          </div>
        </div>
      </section>

      {/* Bagian Papan Berita (News & Patch Notes) */}
      <section className="news-section py-16 max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-10 border-b border-gray-800 pb-4">
          <ScrollText className="text-cyan-400" size={28} />
          <h2 className="text-2xl font-bold">Berita & Pembaruan Server</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <article className="news-card bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 hover:bg-[#1e293b]/50 transition-colors">
            <div className="text-xs text-gray-400 mb-3 flex items-center justify-between">
              <span>Pembaruan Versi</span>
              <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded text-[10px] font-bold">TERBARU</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Migrasi Server ke 1.21.11</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Proses pembaruan versi server telah selesai. Seluruh pemain kini dapat menikmati stabilitas yang lebih baik dan perbaikan kompatibilitas plugin di versi 1.21.11.
            </p>
          </article>

          <article className="news-card bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 hover:bg-[#1e293b]/50 transition-colors">
            <div className="text-xs text-gray-400 mb-3">Keamanan Jaringan</div>
            <h3 className="text-lg font-bold mb-2">Peningkatan Sistem Anti-Bot</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Kami telah memperketat lapisan keamanan untuk mengatasi serangan masif. Sistem kini lebih tangkas dalam memblokir akun-akun bot yang mencoba masuk secara bersamaan.
            </p>
          </article>

          <article className="news-card bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-6 hover:bg-[#1e293b]/50 transition-colors">
            <div className="text-xs text-gray-400 mb-3 flex items-center justify-between">
              <span>Bocoran Fitur (Teaser)</span>
              <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-[10px] font-bold">SEGERA</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Sistem Manajemen Kuda Custom</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Tim pengembang sedang merancang plugin eksklusif dari nol untuk memberikan pengalaman manajemen *mount* (kuda) dan istal yang belum pernah ada sebelumnya. Bersiaplah!
            </p>
          </article>

        </div>
      </section>

      {/* Bagian Slider Gambar Server */}
      <section className="slider-section py-16 bg-[#14141a]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-8 text-center">Cuplikan Komunitas</h2>
          <div className="relative rounded-2xl overflow-hidden group border border-gray-800 shadow-2xl">
            <div className="aspect-video relative">
              <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="w-full h-full object-cover transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500 hover:text-black">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500 hover:text-black">
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-cyan-400 w-4' : 'bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}