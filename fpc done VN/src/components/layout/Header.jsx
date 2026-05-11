// src/components/layout/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function Header({ searchTerm, setSearchTerm }) {
  const { isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, username, setUsername } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false); setIsAdmin(false); setUsername('');
    toast.success("Đã đăng xuất!", {
      style: { background: '#333', color: '#f5c242' },
      iconTheme: { primary: '#f5c242', secondary: '#333' }
    }); 
    navigate('/');
  };

  return (
    <header className="w-full glass sticky top-0 z-[1000] border-b border-dark-border/50">
      <div className="max-w-[1400px] mx-auto px-4 h-20 flex justify-between items-center gap-8">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group relative">
          <div className="absolute -inset-3 bg-primary/5 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          {/* ICON */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:bg-primary/40 transition-all duration-500"></div>
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-yellow-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,194,66,0.4)] group-hover:shadow-[0_0_25px_rgba(245,194,66,0.6)] transition-all duration-500 group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-black group-hover:rotate-12 transition-transform duration-500">
                <path d="M4.5 4.5l4.5 4.5M19.5 4.5l-4.5 4.5M4.5 19.5l4.5-4.5M19.5 19.5l-4.5-4.5"/>
                <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
                <circle cx="4.5" cy="4.5" r="1.5" fill="currentColor"/>
                <circle cx="19.5" cy="4.5" r="1.5" fill="currentColor"/>
                <circle cx="4.5" cy="19.5" r="1.5" fill="currentColor"/>
                <circle cx="19.5" cy="19.5" r="1.5" fill="currentColor"/>
              </svg>
            </div>
          </div>

          {/* TEXT */}
          <div className="relative flex flex-col leading-none">
            <span className="text-[22px] font-black tracking-tight leading-none" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: '-0.02em' }}>
              <span className="text-white">Mood</span><span className="text-primary" style={{ textShadow: '0 0 20px rgba(245,194,66,0.5)' }}>FPV</span>
            </span>
            <span className="text-[8px] font-tech tracking-[0.3em] text-gray-500 uppercase mt-0.5 group-hover:text-primary/70 transition-colors duration-300">Let Your Mood Fly</span>
          </div>
        </Link>

        {/* THANH TÌM KIẾM */}
        <div className="flex-1 max-w-[500px] hidden md:flex relative">
          <div className="relative flex w-full">
            <input 
              type="text" 
              placeholder="Tìm khung, mạch FC, pin lipo, động cơ..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setSearchTerm(''); return; }
                if (e.key === 'Enter') {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="w-full bg-black/60 text-white placeholder-gray-600 border border-dark-border rounded-l-lg py-2.5 pl-4 pr-10 text-sm outline-none focus:border-primary focus:bg-black transition-all duration-300 focus:shadow-[0_0_15px_rgba(245,194,66,0.1)]" 
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="bg-primary hover:bg-yellow-400 transition-all duration-300 px-5 rounded-r-lg flex items-center justify-center text-black hover:shadow-[0_0_15px_rgba(245,194,66,0.4)] flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>

        {/* MENU LINK */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-tech font-bold text-gray-300 uppercase tracking-widest">
          <Link to="/?category=Phụ kiện FPV#products" className="hover:text-primary transition-colors hover:scale-105 transform">Phụ kiện FPV</Link>
          <Link to="/#flash-sale" className="hover:text-primary transition-colors hover:scale-105 transform flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Siêu Sale
          </Link>
        </nav>

        {/* USER & CART */}
        <div className="flex items-center gap-5">
          {!isLoggedIn ? (
            <Link to="/login" className="text-xs font-tech font-bold text-gray-300 hover:text-primary transition-colors border border-transparent hover:border-primary/50 px-4 py-2 rounded">
              Đăng nhập
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-xs font-tech font-bold text-gray-300">
              <Link to={isAdmin ? "/admin" : "/profile"} className="hover:text-primary flex items-center gap-2 bg-dark-card px-3 py-1.5 rounded-full border border-dark-border">
                <span className="w-5 h-5 bg-primary text-black flex items-center justify-center rounded-full text-[10px]">{isAdmin ? '👑' : '👤'}</span>
                {username}
              </Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 p-2" title="Đăng xuất">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          )}
          
          <button onClick={() => setIsCartOpen(true)} className="relative flex items-center justify-center w-10 h-10 bg-dark-card border border-dark-border rounded-lg hover:border-primary hover:text-primary transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-[0_0_10px_rgba(245,194,66,0.6)]">
              {cart ? cart.length : 0}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}