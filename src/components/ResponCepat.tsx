import React from 'react';

export default function ResponCepat() {
  return (
    <section className="py-8 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-8 text-center shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-white">Butuh Respon Cepat?</h2>
        <p className="text-gray-300 mb-6">Cara terbaik untuk mendapatkan bantuan adalah dengan membuka tiket di server Discord resmi kami. Tim staf kami aktif 24/7.</p>
        <a href="#" className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-[0_0_15px_rgba(88,101,242,0.4)]">
          Gabung Discord Kami
        </a>
      </div>
    </section>
  );
}