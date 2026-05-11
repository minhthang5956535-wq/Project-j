import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile({ username }) {
  const navigate = useNavigate();
  
  // Tabs
  const [activeTab, setActiveTab] = useState('account');

  // States cho form user
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [joinDate, setJoinDate] = useState('');

  // States cho orders
  const [myOrders, setMyOrders] = useState([]);

  // Nếu không có username (chưa đăng nhập), chuyển về trang chủ
  if (!username) {
    return <Navigate to="/login" replace />;
  }

  // Load thông tin từ localStorage khi component mount
  useEffect(() => {
    // Thông tin tài khoản
    const existingUsers = JSON.parse(localStorage.getItem('mood_fpv_users')) || [];
    const currentUser = existingUsers.find(u => u.username === username);
    if (currentUser) {
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setJoinDate(currentUser.joinDate || new Date().toISOString().split('T')[0]); // Mock join date
    }

    // Đơn hàng
    try {
      const parsed = JSON.parse(localStorage.getItem('mood_fpv_orders'));
      setMyOrders(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      setMyOrders([]);
    }
  }, [username]);

  const handleSave = (e) => {
    e.preventDefault();
    
    // Đọc danh sách users
    const existingUsers = JSON.parse(localStorage.getItem('mood_fpv_users')) || [];
    const userIndex = existingUsers.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
      // Cập nhật thông tin
      existingUsers[userIndex] = {
        ...existingUsers[userIndex],
        email,
        phone,
        address
      };
      // Lưu lại
      localStorage.setItem('mood_fpv_users', JSON.stringify(existingUsers));
      toast.success("Đã cập nhật thông tin thành công!", {
        style: { background: '#333', color: '#f5c242' },
        iconTheme: { primary: '#f5c242', secondary: '#333' }
      });
    } else {
      toast.error("Không tìm thấy người dùng!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f6f8] dark:bg-[#0a0a0c] py-10 px-4">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-6">
        
        {/* SIDEBAR */}
        <div className="w-full md:w-64 flex flex-col shrink-0">
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-5 py-4 font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'account' ? 'bg-gray-50 dark:bg-[#1a1c28] text-primary border-l-4 border-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              Tài khoản
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-5 py-4 font-bold text-sm flex items-center gap-3 transition-colors border-t border-gray-100 dark:border-white/5 ${activeTab === 'orders' ? 'bg-gray-50 dark:bg-[#1a1c28] text-primary border-l-4 border-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              Lịch sử đơn hàng
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`w-full text-left px-5 py-4 font-bold text-sm flex items-center gap-3 transition-colors border-t border-gray-100 dark:border-white/5 ${activeTab === 'transactions' ? 'bg-gray-50 dark:bg-[#1a1c28] text-primary border-l-4 border-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
              </svg>
              Lịch sử giao dịch
            </button>
          </div>
        </div>

        {/* MAIN CONTENT VÙNG */}
        <div className="flex-1">
          <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm p-6 md:p-8 min-h-[500px]">
            
            {/* -------------------- TAB 1: TÀI KHOẢN -------------------- */}
            {activeTab === 'account' && (
              <div className="animate-fade-in text-gray-900 dark:text-white">
                <h2 className="text-xl font-black uppercase mb-6 tracking-wider">Tổng quan</h2>
                
                {/* Overview grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
                  <div>
                    <span className="text-xs text-gray-500 font-bold mb-1 block">Tên đăng nhập</span>
                    <span className="font-black text-[15px]">{username}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold mb-1 block">Email</span>
                    <span className="font-bold text-[15px]">{email || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold mb-1 block">Nhóm khách hàng</span>
                    <span className="font-bold text-[15px] text-primary">Member</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold mb-1 block">Số dư</span>
                    <span className="font-bold text-[15px]">0đ</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold mb-1 block">Điểm tích lũy</span>
                    <span className="font-bold text-[15px]">0 điểm</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold mb-1 block">Ngày tham gia</span>
                    <span className="font-bold text-[15px]">{joinDate || 'Hôm nay'}</span>
                  </div>
                </div>

                <h2 className="text-xl font-black uppercase mb-6 tracking-wider">Cá nhân</h2>
                <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-2xl">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Số điện thoại</label>
                    <input 
                      type="tel" 
                      placeholder="Nhập số điện thoại..." 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1a1c28] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold transition-all" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Email</label>
                    <input 
                      type="email" 
                      placeholder="Nhập địa chỉ email..." 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1a1c28] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold transition-all" 
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Địa chỉ nhận hàng mặc định</label>
                    <textarea 
                      placeholder="Nhập địa chỉ nhận hàng chi tiết..." 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      rows="3"
                      className="w-full bg-gray-50 dark:bg-[#1a1c28] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm font-bold transition-all resize-none" 
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="bg-primary text-black px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-yellow-400 active:scale-95 transition-all w-max mt-2"
                  >
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            )}

            {/* -------------------- TAB 2: LỊCH SỬ ĐƠN HÀNG -------------------- */}
            {activeTab === 'orders' && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-6 tracking-wider">Lịch sử đơn hàng</h2>
                
                {myOrders.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4 opacity-50 block">📦</div>
                    <p className="text-gray-500 font-bold">Bạn chưa có đơn hàng nào.</p>
                    <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold hover:underline">Tiếp tục mua sắm</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {myOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-white/10 rounded-2xl p-5 hover:border-primary/50 transition-colors bg-gray-50/50 dark:bg-transparent">
                        <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                          <div>
                            <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Mã đơn hàng</span>
                            <span className="text-primary font-black">#{order.id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Ngày đặt</span>
                            <span className="text-gray-900 dark:text-white font-bold">{order.date}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-black uppercase block mb-1">Trạng thái</span>
                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${order.status.includes('Đã gửi') ? 'text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-500/20 dark:bg-green-500/5' : 'text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-500 dark:border-yellow-500/20 dark:bg-yellow-500/5'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a1c28] rounded-xl p-3 flex flex-col gap-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-300 font-medium truncate pr-4">{item.name}</span>
                              <span className="text-gray-900 dark:text-white font-black whitespace-nowrap">{item.price.toLocaleString()}₫</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 text-right pt-4 border-t border-gray-200 dark:border-white/5">
                          <span className="text-xs text-gray-500 font-bold mr-2">Tổng tiền:</span>
                          <span className="text-lg font-black text-primary">{order.total.toLocaleString()}₫</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB 3: LỊCH SỬ GIAO DỊCH -------------------- */}
            {activeTab === 'transactions' && (
              <div className="animate-fade-in text-gray-900 dark:text-white">
                <h2 className="text-xl font-black uppercase mb-6 tracking-wider">Lịch sử giao dịch</h2>
                
                <div className="text-center py-20">
                  <div className="text-6xl mb-4 opacity-50 block">💳</div>
                  <p className="text-gray-500 font-bold">Bạn chưa có giao dịch nào.</p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
