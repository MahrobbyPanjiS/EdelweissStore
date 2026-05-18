import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Copy, CheckCircle2, Server, ScrollText } from 'lucide-react';

// Mengimpor library animasi GSAP dan plugin ScrollTrigger
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// =========================================================================
// MENGIMPOR REUSABLE COMPONENTS
// =========================================================================
import KatalogPremium from '../components/KatalogPremium';
import PerintahPenting from '../components/PerintahPenting';
import ResponCepat from '../components/ResponCepat';

// Mengimpor Supabase Client untuk mengambil data riil
import supabase from '../lib/supabaseClient';

// Mendaftarkan plugin ScrollTrigger agar efek muncul saat di-scroll berfungsi
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // State untuk menampung data riil Slider. 
  // Diberi jaring pengaman 1 gambar default agar Hero Section tidak bolong!
  const defaultSlide = "https://images.unsplash.com/photo-1605636715104-1b1567d1ab31?q=80&w=1000&auto=format&fit=crop";
  const [slides, setSlides] = useState<string[]>([defaultSlide]);
  const [slidesLoading, setSlidesLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // State untuk menampung data riil Berita
  const [newsList, setNewsList] = useState<{ id: number; title: string; tag: string; content: string }[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const [serverStatus, setServerStatus] = useState({ online: false, players: 0, max: 0, loading: true });
  const [copied, setCopied] = useState(false);
  const serverIP = "play.edelweisscraft.com";
  const containerRef = useRef<HTMLDivElement>(null);

  // Fungsi pembantu untuk warna tag berita
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'TERBARU': return 'bg-cyan-500/10 text-cyan-400';
      case 'SEGERA': return 'bg-purple-500/10 text-purple-400';
      case 'MAINTENANCE': return 'bg-orange-500/10 text-orange-400';
      case 'EVENT': return 'bg-green-500/10 text-green-400';
      default: return 'bg-gray-500/10 text-gray-400'; // INFO UMUM
    }
  };

  useGSAP(() => {
    // 1. Animasi Hero (Diubah menggunakan fromTo agar tidak tersangkut opacity 0)
    gsap.fromTo('.hero-badge', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
    gsap.fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' });
    gsap.fromTo('.hero-desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: 'power3.out' });
    gsap.fromTo('.hero-buttons', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'power3.out' });

    // 2. Animasi Berita
    if (newsList.length > 0) {
      gsap.fromTo('.news-card', 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: '.news-section',
            start: 'top 85%',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        }
      );
    }

    // 3. Animasi Slider Komunitas
    gsap.fromTo('.slider-section', 
      { scale: 0.95, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.slider-section',
          start: 'top 85%',
        },
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
      }
    );

    setTimeout(() => ScrollTrigger.refresh(), 500);
  }, { scope: containerRef, dependencies: [newsList] });

  // Mengambil data Slider
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data, error } = await supabase.from('slides').select('url').order('id', { ascending: true });
        if (error) throw error;
        
        // Cek jika datanya beneran ada isinya
        if (data && data.length > 0 && data[0].url !== "") {
           setSlides(data.map(item => item.url));
        }
      } catch (err) {
        console.error("Gagal mengambil slide:", err);
      } finally {
        setSlidesLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Mengambil data Berita (Maksimal 3 terbaru)
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase.from('news').select('*').order('id', { ascending: false }).limit(3);
        if (error) throw error;
        if (data) setNewsList(data);
      } catch (err) {
        console.error("Gagal mengambil berita:", err);
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Navigasi manual slider
  const nextSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Status server check
  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIP}`);
        const data = await response.json();
        setServerStatus({ online: data.online, players: data.players?.online || 0, max: data.players?.max || 0, loading: false });
      } catch (error) {
        console.error("Gagal mengambil status server:", error);
        setServerStatus(prev => ({ ...prev, loading: false }));
      }
    };
    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={containerRef} className="overflow-hidden">
      
      {/* 1. BAGIAN HERO */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0f0f13]/85 z-10"></div>
          {/* Ini bagian Background Gambar Heronya, mengambil gambar index pertama */}
          <img src={slides[0]} alt="Background" className="w-full h-full object-cover opacity-30 blur-sm" />
        </div>
        <div className="relative z-20 max-w-3xl mx-auto">
          <div className="hero-badge mb-4 md:mb-6 inline-flex items-center gap-2 bg-[#1e293b]/80 border border-gray-700 rounded-full px-4 py-1.5 text-xs md:text-sm">
            <Server size={16} className={serverStatus.online ? "text-green-500" : "text-red-500"} />
            {serverStatus.loading ? (
              <span className="text-gray-400">Memeriksa status server...</span>
            ) : serverStatus.online ? (
              <span className="text-gray-200"><span className="text-green-400 font-bold">{serverStatus.players}</span> / {serverStatus.max} Pemain Online</span>
            ) : (
              <span className="text-red-400">Server Offline / Maintenance</span>
            )}
          </div>
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">
            Selamat Datang di <span className="text-cyan-400">Edelweiss Craft</span>
          </h1>
          <p className="hero-desc text-base md:text-lg text-gray-300 mb-8 leading-relaxed px-2">
            Mulailah petualangan epik Anda di dunia yang penuh dengan misteri, sistem RPG yang mendalam, dan komunitas yang ramah. Bangun kerajaan Anda, kalahkan monster tangguh, dan jadilah legenda!
          </p>
          <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <button 
              onClick={handleCopyIP}
              className="group w-full sm:w-auto bg-[#1e293b] border border-gray-700 hover:border-cyan-500 rounded-full px-6 py-3.5 font-mono text-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-400 group-hover:text-cyan-400" />}
              {copied ? <span className="text-green-500 font-bold">IP Tersalin!</span> : serverIP}
            </button>
            <Link to="/store" className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3.5 rounded-full transition-transform active:scale-95 text-center">
              Dukung Server
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MANGGIL KATALOG PREMIUM */}
      <KatalogPremium />

      {/* 3. BAGIAN BERITA & PEMBARUAN (DATA RIIL DARI SUPABASE) */}
      <section className="news-section py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8 md:mb-10 border-b border-gray-800 pb-4">
          <ScrollText className="text-cyan-400 hidden sm:block" size={28} />
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <ScrollText className="text-cyan-400 sm:hidden" size={24} /> Berita & Pembaruan
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsLoading ? (
            <div className="col-span-full text-center text-gray-500 animate-pulse py-8">Memuat berita terbaru...</div>
          ) : newsList.length > 0 ? (
            newsList.map((item) => (
              <article key={`news-${item.id}`} className="news-card bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-5 md:p-6 hover:bg-[#1e293b]/50 transition-colors flex flex-col h-full">
                <div className="text-xs text-gray-400 mb-3 flex items-center justify-between">
                  <span>Papan Pengumuman</span>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${getTagColor(item.tag)}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap flex-grow">
                  {item.content}
                </p>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8 border border-dashed border-gray-800 rounded-2xl bg-[#0f0f13]">
              Belum ada berita atau pengumuman saat ini.
            </div>
          )}
        </div>
      </section>

      {/* 4. MANGGIL PERINTAH PENTING */}
      <PerintahPenting />

      {/* 5. BAGIAN CUPLIKAN KOMUNITAS */}
      <section className="slider-section py-12 md:py-16 bg-[#14141a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">Cuplikan Komunitas</h2>
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden group border border-gray-800 shadow-2xl">
            <div className="aspect-video relative bg-[#0f0f13] flex items-center justify-center">
              
              {slidesLoading ? (
                <div className="text-gray-400 font-bold animate-pulse">Memuat gambar dari server...</div>
              ) : slides.length > 0 && slides[currentSlide] ? (
                <>
                  <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="w-full h-full object-cover transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </>
              ) : (
                <div className="text-gray-500 text-sm">Belum ada foto cuplikan komunitas. Tambahkan melalui panel Admin.</div>
              )}

            </div>
            
            {!slidesLoading && slides.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-black/50 text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500 hover:text-black">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-black/50 text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500 hover:text-black">
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {slides.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${i === currentSlide ? 'bg-cyan-400 w-3 md:w-4' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}

          </div>
        </div>
      </section>

      {/* 6. MANGGIL RESPON CEPAT */}
      <ResponCepat />

    </div>
  );
}
