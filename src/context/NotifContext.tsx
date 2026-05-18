import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

type NotifType = 'success' | 'error' | 'warning';

interface NotifContextType {
  showNotif: (message: string, type?: NotifType) => void;
}

const NotifContext = createContext<NotifContextType | undefined>(undefined);

export function NotifProvider({ children }: { children: React.ReactNode }) {
  const [notif, setNotif] = useState<{ message: string; type: NotifType } | null>(null);

  // Efek menghilang otomatis dalam 3 detik
  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  // Fungsi yang bakal dipanggil file lain buat memunculkan pop-up
  const showNotif = (message: string, type: NotifType = 'success') => {
    setNotif({ message, type });
  };

  return (
    <NotifContext.Provider value={{ showNotif }}>
      {children}
      
      {/* UI HUD NOTIFICATION YANG MUNCUL DI TENGAH ATAS */}
      {notif && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center animate-in slide-in-from-top-10 fade-in duration-300 pointer-events-none">
          <div className={`bg-[#0f0f13]/95 backdrop-blur-md border px-5 py-2.5 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden relative ${
            notif.type === 'error' ? 'border-red-500/50' :
            notif.type === 'warning' ? 'border-yellow-500/50' :
            'border-cyan-500/50'
          }`}>
            
            {/* Gonta-ganti Ikon Sesuai Tipe Error/Sukses */}
            {notif.type === 'error' && <XCircle size={18} className="text-red-400" />}
            {notif.type === 'warning' && <AlertTriangle size={18} className="text-yellow-400" />}
            {notif.type === 'success' && <CheckCircle2 size={18} className="text-cyan-400" />}
            
            <span className="text-white text-xs md:text-sm font-bold tracking-wide uppercase">
              {notif.message}
            </span>
            
            {/* Garis Progress Bar 3 Detik */}
            <div className={`absolute bottom-0 left-0 h-[2px] hud-progress-bar ${
              notif.type === 'error' ? 'bg-gradient-to-r from-transparent via-red-400 to-red-200' :
              notif.type === 'warning' ? 'bg-gradient-to-r from-transparent via-yellow-400 to-yellow-200' :
              'bg-gradient-to-r from-transparent via-cyan-400 to-cyan-200'
            }`}></div>
          </div>
        </div>
      )}

      {/* Animasi Garis Menyusut */}
      <style dangerouslySetInnerHTML={{__html: `
        .hud-progress-bar { animation: hudShrink 3s linear forwards; }
        @keyframes hudShrink { 0% { width: 100%; } 100% { width: 0%; } }
      `}} />
    </NotifContext.Provider>
  );
}

// Custom Hook biar file lain gampang manggilnya
export const useNotif = () => {
  const context = useContext(NotifContext);
  if (!context) throw new Error("useNotif harus di dalam NotifProvider");
  return context;
};