// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export default function Login({ initialTab = 'login' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState(initialTab);

  // Trạng thái Form Đăng Nhập
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Trạng thái Form Đăng Ký
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Xử lý Đăng Nhập
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUser || !loginPass) return toast.error("Vui lòng nhập đủ thông tin!");

    // 1. NGẦM KIỂM TRA XEM CÓ PHẢI SẾP KHÔNG
    if (loginUser === 'admin' && loginPass === 'admin123') {
      login({ username: 'Admin', isAdmin: true });
      toast.success("Chào Sếp! Chúc sếp chốt nhiều đơn FPV.", {
        style: { background: '#333', color: '#f5c242' },
        iconTheme: { primary: '#f5c242', secondary: '#333' }
      });
      setTimeout(() => navigate('/admin'), 100);
      return;
    }

    // 2. GIAO TIẾP VỚI BACKEND
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      
      if (res.ok) {
        const data = await res.json();
        // Lấy thông tin user
        const userRes = await fetch('http://127.0.0.1:8000/api/auth/me/', {
          headers: { 'Authorization': 'Bearer ' + data.access }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          login({ username: userData.username, isAdmin: userData.is_staff });
          toast.success(`Chào mừng Pilot ${userData.username} 🚀`, {
            style: { background: '#333', color: '#f5c242' },
            iconTheme: { primary: '#f5c242', secondary: '#333' }
          });
          setTimeout(() => navigate('/'), 100);
          return;
        }
      }
    } catch (err) {
      console.log('Backend chưa sẵn sàng, dùng Local Storage.');
    }

    // 3. TÀI KHOẢN PILOT LOCAL (Fallback)
    const savedUsers = JSON.parse(localStorage.getItem('mood_fpv_users')) || [];
    const foundUser = savedUsers.find(u => (u.email === loginUser || u.username === loginUser) && u.password === loginPass);

    if (foundUser) {
      if (foundUser.isBanned) {
        return toast.error("Tài khoản của bạn đã bị Cấm Thể Bay! Vui lòng liên hệ Sếp.");
      }
      
      login({ username: foundUser.name || foundUser.username, isAdmin: false });
      toast.success(`Chào mừng Pilot ${foundUser.name || foundUser.username} 🚀`, {
        style: { background: '#333', color: '#f5c242' },
        iconTheme: { primary: '#f5c242', secondary: '#333' }
      });
      setTimeout(() => navigate('/'), 100);
    } else {
      toast.error("Sai Username/Email hoặc Mật khẩu rùi!");
    }
  };

  // Xử lý Đăng Ký
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) return toast.error("Điền thiếu thông tin kìa!");
    if (regPass !== regConfirm) return toast.error("Mật khẩu xác nhận không khớp!");

    // Backend Đăng ký API
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: regName, email: regEmail, password: regPass })
      });
      if (res.ok) {
        toast.success("Đăng ký thành công! Hãy đăng nhập.", { style: { background: '#333', color: '#f5c242' } });
        setRegName(''); setRegPhone(''); setRegEmail(''); setRegPass(''); setRegConfirm('');
        setActiveTab('login');
        return;
      }
    } catch (err) {
      console.log('Backend error, fallback to local storage');
    }

    const existingUsers = JSON.parse(localStorage.getItem('mood_fpv_users')) || [];
    if (existingUsers.some(u => u.email === regEmail)) return toast.error("Email này đã có người đăng ký!");

    existingUsers.push({ username: regName, name: regName, phone: regPhone, email: regEmail, password: regPass });
    localStorage.setItem('mood_fpv_users', JSON.stringify(existingUsers));

    toast.success("Đăng ký thành công! Hãy đăng nhập.", {
      style: { background: '#333', color: '#f5c242' }
    });
    setRegName(''); setRegPhone(''); setRegEmail(''); setRegPass(''); setRegConfirm('');
    setActiveTab('login'); // Tự động switch qua tab đăng nhập
  };

  return (
    <div className="w-full min-h-screen bg-dark py-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[80vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[480px] w-full glass rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-dark-border p-8 relative z-10 animate-fade-up">
        
        {/* TABS */}
        <div className="flex gap-6 mb-8 border-b border-white/10">
          <button 
            onClick={() => setActiveTab('login')}
            className={`pb-4 text-2xl font-black font-display uppercase tracking-wide transition-all ${
              activeTab === 'login' ? 'text-primary border-b-2 border-primary drop-shadow-[0_0_8px_rgba(245,194,66,0.5)]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            className={`pb-4 text-2xl font-black font-display uppercase tracking-wide transition-all ${
              activeTab === 'register' ? 'text-primary border-b-2 border-primary drop-shadow-[0_0_8px_rgba(245,194,66,0.5)]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* NỘI DUNG TABS */}
        <div className="w-full">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-6 animate-fade-in">
              <p className="text-gray-400 text-sm mb-2">Truy cập để quản lý đơn hàng, lưu sản phẩm và nhận khuyến mãi đặc quyền dành riêng cho Pilot FPV.</p>
              
              <div>
                <label className="text-[10px] font-tech font-bold text-gray-500 uppercase mb-2 block tracking-widest block">Tín hiệu nhận dạng (Email)</label>
                <input type="text" value={loginUser} onChange={e=>setLoginUser(e.target.value)} className="w-full bg-black/50 border border-dark-border text-white rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary focus:bg-black transition-colors" placeholder="pilot@gmail.com" />
              </div>
              
              <div>
                <label className="text-[10px] font-tech font-bold text-gray-500 uppercase mb-2 block tracking-widest block">Mật mã truy cập</label>
                <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} className="w-full bg-black/50 border border-dark-border text-white rounded-xl px-4 py-3.5 text-sm outline-none focus:border-primary focus:bg-black transition-colors" placeholder="••••••••" />
              </div>
              
              <div className="text-right mt-[-10px]">
                <button type="button" className="text-primary text-xs font-bold hover:underline">Quên mật mã?</button>
              </div>

              <button type="submit" className="mt-2 w-full bg-primary text-black py-4 rounded-xl font-tech font-black uppercase text-sm hover:bg-yellow-400 shadow-[0_0_15px_rgba(245,194,66,0.3)] hover:shadow-[0_0_20px_rgba(245,194,66,0.6)] transition-all tracking-widest transform hover:-translate-y-1">
                Đăng nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-5 animate-fade-in">
              <div>
                <label className="text-[10px] font-tech font-bold text-gray-500 uppercase mb-1 block">Tên Pilot (Full tên)</label>
                <input type="text" value={regName} onChange={e=>setRegName(e.target.value)} className="w-full bg-black/50 border border-dark-border text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-black transition-colors" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="text-[10px] font-tech font-bold text-gray-500 uppercase mb-1 block">Số điện thoại</label>
                <input type="tel" value={regPhone} onChange={e=>setRegPhone(e.target.value)} className="w-full bg-black/50 border border-dark-border text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-black transition-colors" placeholder="09xx..." />
              </div>
              <div>
                <label className="text-[10px] font-tech font-bold text-gray-500 uppercase mb-1 block">Email</label>
                <input type="email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} className="w-full bg-black/50 border border-dark-border text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-black transition-colors" placeholder="pilot@gmail.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-tech font-bold text-gray-500 uppercase mb-1 block">Mật khẩu</label>
                  <input type="password" value={regPass} onChange={e=>setRegPass(e.target.value)} className="w-full bg-black/50 border border-dark-border text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-black transition-colors" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-[10px] font-tech font-bold text-gray-500 uppercase mb-1 block">Xác nhận</label>
                  <input type="password" value={regConfirm} onChange={e=>setRegConfirm(e.target.value)} className="w-full bg-black/50 border border-dark-border text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:bg-black transition-colors" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" className="mt-4 w-full bg-transparent border border-primary text-primary py-4 rounded-xl font-tech font-black uppercase text-sm hover:bg-primary hover:text-black transition-all tracking-widest shadow-[0_0_15px_rgba(245,194,66,0.1)] hover:shadow-[0_0_20px_rgba(245,194,66,0.5)] transform hover:-translate-y-1">
                Đăng ký
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}