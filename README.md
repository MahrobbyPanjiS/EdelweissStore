<div align="center">
  <img src="./src/assets/hero.png" alt="Edelweiss Craft Web Store Banner" width="100%" style="border-radius: 12px; margin-bottom: 20px;">

  <h1>🌌 Edelweiss Craft - Official Web Store</h1>
  
  <p>Portal web store, panduan, dan manajemen akun terintegrasi untuk komunitas server Minecraft RPG <b>Edelweiss Craft</b>.</p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4">
    <img src="https://img.shields.io/badge/GSAP-Animation-green?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP">
  </p>
</div>

---

## 🚀 Fitur Utama

- **🎮 Beranda Dinamis & Status Server**: Menampilkan jumlah pemain online secara *real-time* langsung dari API server Minecraft beserta sliders cuplikan komunitas yang ciamik menggunakan animasi **GSAP & ScrollTrigger**.
- **🛒 Katalog Store Teroptimasi**: Sistem *grid layout* produk (rank, item, kosmetik) yang responsif dan *mobile-friendly*, dilengkapi dengan keranjang belanja interaktif.
- **📜 Wiki & Panduan Server**: Dokumentasi lengkap sistem *tier rank*, perintah dasar (*commands in-game*), serta hak akses fasilitas player yang dikemas menggunakan komponen *accordion accordion-fold*.
- **🧍 3D Skin Viewer**: Fitur penampil karakter 3D interaktif pada halaman Profil menggunakan **Skinview3D** yang mendukung kustomisasi URL skin serta kontrol animasi karakter (*idle, walk, run, fly, spin*).
- **🛠️ Admin Panel (CMS)**: Dashboard kendali penuh untuk mengelola konfigurasi maintenance server, pembuatan berita/patch notes baru, serta manajemen harga katalog produk toko.

---

## 📂 Struktur Folder (Clean & Scalable Architecture)

Project ini menggunakan standarisasi struktur folder modular profesional agar mudah dikembangkan dalam skala besar:

```text
frontend/
├── public/                 # Aset statis global yang disajikan apa adanya (misal: favicon, icon SVG)
└── src/
    ├── assets/             # Gambar, logo, font, dan berkas media lokal pendukung komponen
    ├── components/         # Komponen UI satuan yang reusable (tombol, kartu, modal kecil)
    ├── layout/             # Komponen struktural pembungkus halaman (Navbar, Footer, Sidebar)
    ├── pages/              # Komponen halaman utama dan routing (Home, Store, Wiki, Profile, dll)
    ├── services/           # Logika pemanggilan API eksternal dan integrasi data backend
    ├── utils/              # Fungsi pembantu (helper functions) dan utilitas global
    ├── App.css             # Gaya CSS utama cakupan global
    ├── App.tsx             # Pengatur routing utama aplikasi
    ├── index.css           # Konfigurasi dan injeksi Tailwind CSS v4
    └── main.tsx            # Entry point utama aplikasi React
