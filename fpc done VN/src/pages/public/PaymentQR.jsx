import { useEffect, useState, useMemo } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getUserRank } from '../../utils/userStats';

export default function PaymentQR({ cart, setCart, username }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Lấy billingDetails an toàn nhất có thể
  const billingDetails = useMemo(() => {
    try {
      return location.state?.billingDetails || {};
    } catch (e) {
      return {};
    }
  }, [location.state]);

  useEffect(() => {
    try {
      // 1. Kiểm tra giỏ hàng để tạo đơn hàng mới
      // Dùng state nội bộ để check tránh loop
      if (cart && Array.isArray(cart) && cart.length > 0) {
        const { discount } = getUserRank(username);
        const originalTotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
        const discountAmt = originalTotal * discount;
        const total = originalTotal - discountAmt;
        
        const newOrderData = {
          id: Math.floor(Math.random() * 90000 + 10000).toString(),
          date: new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }),
          username: username || 'Guest',
          billing: billingDetails,
          items: [...cart],
          originalTotal,
          discountAmount: discountAmt,
          total,
          status: 'Đang xử lý'
        };

        // Lưu vào storage an toàn
        const storedStr = localStorage.getItem('mood_fpv_orders');
        let existing = [];
        try {
          existing = storedStr ? JSON.parse(storedStr) : [];
          if (!Array.isArray(existing)) existing = [];
        } catch(e) { existing = []; }
        
        localStorage.setItem('mood_fpv_orders', JSON.stringify([newOrderData, ...existing]));
        
        setOrder(newOrderData);
        // Sau khi đã lưu đơn và setOrder xong mới xoá giỏ hàng
        setTimeout(() => setCart([]), 100);
      } 
      // 2. Nếu Refresh trang (giỏ hàng trống) -> Lấy đơn mới nhất
      else {
        const storedStr = localStorage.getItem('mood_fpv_orders');
        try {
          const parsed = storedStr ? JSON.parse(storedStr) : [];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrder(parsed[0]);
          } else {
            // Không thấy đơn nào cả
            setTimeout(() => { if (!order) navigate('/'); }, 3000);
          }
        } catch(e) {}
      }
    } catch (err) {
      console.error("Critical error in PaymentQR setup:", err);
      setErrorMsg("Hệ thống gặp sự cố khi tạo đơn hàng. Vui lòng thử lại.");
    }
  }, []); // Mount only

  // Giao diện Lỗi
  if (errorMsg) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Rất tiếc, đã có lỗi xảy ra</h2>
        <p className="text-gray-500 mb-6">{errorMsg}</p>
        <Link to="/" className="bg-black text-white px-8 py-3 rounded-lg font-bold">Quay lại trang chủ</Link>
      </div>
    );
  }

  // Giao diện Chờ
  if (!order) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Đang thiết lập thanh toán...</h2>
        <p className="text-gray-400 text-sm mt-2">Vui lòng chờ trong giây lát (nếu quá lâu hãy tải lại trang)</p>
      </div>
    );
  }

  // Giao diện Hóa đơn chính thức
  return (
    <div className="w-full min-h-screen bg-[#fcfcfc] py-12 px-4 flex justify-center text-gray-900 border-t border-gray-100">
      <div className="max-w-[1024px] w-full grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* CHI TIẾT ĐƠN HÀNG (TRÁI) */}
        <div className="md:col-span-7 flex flex-col gap-10">
          
          <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
             <h2 className="text-xl font-black uppercase mb-6 border-b pb-4">Đơn hàng của bạn đã được nhận</h2>
             <div className="grid grid-cols-2 gap-y-4 text-sm text-gray-500">
                <div>Mã đơn hàng: <strong className="text-black ml-1">{order.id}</strong></div>
                <div>Ngày đặt: <strong className="text-black ml-1">{order.date}</strong></div>
                <div>Tổng cộng: <strong className="text-black ml-1">{order.total?.toLocaleString()}₫</strong></div>
                <div>Phương thức: <strong className="text-black ml-1">Chuyển khoản</strong></div>
             </div>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
             <h2 className="text-lg font-bold mb-5 font-serif uppercase tracking-tight">Thông tin thanh toán</h2>
             <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
                <p className="text-xs uppercase font-bold text-amber-700 mb-3 tracking-widest">Tài khoản ngân hàng</p>
                <div className="space-y-1.5 text-sm">
                   <p><span className="text-gray-500">Người thụ hưởng:</span> <strong>Vu Hoang Le Anh</strong></p>
                   <p><span className="text-gray-500">Số tài khoản:</span> <strong>101870477380</strong></p>
                   <p><span className="text-gray-500">Ngân hàng:</span> <strong>Viettinbank</strong></p>
                   <p><span className="text-gray-500">Nội dung:</span> <strong className="text-primary bg-black px-2 py-0.5 rounded">Mood FPV {order.id}</strong></p>
                </div>
             </div>
             <p className="text-[11px] text-gray-400 italic">Mẹo: Bạn có thể dùng App ngân hàng quét mã QR bên phải để thanh toán nhanh hơn.</p>
          </div>

          <div className="bg-white p-8 border border-gray-200 shadow-sm rounded-xl overflow-x-auto">
             <h2 className="text-lg font-bold mb-4">Chi tiết vật phẩm</h2>
             <table className="w-full text-sm">
                <thead className="border-b-2 border-gray-50">
                   <tr>
                      <th className="text-left py-3 font-bold text-gray-400 uppercase text-[10px]">Sản phẩm</th>
                      <th className="text-right py-3 font-bold text-gray-400 uppercase text-[10px]">Thành tiền</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {order.items.map((it, i) => (
                      <tr key={i}>
                         <td className="py-4 text-gray-600 font-medium">{it.name} <span className="text-gray-400 ml-1">× 1</span></td>
                         <td className="py-4 text-right font-bold text-gray-900">{it.price?.toLocaleString()}₫</td>
                      </tr>
                   ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-50 bg-gray-50/30">
                   <tr>
                      <td className="py-3 px-4 font-medium text-gray-500">Tạm tính</td>
                      <td className="py-3 px-4 text-right font-bold">{order.originalTotal?.toLocaleString()}₫</td>
                   </tr>
                   {order.discountAmount > 0 && (
                      <tr className="text-green-600">
                         <td className="py-3 px-4 font-medium">Giảm giá</td>
                         <td className="py-3 px-4 text-right font-bold">-{order.discountAmount?.toLocaleString()}₫</td>
                      </tr>
                   )}
                   <tr className="text-lg">
                      <td className="py-4 px-4 font-bold">TỔNG CỘNG</td>
                      <td className="py-4 px-4 text-right font-black text-black">{order.total?.toLocaleString()}₫</td>
                   </tr>
                </tfoot>
             </table>
          </div>
        </div>

        {/* MÃ QR & TRẠNG THÁI (PHẢI) */}
        <div className="md:col-span-5 flex flex-col gap-6">
           <div className="bg-white p-8 border-2 border-black rounded-3xl shadow-xl flex flex-col items-center sticky top-24">
              <div className="w-full flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Đang chờ thanh toán</span>
                 </div>
                 <div className="text-[10px] font-bold text-gray-400 italic">#{order.id}</div>
              </div>

              {/* MÃ QR GIẢ LẬP */}
              <div className="w-full aspect-square bg-[#f9f9f9] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 mb-6">
                 <div className="w-full h-full border-4 border-black relative overflow-hidden bg-white p-2">
                    {/* HÌNH QR */}
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=MoMoPay:09xxx%20MoodFPV%20${order.id}`} 
                      alt="QR Code" 
                      className="w-full h-full"
                    />
                 </div>
              </div>

              <div className="text-center mb-6">
                 <p className="text-xs text-gray-500 mb-1">Quét mã bằng ứng dụng ngân hàng hoặc ví điện tử</p>
                 <p className="text-[15px] font-black text-black">TỔNG TIỀN: {order.total?.toLocaleString()}₫</p>
              </div>

              <button onClick={() => navigate('/')} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95">
                 Xác nhận đã chuyển
              </button>
              
              <Link to="/" className="mt-4 text-[10px] font-bold text-gray-400 uppercase hover:text-black transition-colors">Hủy đơn hàng này</Link>
           </div>
           
           <div className="bg-white p-6 border border-gray-200 rounded-2xl text-[11px] text-gray-400 leading-relaxed italic">
             Lưu ý: Sau khi nhận được thanh toán, chúng tôi sẽ tiến hành đóng gói và giao hàng trong vòng 24 - 48h. Email xác nhận đã được gửi đến địa chỉ của bạn.
           </div>
        </div>

      </div>
    </div>
  );
}