import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  Globe, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-slate-300 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <Link to="/" className="inline-flex items-center gap-2 group flex-shrink-0">
               <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white ring-4 ring-red-500/20 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415.001.228c0 4.062-2.877 6.478-6.357 6.478-2.224 0-4.556-1.258-6.709-3.386l-.257-.26-.172-.179h-.011l-.176.185c-2.044 2.1-4.39 3.641-6.641 3.641-3.47 0-6.32-2.413-6.32-6.452 0-1.058.209-2.024.606-3.268l.167-.516c.403-1.166 4.755-10.45 7.276-15.851l.13-.279c1.63-3.496 3.638-5.12 5.687-5.12zm0 2.532c-1.288 0-2.523 1.253-3.95 4.309l-.45 1.01c-2.542 5.45-6.864 14.654-7.257 15.788l-.136.424c-.315 1.003-.476 1.785-.476 2.493 0 2.859 1.899 3.936 3.841 3.936 1.33 0 2.8-1.073 4.416-2.713l.215-.223c1.677-1.728 3.19-2.726 4.012-2.726s2.335.998 4.012 2.726l.215.223c1.616 1.64 3.086 2.713 4.416 2.713 1.941 0 3.878-1.077 3.878-3.977 0-.505-.132-1.147-.62-2.31l-.154-.356c-.945-2.21-5.077-10.85-7.04-14.708l-.534-1.025c-1.084-1.927-2.073-2.669-3.23-2.669zm0 10.326a3.39 3.39 0 1 1 0 6.78 3.39 3.39 0 0 1 0-6.78zm0 2.542a.847.847 0 1 0 0 1.695.847.847 0 0 0 0-1.695z" fill="currentColor"></path>
                  </svg>
               </div>
               <span className="text-2xl font-black font-['Outfit'] text-white tracking-tight">Ông Hai Home</span>
            </Link>
            <p className="text-zinc-400 leading-relaxed font-medium">
              Kiến tạo những chuẩn mực mới trong dịch vụ lưu trú. Mang đến trải nghiệm nghỉ dưỡng 5 sao cá nhân hóa cho từng khách hàng.
            </p>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-xs tracking-widest italic">Hệ thống</h4>
            <nav className="flex flex-col gap-4">
              {['Về chúng tôi', 'Danh sách căn hộ', 'Chính sách bảo mật', 'Điều khoản dịch vụ', 'Liên hệ'].map((link) => (
                <a key={link} href="#" className="text-zinc-400 hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group font-medium">
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all text-red-500" />
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-xs tracking-widest italic">Liên hệ</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-red-500 flex-shrink-0"><MapPin size={20} /></div>
                <p className="text-zinc-400 text-sm font-medium">
                  Landmark 81, Vinhomes Central Park, <br />
                  Q. Bình Thạnh, TP. Hồ Chí Minh
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-red-500 flex-shrink-0"><Phone size={20} /></div>
                <p className="text-zinc-400 font-bold">0911 798 840</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-red-500 flex-shrink-0"><Mail size={20} /></div>
                <p className="text-zinc-400 text-sm font-medium">huythang@onghaihome.com</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-xs tracking-widest italic">Nhận ưu đãi</h4>
            <p className="text-zinc-400 text-sm font-medium">Đăng ký để nhận thông báo về các căn hộ mới và ưu đãi lên đến 30% hàng tháng.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="w-full bg-zinc-800 border-none rounded-xl py-4 pl-6 pr-14 text-sm font-bold text-white focus:ring-2 focus:ring-red-500 transition-all outline-none"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors">
                 <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-500">
             <span>© 2026 Ông Hai Home</span>
             <span className="hidden md:block text-zinc-800">|</span>
             <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Hệ thống bảo mật 2 lớp</span>
             <span className="hidden md:block text-zinc-800">|</span>
             <span className="flex items-center gap-1.5"><Heart size={14} className="text-red-500" /> Phát triển bởi Huỳnh Minh Thắng</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-xs font-bold hover:text-white transition-colors">
              <Globe size={16} /> Tiếng Việt (VNĐ)
            </button>
            <div className="flex gap-3">
               {['Visa', 'Mastercard', 'MoMo', 'VietQR'].map(pay => (
                 <div key={pay} className="px-2 py-1 rounded bg-zinc-800 text-[8px] font-black italic tracking-tighter opacity-50">{pay}</div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
