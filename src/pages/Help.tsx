import React from 'react';
import { LifeBuoy } from 'lucide-react';

export default function Help() {
  const faqs = [
    { q: "Berapa lama proses item masuk setelah pembayaran?", a: "Karena menggunakan verifikasi manual, proses membutuhkan waktu antara 5 hingga 30 menit. Jika admin sedang online, item akan langsung diproses." },
    { q: "Apakah saya kehilangan rank jika server reset (Wipe)?", a: "Tidak. Semua rank donasi bersifat permanen atau sesuai durasi paket, dan akan dikembalikan secara otomatis setelah server di-wipe." },
    { q: "Bagaimana cara klaim hadiah (kit) dari rank saya?", a: "Gunakan perintah /kit di dalam game. Menu akan terbuka dan Anda bisa memilih kit yang sesuai dengan rank yang Anda miliki." }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <LifeBuoy className="mx-auto text-cyan-400 mb-4" size={48} />
        <h1 className="text-4xl font-bold mb-4">Pusat Bantuan</h1>
        <p className="text-gray-400">Punya masalah di dalam server atau pertanyaan seputar donasi? Kami siap membantu.</p>
      </div>

      <div className="bg-[#1e293b]/30 border border-gray-800 rounded-2xl p-8 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Butuh Respon Cepat?</h2>
        <p className="text-gray-300 mb-6">Cara terbaik untuk mendapatkan bantuan adalah dengan membuka tiket di server Discord resmi kami. Tim staf kami aktif 24/7.</p>
        <a href="#" className="inline-flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 rounded-xl font-bold transition-transform active:scale-95">
          Gabung Discord Kami
        </a>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold mb-6 border-b border-gray-800 pb-2">Pertanyaan Umum (FAQ)</h3>
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[#0f0f13] border border-gray-800 p-5 rounded-xl">
            <h4 className="font-bold text-white mb-2 flex gap-2"><span className="text-cyan-400">Q:</span> {faq.q}</h4>
            <p className="text-sm text-gray-400 flex gap-2"><span className="text-green-500 font-bold">A:</span> {faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}