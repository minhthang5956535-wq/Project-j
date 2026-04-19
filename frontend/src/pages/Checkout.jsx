import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { ChevronLeft, Info, CheckCircle2, ShieldCheck, CreditCard, Wallet, QrCode, Loader2, Calendar, MapPin, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingData, property } = location.state || {};

    const [paymentMode, setPaymentMode] = useState('full'); // 'full' (100%) or 'deposit' (70%)
    const [submitting, setSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!bookingData || !property) {
        return (
            <div className="container py-32 text-center">
                <p className="text-xl font-bold mb-4">Dữ liệu đặt phòng không hợp lệ.</p>
                <Link to="/" className="text-[var(--primary)] font-bold">Về trang chủ</Link>
            </div>
        );
    }

    const totalPrice = bookingData.totalPrice;
    const depositAmount = Math.round(totalPrice * 0.7);
    const finalAmount = paymentMode === 'full' ? totalPrice : depositAmount;

    // VietQR info
    const bankId = 'OCB';
    const accountNo = '0911798840';
    const accountName = 'HUYNH MINH THANG';
    const description = `Ông Hai Home PAY ${property.title.substring(0, 10)} ${bookingData.checkIn}`.replace(/\s+/g, '%20');
    
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${finalAmount}&addInfo=${description}&accountName=${encodeURIComponent(accountName)}`;

    const handleConfirmPayment = async () => {
        setSubmitting(true);
        try {
            const response = await api.post('/bookings', {
                property_id: property.id,
                check_in_date: bookingData.checkIn,
                check_out_date: bookingData.checkOut,
                number_of_guests: bookingData.guests,
                total_price: totalPrice,
                payment_received: finalAmount,
                payment_status: paymentMode === 'full' ? 'paid' : 'deposited'
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/bookings');
                }, 3000);
            } else {
                alert('Có lỗi xảy ra khi lưu đơn đặt phòng. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối server.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--bg-light)] min-h-screen pb-32">
            <div className="container py-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold mb-8 hover:text-[var(--primary)] transition-colors group">
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Quay lại
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Booking & Payment Selection */}
                    <div className="space-y-8">
                        <header>
                            <h1 className="text-5xl font-black mb-4 font-['Outfit'] tracking-tighter">Xác nhận thanh toán</h1>
                            <p className="text-[var(--gray-light)] font-medium text-lg">Hoàn tất thanh toán để giữ chỗ căn hộ của bạn.</p>
                        </header>

                        {/* Booking Summary Card */}
                        <div className="glass p-8 rounded-[32px] border-white shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Info size={20} className="text-[var(--primary)]" /> Tóm tắt đơn đặt
                            </h2>
                            <div className="flex gap-6 mb-8">
                                <img src={property.images?.[0]?.image_url || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"} className="w-24 h-24 rounded-2xl object-cover shadow-sm" alt="" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{property.title}</h3>
                                    <p className="text-xs text-[var(--gray-light)] font-medium flex items-center gap-1 mb-2">
                                        <MapPin size={12} /> {property.address}
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Calendar size={12} /> {bookingData.checkIn} - {bookingData.checkOut}</span>
                                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Users size={12} /> {bookingData.guests} khách</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                                <span className="font-medium text-gray-500">Tổng cộng</span>
                                <span className="text-2xl font-black">{totalPrice.toLocaleString()} ₫</span>
                            </div>
                        </div>

                        {/* Payment Mode Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-black uppercase tracking-widest text-gray-400 pl-2">Chọn hình thức thanh toán</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setPaymentMode('full')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col gap-2 text-left ${paymentMode === 'full' ? 'border-[var(--primary)] bg-white shadow-xl scale-[1.02]' : 'border-white bg-white/50 opacity-60 hover:opacity-100'}`}
                                >
                                    <h4 className="font-black text-sm uppercase tracking-tight">Thanh toán hết</h4>
                                    <p className="text-2xl font-black">{totalPrice.toLocaleString()} ₫</p>
                                    <p className="text-[10px] font-bold text-gray-400 italic">Thanh toán nhanh gọn, giữ phòng 100%</p>
                                    {paymentMode === 'full' && <CheckCircle2 className="absolute top-4 right-4 text-[var(--primary)]" size={24} />}
                                </button>

                                <button 
                                    onClick={() => setPaymentMode('deposit')}
                                    className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col gap-2 text-left ${paymentMode === 'deposit' ? 'border-[var(--primary)] bg-white shadow-xl scale-[1.02]' : 'border-white bg-white/50 opacity-60 hover:opacity-100'}`}
                                >
                                    <h4 className="font-black text-sm uppercase tracking-tight">Cọc 70% giữ phòng</h4>
                                    <p className="text-2xl font-black">{depositAmount.toLocaleString()} ₫</p>
                                    <p className="text-[10px] font-bold text-gray-400 italic">Thanh toán phần còn lại khi nhận phòng</p>
                                    {paymentMode === 'deposit' && <CheckCircle2 className="absolute top-4 right-4 text-[var(--primary)]" size={24} />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-4 items-start">
                             <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                                <ShieldCheck size={20} />
                             </div>
                             <div>
                                <p className="font-bold text-amber-900 text-sm">Thanh toán an toàn qua VietQR</p>
                                <p className="text-amber-800 text-xs mt-1 leading-relaxed">Chúng tôi sử dụng hệ thống chuyển khoản QR để đảm bảo tính minh bạch và an toàn tuyệt đối cho giao dịch của bạn.</p>
                             </div>
                        </div>
                    </div>

                    {/* Right: VietQR Code */}
                    <div className="lg:sticky lg:top-32">
                        <motion.div 
                            key={paymentMode}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-10 rounded-[40px] shadow-2xl border-white flex flex-col items-center bg-white"
                        >
                            <div className="text-center mb-8">
                                <span className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 inline-block">Mã chuyển khoản nội bộ</span>
                                <h3 className="text-2xl font-black">Quét để thanh toán</h3>
                                <p className="text-sm text-[var(--gray-light)] font-medium mt-1">Vui lòng sử dụng app ngân hàng để quét mã QR</p>
                            </div>

                            <div className="relative group mb-8">
                                <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--primary)] to-pink-500 rounded-[32px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                                    <img src={qrUrl} alt="VietQR" className="w-64 h-64 object-contain" />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-xl shadow-md border border-gray-50">
                                   <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center font-black text-[10px] text-white">OH</div>
                                </div>
                            </div>

                            <div className="w-full space-y-4 mb-10">
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Chủ tài khoản</span>
                                    <span className="font-black text-sm">{accountName}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Số tiền cần chuyển</span>
                                    <span className="font-black text-xl text-[var(--primary)]">{finalAmount.toLocaleString()} ₫</span>
                                </div>
                            </div>

                            <button 
                                onClick={handleConfirmPayment}
                                disabled={submitting}
                                className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-[var(--primary-soft)] transition-all flex items-center justify-center gap-3 ${submitting ? 'bg-gray-200 text-gray-400' : 'btn-premium'}`}
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <QrCode size={20} />}
                                {submitting ? 'Đang xử lý...' : 'Tôi đã chuyển khoản'}
                            </button>

                            <p className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={14} /> Bảo mật bởi hệ thống Ông Hai Home
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Success Animation Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200 }}
                            className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mb-10"
                        >
                            <CheckCircle2 size={64} />
                        </motion.div>
                        <h2 className="text-5xl font-black mb-4 font-['Outfit'] tracking-tighter">Đặt phòng thành công!</h2>
                        <p className="text-xl text-[var(--gray-light)] font-medium max-w-md">Ông Hai Home đã nhận được xác nhận thanh toán của bạn. Đang chuyển hướng về trang lịch sử...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Checkout;
