// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import CartDrawer from '../components/common/CartDrawer';

export default function MainLayout({ cart, setCart, isCartOpen, setIsCartOpen, searchTerm, setSearchTerm }) {
  return (
    <div className="w-full min-h-screen flex flex-col font-sans">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
      
      <main className="w-full flex-1 bg-[#f5f6f8]"><Outlet /></main>
      
      {/* FOOTER PREMIUM DARK */}
      <footer className="w-full bg-[#080809] border-t border-white/5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-primary/5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-32 bg-primary/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">

          {/* CAM KẾT - 4 CỘT */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-white/5">
            {[
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />, title: "Miễn phí vận chuyển", desc: "Đơn hàng trên 3,000,000 VNĐ" },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.990" />, title: "Cam kết hoàn tiền", desc: "Đổi trả nếu nhận sai sản phẩm" },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />, title: "Miễn phí tư vấn", desc: "Lắp đặt, Tune PID, dựng mới" },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />, title: "100% Bảo mật", desc: "Thông tin khách hàng được mã hóa" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center py-10 px-6 border-r border-white/5 last:border-r-0 group hover:bg-white/[0.02] transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    {item.icon}
                  </svg>
                </div>
                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* LINKS + LOGO */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 py-14">
            {/* BRAND */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black"><path d="M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/></svg>
                </div>
                <span className="text-white font-black text-lg tracking-wider">MOOD<span className="text-primary">FPV</span></span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed mb-6">Chuyên cung cấp linh kiện FPV chính hãng. Tư vấn, lắp ráp và hỗ trợ kỹ thuật chuyên nghiệp.</p>
              <div className="flex flex-col gap-2 text-xs text-gray-500">
                <span>📍 Số 16 Phố Đê Tô Hoàng, Bách Khoa, Hà Nội</span>
                <span>✉️ moodfpv@gmail.com</span>
              </div>
            </div>

            {/* DANH MỤC */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-primary inline-block"></span> Sản phẩm
              </h3>
              <div className="flex flex-col gap-3">
                {['FPV Drones', 'Bộ Khung Frame Kit', 'Mạch Điều Khiển FC', 'Động cơ Motor', 'Pin Lipo FPV', 'Bộ Phát Hình VTX', 'Kính FPV Goggles', 'Camera FPV'].map(cat => (
                  <a key={cat} href="#products" className="text-gray-500 text-xs hover:text-primary transition-colors hover:translate-x-1 inline-block transform">{cat}</a>
                ))}
              </div>
            </div>

            {/* HỖ TRỢ */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-primary inline-block"></span> Hỗ trợ
              </h3>
              <div className="flex flex-col gap-3">
                {['Câu hỏi thường gặp', 'Chính sách mua hàng', 'Chính sách đổi trả', 'Chính sách vận chuyển', 'Hướng dẫn thanh toán'].map(link => (
                  <a key={link} href="#" className="text-gray-500 text-xs hover:text-primary transition-colors hover:translate-x-1 inline-block transform">{link}</a>
                ))}
              </div>
            </div>

            {/* LIÊN HỆ */}
            <div>
              <h3 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <span className="w-4 h-[2px] bg-primary inline-block"></span> Kết nối
              </h3>
              <p className="text-gray-500 text-xs mb-5 leading-relaxed">Theo dõi MoodFPV để cập nhật sản phẩm mới và khuyến mãi hấp dẫn.</p>
              <div className="flex gap-3">
                {[
                  { label: 'FB', color: '#1877F2' },
                  { label: 'YT', color: '#FF0000' },
                  { label: 'TK', color: '#000000' },
                ].map(s => (
                  <a key={s.label} href="#" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* COPYRIGHT */}
          <div className="border-t border-white/5 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-gray-600 text-xs">© 2025 MoodFPV. All rights reserved. Let Your Mood Fly 🚁</p>
            <p className="text-gray-700 text-[10px] font-tech">BUILT FOR PILOTS · POWERED BY PASSION</p>
          </div>
        </div>
      </footer>
    </div>
  );
}