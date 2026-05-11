// src/layouts/AdminLayout.jsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout({ setIsAdmin, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsAdmin(false);
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isOrdersTab = location.pathname.includes('/admin/orders');
  const isUsersTab = location.pathname.includes('/admin/users');
  const isDashboardTab = location.pathname === '/admin' || location.pathname === '/admin/';

  return (
    <div className="flex h-screen bg-dark text-white font-sans overflow-hidden">
      {/* SIDEBAR - THANH MENU DỌC */}
      <aside className="w-72 bg-dark-card/60 border-r border-dark-border flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="p-8 border-b border-dark-border flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(245,194,66,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black font-display uppercase tracking-widest text-shadow-sm">MOOD <span className="text-primary">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-3 relative z-10">
          <Link 
            to="/admin" 
            className={`px-5 py-4 font-tech uppercase text-xs rounded-xl tracking-widest transition-all duration-300 flex items-center gap-3 ${isDashboardTab ? 'bg-primary text-black shadow-[0_4px_20px_rgba(245,194,66,0.3)] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-dark-border'}`}
          >
            <span className="text-lg">📦</span> Quản lý Kho
          </Link>
          
          <Link 
            to="/admin/orders" 
            className={`px-5 py-4 font-tech uppercase text-xs rounded-xl tracking-widest transition-all duration-300 flex items-center gap-3 ${isOrdersTab ? 'bg-primary text-black shadow-[0_4px_20px_rgba(245,194,66,0.3)] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-dark-border'}`}
          >
            <span className="text-lg">📝</span> Lịch sử Giao dịch
          </Link>

          <Link 
            to="/admin/users" 
            className={`px-5 py-4 font-tech uppercase text-xs rounded-xl tracking-widest transition-all duration-300 flex items-center gap-3 ${isUsersTab ? 'bg-primary text-black shadow-[0_4px_20px_rgba(245,194,66,0.3)] font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent hover:border-dark-border'}`}
          >
            <span className="text-lg">👥</span> Quản lý Pilot
          </Link>
        </nav>

        <div className="p-6 border-t border-dark-border relative z-10 flex flex-col gap-3">
          <Link to="/" className="w-full px-4 py-4 border border-primary/20 text-primary font-tech font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary hover:text-black hover:border-primary shadow-[0_0_15px_rgba(245,194,66,0.1)] transition-all duration-300 flex justify-center items-center gap-2">
            Về trang chủ
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a2.25 2.25 0 0 0-2.25-2.25h-3a2.25 2.25 0 0 0-2.25 2.25V21m12-9-9-9-9 9m18 0-9-9-9 9" />
            </svg>
          </Link>
          <button onClick={handleLogout} className="w-full px-4 py-4 border border-red-500/20 text-red-500 font-tech font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm transition-all duration-300 flex justify-center items-center gap-2">
            Thoát phiên làm việc
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-dark">
        <header className="h-24 border-b border-dark-border glass flex items-center justify-between px-10 relative z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-display font-black uppercase text-gray-100 tracking-wider">Hệ thống Điều khiển</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-tech font-bold text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 tracking-widest">QUYỀN LỰC TỐI CAO</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-10 relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
