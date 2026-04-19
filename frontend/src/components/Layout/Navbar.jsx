import React, { useState, useEffect } from 'react';
import { Search, Globe, Menu, User, UserCircle, LogOut, Heart, Bell, LayoutDashboard, ShieldCheck, Clock } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
        navigate(`/?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
        navigate('/');
    }
  };

  const isDarkBanner = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass py-3 shadow-lg' 
        : 'bg-transparent py-6'
    }`}>
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
             <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-white" aria-hidden="true" role="presentation" focusable="false">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.39 3.641-6.641 3.641-3.47 0-6.32-2.413-6.32-6.452 0-1.058.209-2.024.606-3.268l.167-.516c.403-1.166 4.755-10.45 7.276-15.851l.13-.279c1.63-3.496 3.638-5.12 5.687-5.12zm0 2.532c-1.288 0-2.523 1.253-3.95 4.309l-.45 1.01c-2.542 5.45-6.864 14.654-7.257 15.788l-.136.424c-.315 1.003-.476 1.785-.476 2.493 0 2.859 1.899 3.936 3.841 3.936 1.33 0 2.8-1.073 4.416-2.713l.215-.223c1.677-1.728 3.19-2.726 4.012-2.726s2.335.998 4.012 2.726l.215.223c1.616 1.64 3.086 2.713 4.416 2.713 1.941 0 3.878-1.077 3.878-3.977 0-.505-.132-1.147-.62-2.31l-.154-.356c-.945-2.21-5.077-10.85-7.04-14.708l-.534-1.025c-1.084-1.927-2.073-2.669-3.23-2.669zm0 10.326a3.39 3.39 0 1 1 0 6.78 3.39 3.39 0 0 1 0-6.78zm0 2.542a.847.847 0 1 0 0 1.695.847.847 0 0 0 0-1.695z"></path>
             </svg>
          </div>
          <span className={`text-2xl font-black font-['Outfit'] hidden sm:block tracking-tight ${!isScrolled && isDarkBanner ? 'text-white' : 'text-gray-900 group-hover:text-[var(--primary)]'}`}>Ông Hai Home</span>
        </Link>

        {/* Search Bar - Desktop Premium */}
        <motion.form 
            onSubmit={handleSearch}
            initial={false}
            animate={{ 
                scale: isScrolled ? 0.9 : 1,
            }}
            className={`hidden md:flex items-center border border-gray-200/50 rounded-full py-1.5 pl-6 pr-1.5 shadow-sm hover:shadow-xl transition-all bg-white group ring-4 ring-transparent focus-within:ring-[var(--primary-soft)]`}
        >
          <div className="flex items-center">
            <div className="pr-6 min-w-[200px]">
                <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-[var(--primary)] transition-colors">Địa điểm</p>
                <input 
                    type="text" 
                    placeholder="Tìm kiếm căn hộ..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="text-sm font-bold text-gray-800 bg-transparent outline-none w-full"
                />
            </div>
            <div className="px-6 border-l border-gray-100 hidden lg:block">
                <p className="text-[10px] font-black uppercase text-gray-400">Thời gian</p>
                <p className="text-sm font-bold text-gray-800">Bất kỳ tuần nào</p>
            </div>
          </div>
          <button type="submit" className="bg-[var(--primary)] w-10 h-10 rounded-full text-white flex items-center justify-center ml-2 shadow-lg hover:scale-105 active:scale-95 transition-transform">
            <Search size={18} strokeWidth={3} />
          </button>
        </motion.form>

        {/* Right Menu */}
        <div className="flex items-center gap-4">
          <div className={`hidden lg:block text-sm font-bold cursor-pointer hover:bg-white/10 px-4 py-2 rounded-full transition-all ${!isScrolled && isDarkBanner ? 'text-white' : 'text-gray-800'}`}>
             Dành cho Chủ nhà
          </div>

          {user && user.role === 'admin' && (
            <Link 
                to="/admin" 
                className="hidden lg:flex items-center gap-2 text-sm font-black bg-[var(--primary)] text-white px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all"
            >
                <LayoutDashboard size={16} /> TRÌNH QUẢN TRỊ
            </Link>
          )}
          
          <button className={`p-2.5 rounded-full transition-all ${!isScrolled && isDarkBanner ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-gray-100'}`}>
            <Globe size={20} />
          </button>

          <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 border rounded-full p-1.5 pl-4 transition-all shadow-sm hover:shadow-xl cursor-pointer bg-white border-gray-200 ${showUserMenu ? 'shadow-inner scale-95' : ''}`}
              >
                <Menu size={18} className="text-gray-600" />
                <div className="relative">
                    {user ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-pink-400 flex items-center justify-center text-white text-xs font-black shadow-md border-2 border-white">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <User size={18} />
                        </div>
                    )}
                    {user && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
              </button>

              <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl py-3 border border-gray-100 overflow-hidden"
                >
                    {user ? (
                        <>
                            <div className="px-6 py-4 border-b border-gray-100 mb-2">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Tài khoản</p>
                                <p className="font-bold text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                            <Link to="/notifications" onClick={() => setShowUserMenu(false)} className="w-full text-left px-6 py-3 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <Bell size={18} className="text-gray-400" /> Thông báo
                            </Link>
                            <Link to="/wishlist" onClick={() => setShowUserMenu(false)} className="w-full text-left px-6 py-3 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <Heart size={18} className="text-gray-400" /> Danh sách yêu thích
                            </Link>
                            <Link to="/bookings" onClick={() => setShowUserMenu(false)} className="w-full text-left px-6 py-3 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center gap-3">
                                <Clock size={18} className="text-gray-400" /> Lịch sử giao dịch
                            </Link>
                            
                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin" 
                                    onClick={() => setShowUserMenu(false)}
                                    className="w-full text-left px-6 py-3 text-sm font-black text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors flex items-center gap-3"
                                >
                                    <LayoutDashboard size={18} /> Quản trị hệ thống
                                </Link>
                            )}
                            <div className="h-px bg-gray-100 my-2" />
                            <button onClick={() => { logout(); setShowUserMenu(false); }} className="w-full text-left px-6 py-4 text-sm font-black text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3">
                                <LogOut size={18} /> Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" onClick={() => setShowUserMenu(false)} className="block px-6 py-4 text-sm font-black hover:bg-gray-50 transition-colors">Đăng ký</Link>
                            <Link to="/login" onClick={() => setShowUserMenu(false)} className="block px-6 py-3 text-sm font-bold hover:bg-gray-50 transition-colors">Đăng nhập</Link>
                        </>
                    )}
                </motion.div>
              )}
              </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
