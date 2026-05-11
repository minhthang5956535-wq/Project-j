// src/pages/user/OrderHistory.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory({ username }) {
  const [myOrders, setMyOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy tất cả đơn hàng từ máy
    let allOrders = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('mood_fpv_orders'));
      allOrders = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      allOrders = [];
    }
    // Lọc theo user nếu muốn
    setMyOrders(allOrders);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0a0a0c] p-6 py-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-white uppercase italic border-l-4 border-[#f59e0b] pl-4">Lịch sử mua hàng</h2>
          <button onClick={() => navigate('/')} className="text-xs font-black text-gray-500 uppercase hover:text-[#f59e0b]">← Tiếp tục mua sắm</button>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-[#111111] p-20 rounded-3xl border border-white/5 text-center">
            <p className="text-gray-500 font-bold italic">Bạn chưa có đơn hàng nào trong lịch sử! 🛒</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {myOrders.map((order) => (
              <div key={order.id} className="bg-[#111111] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all">
                <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Mã đơn hàng</span>
                    <span className="text-[#f59e0b] font-black italic text-lg">#{order.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Ngày đặt hàng</span>
                    <span className="text-white font-bold">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Trạng thái</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${order.status.includes('Đã gửi') ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="bg-[#1a1c28] rounded-2xl p-4 flex flex-col gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-2 last:pb-0">
                      <span className="text-gray-300 font-bold">{item.name}</span>
                      <span className="text-white font-black">{item.price.toLocaleString()}₫</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-black uppercase block">Tổng tiền</span>
                    <span className="text-xl font-black text-[#f59e0b] italic">{order.total.toLocaleString()}₫</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}