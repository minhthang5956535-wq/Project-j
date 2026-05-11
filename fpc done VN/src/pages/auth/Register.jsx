// src/pages/auth/Register.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Pilot điền thiếu thông tin rồi!");
    if (password !== confirmPassword) return alert("Mật khẩu nhập lại không khớp!");

    const existingUsers = JSON.parse(localStorage.getItem('mood_fpv_users')) || [];
    if (existingUsers.some(u => u.username === username)) {
      return alert("Tên Pilot này có người bay rồi, chọn tên khác đi cụ!");
    }

    existingUsers.push({ username, password });
    localStorage.setItem('mood_fpv_users', JSON.stringify(existingUsers));

    alert("🎉 Cấp bằng lái FPV thành công! Giờ cụ đăng nhập đi.");
    navigate('/login');
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center p-4 bg-[#0a0a0c]">
      <div className="bg-[#111111] p-10 rounded-3xl w-full max-w-md border border-white/5 shadow-2xl flex flex-col items-center">
        <div className="w-16 h-16 bg-[#f59e0b] rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-[#f59e0b]/20 mb-6">🛸</div>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest italic mb-8">Tạo Thẻ Pilot</h2>
        
        <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
          <input type="text" placeholder="Tên Pilot..." value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#1a1c28] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f59e0b] text-white text-sm font-bold transition-all" />
          <input type="password" placeholder="Mật khẩu..." value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1a1c28] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f59e0b] text-white text-sm font-bold transition-all" />
          <input type="password" placeholder="Xác nhận mật khẩu..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#1a1c28] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#f59e0b] text-white text-sm font-bold transition-all" />
          
          <button type="submit" className="w-full bg-[#f59e0b] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#d97706] mt-4 shadow-lg active:scale-95 transition-all">
            Đăng Ký Bay 🚀
          </button>
        </form>
        
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-8">
          Đã có bằng lái? <Link to="/login" className="text-[#f59e0b] hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}