import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/register', { 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation,
        role: 'guest' 
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.access_token);
        navigate('/');
      } else {
        const errors = data.errors ? Object.values(data.errors).flat().join(' ') : data.message;
        setError(errors || 'Đăng ký không thành công.');
      }
    } catch (err) {
      setError('Không thể kết nối đến server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-[95vh] flex items-center justify-center py-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--primary-soft)] rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-40" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[550px] glass p-10 rounded-[40px] shadow-2xl border-white relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--secondary)]/10 rounded-2xl mb-6">
              <User className="text-[var(--secondary)]" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 font-['Outfit'] tracking-tighter">Bắt đầu trải nghiệm</h1>
          <p className="text-[var(--gray-light)] font-medium">Gia nhập cộng đồng cho thuê phòng lớn nhất onghai.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold mb-8 flex items-center gap-3"
          >
            <ShieldCheck size={20} /> {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500 pl-1 tracking-widest">Họ và tên</label>
                <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] outline-none transition-all font-bold text-sm"
                    required
                />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500 pl-1 tracking-widest">Email cá nhân</label>
                <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ten@mail.com"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] outline-none transition-all font-bold text-sm"
                    required
                />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500 pl-1 tracking-widest">Mật khẩu</label>
                <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] outline-none transition-all font-bold text-sm"
                    required
                />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500 pl-1 tracking-widest">Xác nhận</label>
                <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={18} />
                <input 
                    type="password" 
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] outline-none transition-all font-bold text-sm"
                    required
                />
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-premium py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 disabled:opacity-70 mt-6 group"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                    Tạo tài khoản ngay <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sm font-medium text-[var(--gray-light)]">
                Bạn đã có thẻ thành viên? <Link to="/login" className="text-[var(--primary)] font-black hover:underline ml-1">Đăng nhập</Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
