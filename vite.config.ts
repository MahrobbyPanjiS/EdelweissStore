import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Memuat konfigurasi Vite beserta plugin React dan Tailwind
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})