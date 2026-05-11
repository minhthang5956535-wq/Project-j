import { useState, useEffect } from 'react';
import { getUserRank } from '../../utils/userStats';

export default function UserManage() {
  const [users, setUsers] = useState([]);

  // Lấy danh sách người dùng từ LocalStorage ra
  useEffect(() => {
    let savedUsers = [];
    try {
      const parsed = JSON.parse(localStorage.getItem('mood_fpv_users'));
      savedUsers = Array.isArray(parsed) ? parsed : [];
    } catch {
      savedUsers = [];
    }
    setUsers(savedUsers);
  }, []);

  const handleToggleBan = (email) => {
    const updatedUsers = users.map(user => 
      user.email === email ? { ...user, isBanned: !user.isBanned } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('mood_fpv_users', JSON.stringify(updatedUsers));
  };

  return (
    <div className="w-full relative animate-fade-up">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-primary font-tech tracking-wider text-xs mb-2">QUẢN LÝ DỮ LIỆU</h3>
          <h2 className="text-4xl font-black font-display uppercase text-white tracking-widest text-shadow-sm flex items-center gap-3">
            <span className="w-2 h-10 bg-primary rounded-full inline-block"></span>
            Tài Khoản Hành Khách
          </h2>
        </div>
      </div>

      <div className="bg-dark-card/40 border border-dark-border/60 rounded-2xl overflow-hidden glass shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="overflow-x-auto relative z-10 w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/40 text-gray-400 font-tech text-[10px] uppercase tracking-[0.2em] border-b border-dark-border">
                <th className="p-6 font-bold">Tên Pilot</th>
                <th className="p-6 font-bold">Email</th>
                <th className="p-6 font-bold">Số điện thoại</th>
                <th className="p-6 font-bold">Trạng thái</th>
                <th className="p-6 font-bold">Hạng & Tổng Chi (VNĐ)</th>
                <th className="p-6 font-bold text-right">Phán Quyết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-gray-500 font-tech tracking-widest uppercase text-sm">Chưa có Pilot nào đăng ký ghi danh!</td>
                </tr>
              ) : (
                users.map((u, i) => {
                  const stats = getUserRank(u.name);
                  return (
                    <tr key={i} className={`hover:bg-primary/5 transition-colors group ${u.isBanned ? 'opacity-50' : ''}`}>
                      <td className="p-6 text-sm font-bold text-white group-hover:text-primary transition-colors">{u.name}</td>
                      <td className="p-6 text-xs text-gray-400">{u.email}</td>
                      <td className="p-6 text-xs font-bold text-gray-300">{u.phone || 'Chưa cung cấp'}</td>
                      <td className="p-6">
                        <span className={`text-[10px] font-tech font-bold uppercase tracking-wider px-3 py-1.5 rounded border ${u.isBanned ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-green-500 bg-green-500/10 border-green-500/20'}`}>
                          {u.isBanned ? '🔴 Đã Khóa' : '🟢 Hoạt động'}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-[#f59e0b] px-2 py-1 bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded w-fit inline-block mb-1">
                            {stats.rank}
                          </span>
                          <span className="text-xs font-bold text-gray-400 tracking-wider">
                            Đã cống hiến: <span className="text-white">{stats.totalSpent.toLocaleString()}₫</span> <span className="text-[10px]">({stats.orderCount} đơn)</span>
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => handleToggleBan(u.email)}
                          className={`text-[11px] font-tech font-bold uppercase tracking-widest px-4 py-2 rounded-lg border transition-all shadow-sm ${u.isBanned ? 'text-green-500 hover:text-white hover:bg-green-600 border-green-500/30 hover:border-green-600' : 'text-red-500 hover:text-white hover:bg-red-600 border-red-500/30 hover:border-red-600'}`}
                        >
                          {u.isBanned ? 'Mở Khóa Tù' : 'Ban Acc'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
