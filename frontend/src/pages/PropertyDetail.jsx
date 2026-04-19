import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Share, Heart, ChevronLeft, ChevronRight, Calendar, ShieldCheck, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AvailabilityCalendar from '../components/Property/AvailabilityCalendar';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking states
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propRes, availRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get(`/properties/${id}/availability`)
        ]);

        if (!propRes.ok) throw new Error('Property not found');
        
        const propData = await propRes.json();
        const availData = await availRes.json();
        
        setProperty(propData);
        setAvailability(availData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return nights * property.price_per_night;
  };

  const handleBooking = async () => {
    if (!user) {
        setBookingMessage({ type: 'error', text: 'Bạn cần đăng nhập để đặt phòng!' });
        return;
    }

    if (!checkIn || !checkOut) {
        setBookingMessage({ type: 'error', text: 'Vui lòng chọn ngày nhận và trả phòng.' });
        return;
    }

    setBookingLoading(true);
    
    const totalPrice = calculateTotal();
    const bookingData = {
        checkIn,
        checkOut,
        guests,
        totalPrice
    };

    // Redirect to Checkout page with data
    setTimeout(() => {
        setBookingLoading(false);
        navigate('/checkout', { state: { bookingData, property } });
    }, 800);
  };

  if (loading) return (
    <div className="container py-32 flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-[var(--primary)]" size={48} />
        <p className="font-bold text-[var(--gray-light)] animate-pulse">Căn hộ đang được chuẩn bị cho bạn...</p>
    </div>
  );
  
  if (error) return (
    <div className="container py-32 text-center flex flex-col items-center gap-6">
        <div className="text-6xl">🤕</div>
        <h2 className="text-3xl font-bold">Rất tiếc, đã có lỗi xảy ra</h2>
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full border border-gray-200 font-bold hover:bg-gray-50 transition-all">Quay lại trang chủ</button>
    </div>
  );

  const totalNights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="pb-32 fade-in bg-[var(--bg-light)]">
      {/* Auth Notification Banner */}
      {!user && (
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-[var(--primary)] text-white py-4 sticky top-[80px] z-40 shadow-lg overflow-hidden"
        >
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm font-bold tracking-tight">
              <Sparkles size={20} />
              Đăng nhập ngay để nhận ưu đãi thành viên lên đến <span className="underline">20%</span>!
            </div>
            <Link to="/login" className="bg-white text-[var(--primary)] px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-md">
              Tham gia ngay
            </Link>
          </div>
        </motion.div>
      )}

      <div className="container py-8">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:bg-white px-4 py-2 rounded-full transition-all text-sm font-bold shadow-sm border border-transparent hover:border-gray-200">
            <ChevronLeft size={18} /> Quay lại
          </button>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 py-2 px-4 rounded-full hover:bg-white text-sm font-bold transition-all underline underline-offset-4"><Share size={16} /> Chia sẻ</button>
            <button className="flex items-center gap-2 py-2 px-4 rounded-full hover:bg-white text-sm font-bold transition-all underline underline-offset-4"><Heart size={16} /> Lưu lại</button>
          </div>
        </div>

        <div className="mb-6">
            <h1 className="text-5xl font-black mb-4 font-['Outfit'] tracking-tight">{property.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                <div className="flex items-center gap-1.5">
                    <Star size={18} className="fill-[var(--primary)] text-[var(--primary)]" /> 
                    <span className="text-zinc-900 font-black">4.98</span>
                    <span className="text-[var(--gray-light)] underline cursor-pointer font-medium ml-1">1,248 đánh giá</span>
                </div>
                <div className="flex items-center gap-1.5 group cursor-pointer">
                    <MapPin size={18} className="text-gray-400 group-hover:text-[var(--primary)] transition-colors" /> 
                    <span className="underline group-hover:text-gray-900 transition-colors uppercase tracking-tight italic">{property.address}</span>
                </div>
            </div>
        </div>

        {/* Hero Gallery - Premium Layout */}
        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[550px] rounded-[32px] overflow-hidden mb-12 shadow-2xl">
          <div className="col-span-2 row-span-2 relative group cursor-pointer">
            <img src={property.images?.[0]?.image_url || property.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main View" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
          <div className="relative group cursor-pointer overflow-hidden">
             <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Room 1" />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="relative group cursor-pointer overflow-hidden">
             <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Details" />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="relative group cursor-pointer overflow-hidden">
             <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Living Area" />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="relative group cursor-pointer overflow-hidden">
             <img src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Kitchen" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                 <button className="bg-white text-gray-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-transform">
                     Xem thêm ảnh
                 </button>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content Info */}
          <div className="lg:col-span-2">
            <section className="border-b border-gray-200 pb-10 mb-10 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black mb-2 font-['Outfit']">Toàn bộ căn hộ · Chủ nhà: {property.host_name || 'Admin'}</h2>
                <div className="text-[var(--gray-light)] font-medium flex gap-2">
                  <span>4 khách</span> · <span>2 phòng ngủ</span> · <span>3 giường</span> · <span>2 phòng tắm</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--primary)] shadow-lg ring-4 ring-white">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${property.host_name || 'A'}`} alt="Host" />
              </div>
            </section>

            <section className="border-b border-gray-200 pb-10 mb-10 space-y-8">
              <div className="flex gap-6">
                <div className="pt-1"><CheckCircle2 className="text-[var(--secondary)]" /></div>
                <div>
                  <h4 className="font-bold text-lg">Hủy phòng linh hoạt</h4>
                  <p className="text-[var(--gray-light)]">Được hoàn tiền 100% nếu hủy trước 24 giờ kể từ ngày nhận phòng.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="pt-1"><ShieldCheck className="text-[var(--primary)]" /></div>
                <div>
                  <h4 className="font-bold text-lg">Chỗ ở uy tín</h4>
                  <p className="text-[var(--gray-light)]">Thông tin về căn hộ này đã được đội ngũ onghai xác thực 100%.</p>
                </div>
              </div>
            </section>

            <section className="border-b border-gray-200 pb-10 mb-10">
              <h3 className="text-2xl font-black mb-6 font-['Outfit']">Mô tả về không gian</h3>
              <div className="text-gray-700 leading-relaxed text-lg space-y-4">
                 {property.description.split('\n').map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </section>

            <section className="border-b border-gray-200 pb-10 mb-10">
              <h3 className="text-2xl font-black mb-8 font-['Outfit']">Tiện ích đi kèm</h3>
              <div className="grid grid-cols-2 gap-6">
                 {['Wi-Fi 1GBps', 'Bếp hiện đại', 'Phòng xông hơi', 'Netflix 4K', 'Chỗ đậu xe', 'Ban công view biển'].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 text-gray-800 font-semibold group">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-light)] flex items-center justify-center group-hover:bg-[var(--primary-soft)] transition-colors">
                        <CheckCircle2 size={18} className="text-zinc-400 group-hover:text-[var(--primary)] transition-colors" />
                      </div>
                      {item}
                   </div>
                 ))}
              </div>
            </section>

            {/* Availability Calendar */}
            <section className="pb-10">
              <h3 className="text-2xl font-black mb-8 font-['Outfit']">Lịch trống của căn hộ</h3>
              <div className="bg-white p-8 rounded-[32px] shadow-inner border border-gray-100 overflow-hidden">
                <AvailabilityCalendar availability={availability} />
                <p className="mt-6 text-sm text-[var(--gray-light)] italic text-right">Cập nhật lúc: 5 phút trước</p>
              </div>
            </section>
          </div>

          {/* Sticky Booking Card */}
          <div className="relative">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="sticky top-[150px] p-8 glass rounded-[40px] shadow-2xl border-white"
            >
              <div className="flex justify-between items-baseline mb-8">
                <div>
                  <span className="text-3xl font-black">{Number(property.price_per_night).toLocaleString('vi-VN')} ₫</span>
                  <span className="text-[var(--gray-light)] font-bold"> / đêm</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Star size={18} className="fill-black" /> 4.98
                </div>
              </div>

              <AnimatePresence>
              {bookingMessage && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-2xl text-xs font-bold mb-6 flex items-center gap-3 ${bookingMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}
                >
                  <AlertCircle size={18} /> {bookingMessage.text}
                </motion.div>
              )}
              </AnimatePresence>

              <div className="border border-gray-200 rounded-[24px] mb-8 overflow-hidden bg-white/50">
                <div className="grid grid-cols-2 border-b border-gray-200">
                  <div className="p-4 border-r border-gray-200 hover:bg-white transition-colors cursor-pointer group">
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1 group-hover:text-[var(--primary)]">Nhận căn hộ</label>
                    <input 
                      type="date" 
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="text-sm font-bold w-full outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="p-4 hover:bg-white transition-colors cursor-pointer group">
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-1 group-hover:text-[var(--primary)]">Trả căn hộ</label>
                    <input 
                      type="date" 
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="text-sm font-bold w-full outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
                <div className="p-4 hover:bg-white transition-colors cursor-pointer group">
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1 group-hover:text-[var(--primary)]">Khách lưu trú</label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="text-sm font-bold w-full outline-none bg-transparent cursor-pointer"
                  >
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n} người lớn</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full btn-premium py-5 rounded-[20px] mb-6 flex items-center justify-center gap-3 disabled:opacity-70 group"
              >
                {bookingLoading ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                        Đặt căn hộ ngay <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>
              
              <p className="text-center text-sm text-[var(--gray-light)] font-medium mb-8">Bạn sẽ chưa bị trừ tiền ngay lúc này</p>

              <div className="space-y-4">
                {totalNights > 0 && (
                    <div className="flex justify-between text-base font-medium text-gray-600">
                        <span className="underline">{Number(property.price_per_night).toLocaleString('vi-VN')} ₫ x {totalNights} đêm</span>
                        <span className="font-bold">{(property.price_per_night * totalNights).toLocaleString('vi-VN')} ₫</span>
                    </div>
                )}
                <div className="flex justify-between text-base font-medium text-gray-600">
                    <span className="underline">Phí dịch vụ onghai</span>
                    <span className="font-bold">0 ₫</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-white/40">
                  <span className="text-xl font-black">Tổng cộng</span>
                  <span className="text-2xl font-black">{(calculateTotal()).toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>
            </motion.div>

            <div className="mt-8 p-6 rounded-[28px] border border-gray-200 bg-white flex items-center gap-6">
                 <div className="text-3xl text-orange-400">💎</div>
                 <div>
                     <h5 className="font-bold">Ưu đãi độc quyền</h5>
                     <p className="text-xs text-[var(--gray-light)] font-medium">Bạn đã tiết kiệm được 245,000 ₫ cho lượt thuê này.</p>
                 </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
