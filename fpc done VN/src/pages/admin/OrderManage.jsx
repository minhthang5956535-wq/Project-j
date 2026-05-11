// src/pages/admin/OrderManage.jsx
import { useState, useEffect } from 'react';

export default function OrderManage() {
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn hàng từ LocalStorage ra
  useEffect(() => {
    let savedOrders = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('mood_fpv_orders'));
      savedOrders = Array.isArray(parsed) ? parsed : [];
    } catch {
      savedOrders = [];
    }
    setOrders(savedOrders);
  }, []);

  const handleApprove = (id) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: 'Đã gửi hàng ✈️' } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('mood_fpv_orders', JSON.stringify(updatedOrders));
  };

  const handleDelete = (id) => {
    if(window.confirm("Sếp muốn hủy đơn này thật á?")) {
      const remainingOrders = orders.filter(o => o.id !== id);
      setOrders(remainingOrders);
      localStorage.setItem('mood_fpv_orders', JSON.stringify(remainingOrders));
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase italic text-white border-l-4 border-[#f59e0b] pl-4">Quản lý Đơn hàng</h2>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1c28] text-gray-400 text-[10px] uppercase tracking-widest border-b border-white/5">
              <th className="p-4 font-black">Mã Đơn</th>
              <th className="p-4 font-black">Thời gian chốt</th>
              <th className="p-4 font-black">Sản phẩm (SL)</th>
              <th className="p-4 font-black">Tổng thu</th>
              <th className="p-4 font-black">Trạng thái</th>
              <th className="p-4 font-black text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-500 font-bold">Chưa có ai chốt đơn, Sếp đi chạy Ads đi!</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-xs font-bold text-[#f59e0b]">#{o.id}</td>
                  <td className="p-4 text-xs text-gray-400">{o.date}</td>
                  <td className="p-4 text-xs font-bold text-white">
                    {o.items.map(item => <div key={item.id}>• {item.name}</div>)}
                  </td>
                  <td className="p-4 text-sm font-black italic text-gray-300">{o.total.toLocaleString()}₫</td>
                  <td className="p-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${o.status.includes('Đã gửi') ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex flex-col gap-2 items-end">
                    {o.status.includes('chờ duyệt') && (
                      <button onClick={() => handleApprove(o.id)} className="text-[10px] font-black uppercase text-black bg-[#f59e0b] px-3 py-1.5 rounded transition hover:bg-[#d97706]">
                        Duyệt Đơn
                      </button>
                    )}
                    <button onClick={() => handleDelete(o.id)} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 px-3 py-1.5 transition">
                      Hủy
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}