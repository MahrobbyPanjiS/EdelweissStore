import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Mengimpor komponen tata letak utama
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Mengimpor seluruh komponen halaman
import Home from './pages/Home';
import Store from './pages/Store';
import Wiki from './pages/Wiki';
import Help from './pages/Help';
import Profile from './pages/Profile'; 
import Settings from './pages/Settings'; 
import Login from './pages/Login';
import Register from './pages/Register';

// Mengimpor sistem penyedia konteks (Global State)
import { NotifProvider } from './context/NotifContext';
import { TicketProvider } from './context/TicketProvider';

export default function App() {
  return (
    // NotifProvider dan TicketProvider WAJIB membungkus struktur Router
    <NotifProvider>
      <TicketProvider>
        <Router>
          <div className="min-h-screen bg-[#0f0f13] text-white font-sans selection:bg-cyan-500 selection:text-white flex flex-col">
            
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/store" element={<Store />} />
                <Route path="/wiki" element={<Wiki />} />
                <Route path="/help" element={<Help />} />
                <Route path="/profile" element={<Profile />} /> 
                <Route path="/settings" element={<Settings />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            
            <Footer />
            
          </div>
        </Router>
      </TicketProvider>
    </NotifProvider>
  );
}