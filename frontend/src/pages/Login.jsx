import React, { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      const data = await response.json();

      if (response.ok) {
        login(data.user, data.access_token);
        // Redirect based on role
        if (data.user.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }
      } else {
        setError(data.message || 'Thông tin đăng nhập không chính xác.');
      }
    } catch (err) {
      setError('Không thể kết nối đến server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-[90vh] flex items-center justify-center py-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary-soft)] rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-100 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-40" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] glass p-10 rounded-[40px] shadow-2xl border-white relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary-soft)] rounded-3xl mb-6">
              <Lock className="text-[var(--primary)]" size={32} />
          </div>
          <h1 className="text-4xl font-black mb-3 font-['Outfit'] tracking-tight">Mừng bạn quay lại</h1>
          <p className="text-[var(--gray-light)] font-medium">Bắt đầu hành trình tìm kiếm nơi ở thượng lưu.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm font-bold mb-8 flex items-center gap-3"
          >
            <ShieldCheck size={18} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-500 pl-1 tracking-widest">Email đăng nhập</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@vidu.com"
                className="w-full pl-14 pr-6 py-5 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end pl-1 pr-1">
                <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Mật khẩu</label>
                <button type="button" className="text-xs font-bold text-[var(--primary)] hover:underline">Quên mật khẩu?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-5 bg-white/50 border-2 border-transparent rounded-[24px] focus:bg-white focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] outline-none transition-all font-semibold"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-premium py-5 rounded-[24px] font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 group mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                    Tiếp tục <ArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm font-medium text-[var(--gray-light)]">
            Bạn chưa có tài khoản? <br />
            <Link to="/register" className="text-[var(--primary)] font-black hover:underline inline-block mt-2">Đăng ký và khám phá ngay</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
