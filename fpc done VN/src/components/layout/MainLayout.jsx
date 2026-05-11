// src/layouts/MainLayout.jsx
// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import CartDrawer from '../components/common/CartDrawer';

// THÊM setIsLoggedIn và setIsAdmin VÀO ĐÂY
export default function MainLayout({ cart, setCart, isCartOpen, setIsCartOpen, username, isLoggedIn, searchTerm, setSearchTerm, setIsLoggedIn, setIsAdmin }) {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0c] flex flex-col font-sans overflow-x-hidden text-white">
      <Header 
        cartCount={cart.length} username={username} isLoggedIn={isLoggedIn} setIsCartOpen={setIsCartOpen} 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
        setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} // THÊM DÒNG NÀY
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
      <main className="w-full flex-1"><Outlet /></main>
      <footer className="w-full bg-[#111111] py-10 text-center border-t border-white/5">
        <p className="text-xs text-gray-600 font-bold tracking-widest uppercase italic">© 2026 MOOD FPV - Build by Nhóm cợt nhả TH01-CNTT</p>
      </footer>
    </div>
  );
}