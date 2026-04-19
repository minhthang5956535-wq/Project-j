import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { 
  Users, 
  Home, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  LayoutDashboard, 
  Settings, 
  Bell, 
  LogOut, 
  Loader2,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  Shield,
  Calendar as CalendarIcon,
  Tag,
  MapPin,
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [properties, setProperties] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Property State
    const [newProp, setNewProp] = useState({
        title: '',
        description: '',
        price_per_night: '',
        address: '',
        category: 'Căn hộ',
        image_url: ''
    });

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsRes, propsRes, bookingsRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/properties'),
                    api.get('/admin/bookings'),
                    api.get('/admin/users')
                ]);
                
                if (!statsRes.ok || !propsRes.ok || !bookingsRes.ok || !usersRes.ok) {
                    throw new Error('Không thể kết nối máy chủ quản trị. Vui lòng kiểm tra lại.');
                }
                
                const statsData = await statsRes.json();
                const propsData = await propsRes.json();
                const bookingsData = await bookingsRes.json();
                const usersData = await usersRes.json();
                
                setStats(statsData.stats);
                setChartData(Array.isArray(statsData.chartData) ? statsData.chartData : []);
                setProperties(Array.isArray(propsData) ? propsData : []);
                setBookings(Array.isArray(bookingsData) ? bookingsData : []);
                setUsers(Array.isArray(usersData) ? usersData : []);
            } catch (err) {
                console.error('Failed to fetch admin data', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleDeleteProperty = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;
        try {
            await api.delete(`/admin/properties/${id}`);
            setProperties(properties.filter(p => p.id !== id));
        } catch (err) {
            alert('Lỗi hệ thống khi xóa phòng.');
        }
    };

    const handleUpdateBookingStatus = async (id, status) => {
        try {
            await api.patch(`/admin/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
        } catch (err) {
            alert('Lỗi khi cập nhật trạng thái đặt phòng.');
        }
    };

    const handleAddProperty = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/admin/properties', newProp);
            if (res.ok) {
                const data = await res.json();
                setProperties([...properties, { ...newProp, id: data.id, status: 'active', image: newProp.image_url }]);
                setShowAddModal(false);
                setNewProp({ title: '', description: '', price_per_night: '', address: '', category: 'Căn hộ', image_url: '' });
                alert('Thêm phòng mới thành công!');
            }
        } catch (err) {
            alert('Lỗi khi thêm phòng.');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[var(--primary)]" size={48} strokeWidth={3} />
            <p className="font-black text-[var(--primary)] tracking-widest uppercase text-xs">OngHai System Loading...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6 p-10 text-center">
            <AlertCircle className="text-red-500" size={60} />
            <div>
                <h2 className="text-2xl font-black mb-2">HỆ THỐNG ĐANG BẢO TRÌ</h2>
                <p className="text-slate-500 max-w-md font-medium">{error}</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[var(--primary)] text-white rounded-2xl font-bold shadow-xl shadow-red-100 transition-transform active:scale-95">Thử lại ngay</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Nav Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen z-20">
                <div className="p-8 border-b border-slate-50 mb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-red-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-red-200">
                            OH
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter">OngHai Admin</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management v2.0</p>
                        </div>
                    </div>
                    
                    <a href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[var(--primary)] transition-colors group">
                        <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" /> Về trang chủ OngHai
                    </a>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    {[
                        { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
                        { id: 'properties', icon: Home, label: 'Quản lý căn hộ' },
                        { id: 'bookings', icon: CalendarIcon, label: 'Lịch đặt căn hộ' },
                        { id: 'users', icon: Users, label: 'Người dùng' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm group ${activeTab === item.id ? 'bg-[var(--primary-soft)] text-[var(--primary)] shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                        >
                            <item.icon size={20} className={activeTab === item.id ? 'text-[var(--primary)]' : 'text-slate-400 group-hover:text-slate-600'} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-50">
                    <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all text-sm">
                        <LogOut size={20} /> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main className="flex-1 p-10 overflow-auto">
                {/* Global Header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-black mb-1 font-['Outfit'] tracking-tight">
                            {activeTab === 'dashboard' && 'Chào mừng trở lại, Boss! 👋'}
                            {activeTab === 'properties' && 'Quản lý kho phòng 🏠'}
                            {activeTab === 'bookings' && 'Dòng chảy đơn hàng 📜'}
                            {activeTab === 'users' && 'Cộng đồng OngHai 👥'}
                            {activeTab === 'settings' && 'Cấu hình hệ thống ⚙️'}
                        </h2>
                        <p className="text-slate-400 font-medium">Hệ thống đang hoạt động tối ưu nhất.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-all relative">
                            <Bell size={20} className="text-slate-600" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right">
                                <p className="text-sm font-black italic">M. Minh Hải</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Super Admin</p>
                            </div>
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-10 h-10 rounded-xl bg-slate-200 p-0.5 border border-slate-200" alt="Avatar" />
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="dash" className="space-y-10">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Tổng doanh thu', value: `${(stats?.totalRevenue || 0).toLocaleString()} ₫`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                    { label: 'Tổng số phòng', value: stats?.totalProperties || 0, icon: Home, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { label: 'Lượt đặt phòng', value: stats?.totalBookings || 0, icon: CheckCircle2, color: 'text-amber-500', bg: 'bg-amber-50' },
                                    { label: 'Tăng trưởng', value: stats?.growth || '0%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                                        <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                                            <p className="text-2xl font-black">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Main Chart Area */}
                            <div className="grid grid-cols-3 gap-8">
                                <div className="col-span-2 bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-bold">Biểu đồ doanh thu thực tế</h3>
                                        <div className="flex gap-2">
                                            <span className="w-3 h-3 bg-[var(--primary)] rounded-full mr-2 self-center"></span>
                                            <span className="text-xs font-bold text-slate-400">Dòng tiền xác nhận</span>
                                        </div>
                                    </div>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}} dy={10} />
                                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="col-span-1 bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 animate-bounce">
                                        <Shield size={40} />
                                    </div>
                                    <h4 className="text-lg font-black mb-2 uppercase italic tracking-tighter">Bảo mật OngHai</h4>
                                    <p className="text-sm text-slate-400 font-medium mb-6 px-4">Đang giám sát 24/7 tất cả các giao diện và giao dịch viên.</p>
                                    <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-emerald-500" animate={{ width: '100%' }} transition={{ duration: 2 }} />
                                    </div>
                                    <p className="text-[10px] font-black text-emerald-500 uppercase mt-4">Hệ thống an toàn tuyệt đối</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'properties' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="props" className="bg-white rounded-[36px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <div className="relative w-full max-w-sm">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input type="text" placeholder="Tìm kiếm phòng..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-[var(--primary)] transition-all font-medium text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <button onClick={() => setShowAddModal(true)} className="btn-premium flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-red-100 active:scale-95 transition-transform">
                                    <Plus size={20} /> Thêm căn hộ mới
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">
                                            <th className="px-8 py-5 text-left">Tên phòng & Địa chỉ</th>
                                            <th className="px-8 py-5">Chủ nhà</th>
                                            <th className="px-8 py-5">Giá / Đêm</th>
                                            <th className="px-8 py-5">Trạng thái</th>
                                            <th className="px-8 py-5">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {Array.isArray(properties) && properties.filter(p => (p.title || '').toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                                                            <img src={p.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-900">{p.title}</p>
                                                            <p className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{p.address}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-center font-bold text-xs text-slate-500">{p.host_name}</td>
                                                <td className="px-8 py-5 text-center font-black text-sm">{Number(p.price_per_night).toLocaleString()} ₫</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Hoạt động</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex justify-center gap-2">
                                                        <button className="p-2 border border-slate-100 bg-white rounded-lg text-slate-400 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all active:scale-90"><Edit size={16} /></button>
                                                        <button onClick={() => handleDeleteProperty(p.id)} className="p-2 border border-slate-100 bg-white rounded-lg text-slate-400 hover:text-red-500 hover:border-red-500 transition-all active:scale-90"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'bookings' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="bookings" className="bg-white rounded-[36px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50">
                                <h3 className="text-xl font-bold">Lịch đặt phòng toàn hệ thống</h3>
                                <p className="text-sm text-slate-400 font-medium">Tất cả các giao dịch đặt phòng hiện tại.</p>
                            </div>
                            <div className="overflow-x-auto text-center">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">
                                            <th className="px-8 py-5 text-left">ID & Khách hàng</th>
                                            <th className="px-8 py-5">Căn hộ</th>
                                            <th className="px-8 py-5">Lịch trình (In/Out)</th>
                                            <th className="px-8 py-5">Trạng thái</th>
                                            <th className="px-8 py-5">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 text-center">
                                        {Array.isArray(bookings) && bookings.map((b) => (
                                            <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-5 text-left">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400">#{b.id}</div>
                                                        <div>
                                                            <p className="font-bold text-sm">{b.user_name}</p>
                                                            <p className="text-[10px] text-slate-400">{b.user_email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-sm text-slate-600 truncate max-w-[150px]">{b.property_title}</td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                                                        <span>{b.check_in_date}</span>
                                                        <ChevronRight size={14} className="text-slate-300" />
                                                        <span>{b.check_out_date}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 
                                                        b.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {b.status === 'confirmed' ? 'Đã duyệt' : b.status === 'cancelled' ? 'Đã hủy' : 'Chờ duyệt'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                     <div className="flex justify-center gap-2">
                                                        {b.status === 'confirmed' ? (
                                                            <button onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')} className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:underline active:scale-95 transition-transform px-3 py-1 bg-red-50 rounded-lg">Hủy bỏ</button>
                                                        ) : (
                                                            <button onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')} className="text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline active:scale-95 transition-transform px-3 py-1 bg-emerald-50 rounded-lg">Phê duyệt</button>
                                                        )}
                                                     </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="users" className="bg-white rounded-[36px] border border-slate-100 shadow-sm overflow-hidden">
                             <div className="p-8 border-b border-slate-50">
                                <h3 className="text-xl font-bold">Quản lý thành viên</h3>
                                <p className="text-sm text-slate-400 font-medium">Danh sách toàn bộ tài khoản đăng ký trên hệ thống.</p>
                            </div>
                            <div className="overflow-x-auto text-center">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50">
                                        <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">
                                            <th className="px-8 py-5 text-left">Thành viên</th>
                                            <th className="px-8 py-5">Email</th>
                                            <th className="px-8 py-5">Vai trò (Role)</th>
                                            <th className="px-8 py-5">Ngày tham gia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {Array.isArray(users) && users.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50/30 transition-colors text-center">
                                                <td className="px-8 py-5 text-left items-center flex gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-[var(--primary)] text-sm shadow-sm border border-slate-100">{u.name.charAt(0)}</div>
                                                    <span className="font-bold text-sm">{u.name}</span>
                                                </td>
                                                <td className="px-8 py-5 font-bold text-slate-500 text-xs">{u.email}</td>
                                                <td className="px-8 py-5 font-black uppercase text-[10px] tracking-tighter">
                                                    <span className={`px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-red-50 text-red-500 italic' : 'bg-slate-50 text-slate-500'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-slate-400 text-xs italic">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* Add Property Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl">
                             <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-[var(--primary)] text-white">
                                <div>
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase">Thêm phòng mới</h3>
                                    <p className="text-xs font-bold text-white/70">Tạo thêm cơ hội kinh doanh cho OngHai</p>
                                </div>
                                <button onClick={() => setShowAddModal(false)} className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-all active:scale-95"><X size={24} /></button>
                             </div>
                             <form onSubmit={handleAddProperty} className="p-10 space-y-6">
                                <div className="grid grid-cols-2 gap-6 font-bold">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-400 flex gap-2 items-center"><Tag size={12} /> Tên phòng</label>
                                        <input required type="text" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold text-sm" placeholder="VD: Luxury Landmark 81..." value={newProp.title} onChange={(e) => setNewProp({...newProp, title: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-400 flex gap-2 items-center"><DollarSign size={12} /> Giá / Đêm</label>
                                        <input required type="number" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold text-sm" placeholder="VD: 1500000" value={newProp.price_per_night} onChange={(e) => setNewProp({...newProp, price_per_night: e.target.value})} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex gap-2 items-center"><MapPin size={12} /> Địa chỉ chính xác</label>
                                    <input required type="text" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold text-sm" placeholder="Địa chỉ chi tiết..." value={newProp.address} onChange={(e) => setNewProp({...newProp, address: e.target.value})} />
                                </div>

                                <div className="grid grid-cols-2 gap-6 font-bold">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-400 flex gap-2 items-center"><LayoutDashboard size={12} /> Dinh mục</label>
                                        <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold text-sm" value={newProp.category} onChange={(e) => setNewProp({...newProp, category: e.target.value})}>
                                            <option>Căn hộ</option>
                                            <option>Biển</option>
                                            <option>Đồi núi</option>
                                            <option>Nông thôn</option>
                                            <option>Hồ bơi</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-slate-400 flex gap-2 items-center"><ImageIcon size={12} /> URL Hình ảnh</label>
                                        <input required type="text" className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold text-sm" placeholder="Link ảnh (Unsplash...)" value={newProp.image_url} onChange={(e) => setNewProp({...newProp, image_url: e.target.value})} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Mô tả chi tiết</label>
                                    <textarea className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all font-bold text-sm h-24" placeholder="Viết vài dòng giới thiệu..." value={newProp.description} onChange={(e) => setNewProp({...newProp, description: e.target.value})}></textarea>
                                </div>

                                <button type="submit" className="w-full py-5 bg-[var(--primary)] text-white rounded-[24px] font-black italic uppercase tracking-widest text-sm shadow-2xl shadow-red-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <Check size={20} /> Kích hoạt căn hộ ngay
                                </button>
                             </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
