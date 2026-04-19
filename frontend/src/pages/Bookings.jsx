import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, MapPin, Loader2, ChevronRight, AlertCircle, Home, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/bookings/my');
            if (!response.ok) throw new Error('Không thể tải lịch sử giao dịch. Vui lòng thử lại sau.');
            const data = await response.json();
            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelBooking = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy chuyến đi này?')) return;
        try {
            const res = await api.patch(`/bookings/${id}/cancel`);
            if (res.ok) {
                setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
            } else {
                const data = await res.json();
                alert(data.message || 'Lỗi khi hủy đơn hàng.');
            }
        } catch (err) {
            alert('Lỗi hệ thống khi hủy đơn hàng.');
        }
    };

    if (loading) return (
        <div className="container py-32 flex flex-col items-center justify-center gap-6">
            <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
            <p className="font-bold text-[var(--gray-light)] animate-pulse">Đang tải lịch sử giao dịch...</p>
        </div>
    );

    return (
        <div className="pb-32 bg-[var(--bg-light)] min-h-screen">
            <div className="container py-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-black mb-4 font-['Outfit'] tracking-tighter">Lịch sử giao dịch</h1>
                    <p className="text-[var(--gray-light)] font-medium text-lg">Quản lý và xem lại tất cả các chuyến đi của bạn trên Ông Hai Home.</p>
                </header>

                {error ? (
                    <div className="glass p-12 text-center rounded-[32px] text-red-600 shadow-lg border-red-100 max-w-2xl mx-auto">
                        <AlertCircle className="mx-auto mb-4" size={48} />
                        <p className="text-xl font-bold mb-2">{error}</p>
                        <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-full font-bold shadow-lg shadow-red-100 active:scale-95 transition-transform">Thử lại ngay</button>
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookings.map((booking, index) => (
                            <motion.div 
                                key={booking.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border-white relative"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={booking.property_image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                        alt={booking.property_title} 
                                    />
                                    <div className="absolute top-4 right-4">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                                            booking.status === 'confirmed' ? 'bg-emerald-500 text-white' : 
                                            booking.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                                        }`}>
                                            {booking.status === 'confirmed' ? 'Đã duyệt' : booking.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                            <Home size={16} />
                                        </div>
                                        <h3 className="font-bold text-lg line-clamp-1">{booking.property_title}</h3>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-sm text-[var(--gray-light)] font-medium">
                                            <Calendar size={18} className="text-[var(--primary)]" />
                                            <span>{booking.check_in_date} — {booking.check_out_date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[var(--gray-light)] font-medium">
                                            <MapPin size={18} className="text-[var(--primary)]" />
                                            <span className="line-clamp-1">{booking.property_address}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {booking.status === 'confirmed' ? <CheckCircle2 className="text-emerald-500" size={16} /> : booking.status === 'cancelled' ? <XCircle className="text-red-500" size={16} /> : <Clock className="text-amber-500" size={16} />}
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">Mã đơn: #{booking.id}</span>
                                            </div>
                                            <Link to={`/properties/${booking.property_id}`} className="text-xs font-black text-[var(--primary)] hover:underline flex items-center gap-1 group/link">
                                                Chi tiết <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <button 
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="w-full py-2.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={14} /> Hủy chuyến đi
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary-soft)] rounded-[32px] transition-colors pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 glass rounded-[40px] border-dashed border-2 max-w-4xl mx-auto bg-white/50">
                        <div className="text-8xl mb-8">🚢</div>
                        <h2 className="text-3xl font-black mb-4 font-['Outfit']">Bạn chưa có chuyến đi nào</h2>
                        <p className="text-[var(--gray-light)] font-medium mb-10 max-w-md mx-auto">Bắt đầu hành trình khám phá những căn hộ tuyệt vời trên Ông Hai Home ngay hôm nay.</p>
                        <Link to="/" className="btn-premium px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest inline-flex items-center gap-2 group">
                            Tìm phòng ngay <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
