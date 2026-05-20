import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import supabase from '../lib/supabaseClient';
import { useNotif } from './NotifContext';
import { X, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Product } from '../types/product';
import gambarQris from '../assets/qris.jpg';

interface Ticket {
  id: string;
  ticket_code: string;
  product_name: string;
  price: number;
  status: 'open' | 'waiting_confirmation' | 'success' | 'canceled';
  user_id: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'player' | 'admin' | 'system' | 'system_invoice';
  message: string;
  created_at: string;
}

interface TicketContextType {
  activeTicket: Ticket | null;
  isPanelOpen: boolean;
  createTicket: (product: Product, isGuest?: boolean) => Promise<void>;
  openTicketPanel: () => void;
  closeTicketPanel: () => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<TicketMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const { showNotif } = useNotif();

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isPanelOpen]);

  /**
   * Mengecek status tiket aktif baik untuk Akun Login maupun Guest
   */
  useEffect(() => {
    const fetchActiveTicket = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Cek tiket untuk user yang login
        const { data } = await supabase.from('tickets').select('*').eq('user_id', user.id).in('status', ['open', 'waiting_confirmation']).order('created_at', { ascending: false }).limit(1).single();
        if (data) setActiveTicket(data);
      } else {
        // Cek tiket Guest dari LocalStorage
        const guestTicketId = localStorage.getItem('edelweiss_guest_ticket');
        if (guestTicketId) {
          const { data } = await supabase.from('tickets').select('*').eq('id', guestTicketId).in('status', ['open', 'waiting_confirmation']).single();
          if (data) {
            setActiveTicket(data);
          } else {
            // Bersihkan jika tiket sudah selesai atau batal oleh admin
            localStorage.removeItem('edelweiss_guest_ticket');
          }
        }
      }
    };

    fetchActiveTicket();
  }, []);

  /**
   * Subscribe Realtime untuk pesan dan status tiket
   */
  useEffect(() => {
    if (!activeTicket) return;

    const fetchMessages = async () => {
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', activeTicket.id).order('created_at', { ascending: true });
      setChatMessages(data || []);
    };
    
    fetchMessages();

    const channel = supabase.channel(`ticket_user_${activeTicket.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${activeTicket.id}` }, (payload) => {
          setChatMessages((prev) => [...prev, payload.new as TicketMessage]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `id=eq.${activeTicket.id}` }, (payload) => {
          setActiveTicket(payload.new as Ticket);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeTicket?.id]);

  /**
   * Fungsi Membuat Tiket (Mendukung Login & Guest)
   */
  const createTicket = async (product: Product, isGuest = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (activeTicket && (activeTicket.status === 'open' || activeTicket.status === 'waiting_confirmation')) {
        showNotif('Lo masih punya pesanan yang belum diselesaikan.', 'error');
        setIsPanelOpen(true);
        return;
      }

      let ticketCode = '';
      let username = '';
      let userId = null;

      if (isGuest) {
        // Logika pembuatan akun Guest
        const guestNum = Math.floor(1000 + Math.random() * 9000);
        username = `Guest_${guestNum}`;
        ticketCode = `GUEST#${guestNum}`;
      } else {
        // Logika untuk user yang sudah login
        username = user?.user_metadata?.username || 'Player';
        userId = user?.id || null;
        const { count } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('user_id', userId);
        const ticketSequence = String((count || 0) + 1).padStart(4, '0');
        ticketCode = `ORD#${ticketSequence}`;
      }

      // Insert ke tabel tickets di Supabase
      const { data: ticketData, error: ticketErr } = await supabase.from('tickets').insert({
        ticket_code: ticketCode,
        user_id: userId,
        username: username,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        status: 'open'
      }).select().single();

      if (ticketErr) throw ticketErr;

      // System ngirim gambar Invoice otomatis
      await supabase.from('ticket_messages').insert({
        ticket_id: ticketData.id,
        sender_type: 'system_invoice',
        message: 'Pesanan Dibuat'
      });

      // Simpan di memori browser kalau dia milih jalan sebagai Guest
      if (isGuest) {
        localStorage.setItem('edelweiss_guest_ticket', ticketData.id);
      }

      setActiveTicket(ticketData);
      setIsPanelOpen(true);
      showNotif(`Sesi chat pesanan berhasil dibuat.`, 'success');
    } catch (error: any) {
      showNotif('Gagal membuat pesanan: ' + (error.message || 'Kesalahan database'), 'error');
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !activeTicket) return;
    const msg = chatInput;
    setChatInput('');
    try {
      await supabase.from('ticket_messages').insert({
        ticket_id: activeTicket.id,
        sender_type: 'player',
        message: msg
      });
    } catch (e) {
      showNotif('Gagal mengirim pesan', 'error');
    }
  };

  const handleQuickAction = async (action: 'cancel' | 'paid') => {
    if (!activeTicket) return;
    
    const previousStatus = activeTicket.status;
    const newStatus = action === 'cancel' ? 'canceled' : 'waiting_confirmation';
    setActiveTicket({ ...activeTicket, status: newStatus });

    try {
      if (action === 'cancel') {
        await supabase.from('tickets').update({ status: 'canceled' }).eq('id', activeTicket.id);
        await supabase.from('ticket_messages').insert({ ticket_id: activeTicket.id, sender_type: 'system', message: 'Player membatalkan pesanan.' });
        localStorage.removeItem('edelweiss_guest_ticket'); // Hapus sesi Guest kalau dia batalin tiketnya
      } else if (action === 'paid') {
        await supabase.from('tickets').update({ status: 'waiting_confirmation' }).eq('id', activeTicket.id);
        await supabase.from('ticket_messages').insert({ ticket_id: activeTicket.id, sender_type: 'player', message: 'Saya sudah melakukan pembayaran.' });
        await supabase.from('ticket_messages').insert({ ticket_id: activeTicket.id, sender_type: 'system', message: 'Pembayaran sedang diproses dan diverifikasi oleh Admin.' });
      }
    } catch (e) {
      setActiveTicket({ ...activeTicket, status: previousStatus });
      showNotif('Gagal memproses aksi', 'error');
    }
  };

  return (
    <TicketContext.Provider value={{ activeTicket, isPanelOpen, createTicket, openTicketPanel: () => setIsPanelOpen(true), closeTicketPanel: () => setIsPanelOpen(false) }}>
      {children}
      
      {isPanelOpen && activeTicket && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 flex items-center justify-center p-0 md:p-4 w-full md:w-auto">
          <div className="bg-[#101014] border border-[#3d3d3d] md:rounded-2xl w-full h-[100vh] md:h-[600px] md:w-[400px] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.15)] animate-in slide-in-from-bottom-8 duration-300">
            
            <div className="p-4 border-b border-[#3d3d3d]/50 bg-[#1a1a24] flex justify-between items-center z-10 shadow-md">
              <div>
                <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                  PESANAN <span className="text-cyan-400">{activeTicket.ticket_code}</span>
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {activeTicket.status === 'open' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center gap-1"><Clock size={10}/> Menunggu Bayar</span>}
                  {activeTicket.status === 'waiting_confirmation' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1"><Clock size={10}/> Pemeriksaan Admin</span>}
                  {activeTicket.status === 'success' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1"><CheckCircle2 size={10}/> Selesai</span>}
                  {activeTicket.status === 'canceled' && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1"><AlertCircle size={10}/> Dibatalkan</span>}
                </div>
              </div>
              <button onClick={() => setIsPanelOpen(false)} className="text-gray-400 hover:text-white p-1.5 bg-[#0f0f13] rounded-full border border-gray-700 transition-colors"><X size={18} /></button>
            </div>
            
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#0d0d0f] to-[#121215]">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender_type === 'player' ? 'items-end' : 'items-start'}`}>
                  
                  {msg.sender_type === 'system_invoice' ? (
                    <div className="w-full bg-[#1a1a24] border border-[#3d3d3d] rounded-xl p-4 mb-2 shadow-lg">
                      <div className="flex justify-between items-start border-b border-gray-700 pb-2 mb-2">
                        <div>
                          <p className="text-[#22d3ee] font-black text-[10px] tracking-widest mb-0.5 uppercase">EDELWEISS INVOICE</p>
                          <h4 className="text-sm font-extrabold text-white uppercase">{activeTicket.product_name}</h4>
                        </div>
                      </div>
                      <div className="flex flex-col items-center bg-white p-3 rounded-xl">
                        <img src={gambarQris} alt="QRIS Edelweiss Craft" className="w-48 h-48 object-contain mb-2" />
                        <p className="text-gray-900 font-black text-sm">Rp {Number(activeTicket.price).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ) : msg.sender_type === 'system' ? (
                    <div className="w-full flex justify-center my-1">
                      <div className="bg-gray-800/60 text-gray-300 text-[10px] px-3 py-1.5 rounded-xl border border-gray-700 text-center">
                        {msg.message}
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-md ${msg.sender_type === 'player' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-[#1e293b] text-gray-200 border border-gray-700 rounded-bl-none'}`}>
                      <p className="text-[9px] font-bold mb-0.5 opacity-60 uppercase">{msg.sender_type === 'player' ? 'Anda' : 'Admin'}</p>
                      <p className="text-xs break-words whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#1a1a24] border-t border-[#3d3d3d]/50">
              {activeTicket.status === 'open' && (
                <div className="flex gap-2 mb-3">
                  <button onClick={() => handleQuickAction('cancel')} className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95">Batal</button>
                  <button onClick={() => handleQuickAction('paid')} className="flex-1 py-2 rounded-lg bg-cyan-500 text-black text-[10px] font-bold hover:bg-cyan-400 transition-all active:scale-95">Sudah Dibayar</button>
                </div>
              )}
              
              <div className="flex gap-2 items-center bg-[#0f0f13] border border-gray-700 rounded-xl p-1 focus-within:border-cyan-500 transition-colors">
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder={activeTicket.status === 'canceled' || activeTicket.status === 'success' ? "Tiket ditutup..." : "Ketik pesan..."}
                  disabled={activeTicket.status === 'canceled' || activeTicket.status === 'success'}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-white px-2 disabled:opacity-50 focus:outline-none"
                />
                <button 
                  onClick={sendChatMessage}
                  disabled={!chatInput.trim() || activeTicket.status === 'canceled' || activeTicket.status === 'success'}
                  className="p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:bg-gray-700 transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </TicketContext.Provider>
  );
};

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTicket harus digunakan di dalam TicketProvider');
  return context;
};