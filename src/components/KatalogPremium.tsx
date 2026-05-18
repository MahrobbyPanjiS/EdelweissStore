// [code lama + code hasil pembaharuan = code update]
import React, { useState } from 'react';
import { Crown, ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react';

// Mengimpor library Swiper untuk efek 3D Coverflow Card & Navigasi
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import useProducts from '../hooks/useProducts';
import { createInvoice, updateInvoiceStatus } from '../services/invoicesService';
import gambarQris from '../assets/qris.jpg';

// MENERIMA PROPS DARI PARENT COMPONENT (Store.tsx)
type KatalogPremiumProps = {
  premiumProducts?: any[];
};

export default function KatalogPremium({ premiumProducts }: KatalogPremiumProps) {
  const handleAddToCart = (e: React.MouseEvent, productName: string) => {
    e.stopPropagation(); 
    alert(`Berhasil menambahkan ${productName} ke Keranjang!`);
  };

  // Tetap panggil useProducts sebagai fallback jika dipanggil tanpa props (misal di Home.tsx)
  const { products } = useProducts();
  
  // LOGIKA UTAMA: Jika ada data dari props, pakai itu. Jika tidak, filter mandiri.
  const displayProducts = premiumProducts || (products || []).filter((p: any) => p.is_premium === true);

  const [currentInvoice, setCurrentInvoice] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const handleBuy = async (product: any) => {
    try {
      setInvoiceLoading(true);
      const inv = await createInvoice({ product_id: product.id, price: product.price, quantity: 1, metadata: { productName: product.name } });
      setCurrentInvoice({ ...inv, product });
      setModalOpen(true);
    } catch (e: any) {
      alert('Gagal membuat invoice: ' + (e.message || String(e)));
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!currentInvoice) return;
    try {
      await updateInvoiceStatus(currentInvoice.id, 'canceled');
      setCurrentInvoice((c: any) => ({ ...c, status: 'canceled' }));
      alert('Pesanan dibatalkan.');
      setModalOpen(false);
    } catch (e: any) {
      alert('Gagal membatalkan: ' + (e.message || String(e)));
    }
  };

  const handlePaid = async () => {
    if (!currentInvoice) return;
    try {
      await updateInvoiceStatus(currentInvoice.id, 'waiting_confirmation');
      setCurrentInvoice((c: any) => ({ ...c, status: 'waiting_confirmation' }));
      alert('Terima kasih — admin sedang memeriksa bukti pembayaran.');
      setModalOpen(false);
    } catch (e: any) {
      alert('Gagal update status: ' + (e.message || String(e)));
    }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto py-12 px-2 md:px-12 lg:px-20 overflow-hidden">
      
      {/* CSS INTERNAL UNTUK EFEK FLIP CARD 3D */}
      <style dangerouslySetInnerHTML={{__html: `
        .card-container {
          perspective: 1800px;
          width: 320px; 
          height: 512px; 
          position: relative;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .card-container {
            width: 260px;
            height: 440px;
          }
        }

        .flip-card-checkbox { display: none; }
        .ec-card {
          width: 100%; height: 100%; position: relative;
          transform-style: preserve-3d;
          transition: transform 0.9s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          border-radius: 24px; 
        }
        .flip-card-checkbox:checked ~ .ec-card { transform: rotateY(180deg); }
        
        .ec-card-face {
          position: absolute; width: 100%; height: 100%;
          backface-visibility: hidden; border-radius: 24px;
          overflow: hidden; display: flex; flex-direction: column;
          background-color: #0d0d0f; border: 3px solid #3d3d3d;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.9), inset 0 0 25px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(34, 211, 238, 0.1);
        }
        .ec-card-front { transform: rotateY(0deg); }
        .ec-card-back { transform: rotateY(180deg); }
        
        .card-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; z-index: 2; position: relative;}
        .card-brand { color: #22d3ee; font-weight: 900; font-size: 18px; letter-spacing: 1px; text-shadow: 0 0 10px rgba(34,211,238,0.5);}
        
        .legendary-indicator {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(8, 145, 178, 0.25));
          color: #67e8f9; padding: 6px 12px; border-radius: 16px; font-size: 10px; font-weight: 700; border: 1px solid rgba(34, 211, 238, 0.4);
        }
        
        .pokemon-image-container {
          height: 180px; 
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(8, 145, 178, 0.15) 100%);
          position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center;
          margin: 0 20px; border-radius: 10px; border-bottom: 2px solid rgba(34, 211, 238, 0.25); z-index: 2;
        }
        @media (max-width: 768px) { .pokemon-image-container { height: 140px; } }
        .product-img { width: 100%; height: 100%; object-fit: cover; filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.8)); }
        
        .pokemon-info { padding: 15px 20px; z-index: 2; position: relative; flex-grow: 1; display: flex; flex-direction: column; }
        .pokemon-name { color: #22d3ee; font-size: 24px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px; } 
        @media (max-width: 768px) { .pokemon-name { font-size: 18px; } }
        
        .pokemon-description { color: rgba(176, 176, 176, 0.85); font-size: 13px; line-height: 1.4; font-style: italic; margin-bottom: auto; flex-grow: 1;}
        
        .front-actions { border-top: 1px solid rgba(61, 61, 61, 0.5); padding-top: 15px; margin-top: auto; display: flex; flex-direction: column; gap: 10px; z-index: 30; position: relative; }
        .price-tag { font-size: 20px; font-weight: bold; color: white; text-align: center; } 
        .front-btn-group { display: flex; gap: 10px; width: 100%; }
        .btn-beli-front { flex: 1; background: #22d3ee; color: black; font-weight: bold; padding: 12px; border-radius: 8px; transition: 0.2s; text-transform: uppercase; font-size: 12px; }
        .btn-beli-front:hover { background: #67e8f9; box-shadow: 0 0 15px rgba(34,211,238,0.5); }
        .btn-cart-front { flex: 1; background: transparent; border: 1px solid #22d3ee; color: #22d3ee; font-weight: bold; padding: 12px; border-radius: 8px; transition: 0.2s; text-transform: uppercase; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 5px;}
        .btn-cart-front:hover { background: rgba(34,211,238,0.1); }
        
        .back-content { padding: 30px 25px; display: flex; flex-direction: column; height: 100%; z-index: 2; position: relative; }
        .back-title { color: #22d3ee; font-size: 26px; font-weight: 900; text-align: center; text-transform: uppercase; border-bottom: 2px solid rgba(34, 211, 238, 0.35); padding-bottom: 10px; margin-bottom: 20px;}
        @media (max-width: 768px) { .back-title { font-size: 20px; } }
        .stat-item { background: linear-gradient(135deg, rgba(26, 26, 29, 0.8), rgba(13, 13, 15, 0.9)); padding: 12px; border-radius: 10px; border: 1px solid rgba(34, 211, 238, 0.2); margin-bottom: 10px; display: flex; justify-content: space-between;}
        .stat-label { color: #22d3ee; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .stat-value { color: white; font-size: 13px; font-weight: 700; }
        
        .buy-btn-container { margin-top: auto; z-index: 30; position: relative; }
        .buy-btn { width: 100%; background: #22d3ee; color: black; font-weight: bold; padding: 14px; border-radius: 12px; cursor: pointer; transition: 0.2s; text-transform: uppercase; letter-spacing: 1px;}
        .buy-btn:hover { background: #67e8f9; box-shadow: 0 0 15px rgba(34,211,238,0.5); transform: scale(1.02); }
        
        .card-click-area { position: absolute; top: 0; left: 0; width: 100%; height: 280px; z-index: 10; cursor: pointer; }

        .swiper-container-premium {
          padding-bottom: 60px !important; 
          position: relative;
        }
        .custom-swiper-button-prev, .custom-swiper-button-next {
          color: #22d3ee !important;
          background: rgba(15, 15, 19, 0.7) !important;
          backdrop-filter: blur(8px);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
          border: 1px solid rgba(34, 211, 238, 0.3);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
          z-index: 40 !important;
        }
        .custom-swiper-button-prev { left: -10px !important; }
        .custom-swiper-button-next { right: -10px !important; }
        
        @media (max-width: 768px) {
          .custom-swiper-button-prev, .custom-swiper-button-next {
            width: 35px !important;
            height: 35px !important;
          }
          .custom-swiper-button-prev { left: 0px !important; }
          .custom-swiper-button-next { right: 0px !important; }
        }

        .custom-swiper-button-prev:hover, .custom-swiper-button-next:hover {
          background: rgba(34, 211, 238, 0.1) !important;
          border: 1px solid rgba(34, 211, 238, 0.7);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
        }

        .swiper-pagination {
          position: absolute !important;
          bottom: 8px !important; 
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 6px;
        }
        .swiper-pagination-bullet {
          background: #22d3ee !important; 
          opacity: 0.3 !important;
          width: 10px !important;
          height: 10px !important;
          margin: 0 !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          transform: scale(1.3);
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.8); 
        }
      `}} />

      <div className="text-center mb-10 px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
          Katalog <span className="text-cyan-400">Premium</span>
        </h1>
        
        {/* PARAGRAF DENGAN HIGHLIGHT WARNA */}
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Solusi lengkap buat <span className="text-white font-medium">upgrade pengalaman main</span> lo. Temukan deretan produk unggulan kami: <span className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-default">Rank premium</span>, <span className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-default">item esensial</span>, <span className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-default">jasa setting server</span>, sampai <span className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-default">pembuatan plugin</span> dari nol.
        </p>

        {/* BADGE INSTRUKSI HUD STYLE DENGAN PULSING BEACON */}
        <div className="mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/10 via-[#0d0d0f] to-cyan-500/10 border border-cyan-500/30 rounded-full px-6 py-2.5 shadow-[0_0_15px_rgba(34,211,238,0.15)] relative overflow-hidden">
          
          {/* Animasi Titik Radar (Beacon) */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_8px_#22d3ee]"></span>
          </span>
          
          {/* Teks Instruksi */}
          <span className="text-cyan-300 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase">
            Klik Kartu Untuk Detail
          </span>
          
          {/* Garis Kilap (Glow Line) di bawah badge */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"></div>
        </div>
      </div>

      <div className="relative w-full">
        {/* Tombol Navigasi Kustom */}
        <button className="custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center text-cyan-400 bg-black/60 border border-cyan-500/30 w-12 h-12 rounded-full hover:bg-cyan-500 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all z-30">
          <ChevronLeft size={24} />
        </button>
        <button className="custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center text-cyan-400 bg-black/60 border border-cyan-500/30 w-12 h-12 rounded-full hover:bg-cyan-500 hover:text-black hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all z-30">
          <ChevronRight size={24} />
        </button>

        <Swiper
          /* INI DIA PECUTNYA: Paksa Swiper restart tiap ukuran layar ganti */
          key={isMobile ? 'mobile' : 'desktop'} 
          
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          spaceBetween={isMobile ? 20 : 0} 
          coverflowEffect={{
            rotate: 5,        
            stretch: isMobile ? 0 : 285,       
            depth: 150,       
            modifier: 2,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.custom-swiper-button-next',
            prevEl: '.custom-swiper-button-prev',
          }}
          modules={[EffectCoverflow, Pagination, Navigation]}
          className="w-full py-8 swiper-container-premium"
        >
          {displayProducts.map((product) => (
            <SwiperSlide key={`slider-${product.id}`} className="w-[320px]">
              <div className="card-container">
                <input type="checkbox" id={`flip-slider-${product.id}`} className="flip-card-checkbox" />
                
                <div className="ec-card">
                  <label htmlFor={`flip-slider-${product.id}`} className="card-click-area" title="Klik untuk lihat detail di belakang"></label>

                  {/* SISI DEPAN KARTU */}
                  <div className="ec-card-face ec-card-front">
                    <div className="card-header">
                      <span className="card-brand">EDELWEISS</span>
                      <div className="legendary-indicator">
                        <Crown size={12}/> {product.category}
                      </div>
                    </div>

                    <div className="pokemon-image-container">
                      <img src={product.imageUrl} alt={product.name} className="product-img" />
                    </div>

                    <div className="pokemon-info">
                      <div className="pokemon-name">{product.name}</div>
                      <div className="pokemon-description flex-grow">
                        "{product.description}"
                      </div>
                      
                      <div className="front-actions">
                        <div className="price-tag">Rp {product?.price?.toLocaleString('id-ID')}</div>
                        <div className="front-btn-group">
                          <button onClick={() => handleBuy(product)} className="btn-beli-front" disabled={invoiceLoading}>
                            {invoiceLoading ? 'Membuat...' : 'Beli Langsung'}
                          </button>
                          <button onClick={(e) => handleAddToCart(e, product.name)} className="btn-cart-front">
                            <ShoppingCart size={14} /> Add Card
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SISI BELAKANG KARTU */}
                  <div className="ec-card-face ec-card-back">
                    <div className="back-content">
                      <div className="back-title">{product.name}</div>
                      
                      <div className="stats-grid">
                        <div className="stat-item">
                          <span className="stat-label">Durasi</span>
                          <span className="stat-value">{product.stats?.durasi || 'Permanen'}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Akses Kit</span>
                          <span className="stat-value">{product.stats?.kit || 'Sesuai Rank'}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Kelebihan</span>
                          <span className="stat-value">{product.stats?.kelebihan || 'Akses Fitur Premium'}</span>
                        </div>
                      </div>

                      <div className="buy-btn-container">
                        <button onClick={() => handleBuy(product)} className="buy-btn" disabled={invoiceLoading}>
                          {invoiceLoading ? 'Membuat Invoice...' : 'Lanjut Beli'}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
          {displayProducts.length === 0 && (
            <div className="text-center py-12 text-gray-400 w-full">
              Belum ada produk yang ditandai sebagai Premium.
            </div>
          )}
        </Swiper>
      </div>

      {/* MODAL QRIS CHECKOUT (KATALOG) */}
      {modalOpen && currentInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in transition-all">
          <div className="bg-[#101014] border-2 border-[#3d3d3d] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.2)] relative">
            <button onClick={() => { setModalOpen(false); setCurrentInvoice(null); }} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors z-20 p-1.5 bg-[#1a1a24] rounded-full"><X size={20} /></button>
            <div className="p-6 border-b border-[#3d3d3d]/50 bg-[#1a1a24]/50 relative">
              <div className="absolute inset-0 bg-cyan-500/5 blur-xl"></div>
              <h3 className="text-xl md:text-2xl font-extrabold relative z-10 text-white tracking-tight">Invoice #{currentInvoice.id}</h3>
              <p className="text-sm text-gray-400 relative z-10">Item: <span className="text-cyan-400 font-bold uppercase tracking-wider">{currentInvoice.product?.name}</span></p>
            </div>
            <div className="p-7">
              <div className="flex flex-col items-center mb-6 p-5 bg-white rounded-2xl shadow-inner border-2 border-gray-200">
                <p className="text-black font-extrabold text-sm mb-3 text-center uppercase tracking-wider">Scan QRIS</p>
                <img src={gambarQris} alt="QRIS Edelweiss Craft" className="w-85 h-85 object-contain mb-3 border-2 border-gray-200 rounded-lg p-1 bg-white" />
                <p className="text-black text-2xl font-black tracking-tight">Rp {Number(currentInvoice.price).toLocaleString('id-ID')}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleCancel} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold">Batalkan Pesanan</button>
                <button onClick={handlePaid} className="flex-1 py-3 rounded-xl bg-cyan-500 text-black font-bold">Saya Sudah Membayar</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
