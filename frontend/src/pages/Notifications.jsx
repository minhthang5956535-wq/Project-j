import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Notifications = () => {
    return (
        <div className="pb-32 bg-[var(--bg-light)] min-h-screen">
            <div className="container py-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-black mb-4 font-['Outfit'] tracking-tighter">Thông báo</h1>
                    <p className="text-[var(--gray-light)] font-medium text-lg">Cập nhật những tin tức mới nhất về chuyến đi và ưu đãi dành riêng cho bạn.</p>
                </header>

                <div className="text-center py-32 glass rounded-[40px] border-dashed border-2 max-w-4xl mx-auto bg-white/50">
                    <div className="text-8xl mb-8">🔔</div>
                    <h2 className="text-3xl font-black mb-4 font-['Outfit']">Chưa có thông báo</h2>
                    <p className="text-[var(--gray-light)] font-medium mb-10 max-w-md mx-auto">Chúng tôi sẽ gửi thông báo cho bạn khi có cập nhật về phòng đã đặt hoặc các chương trình khuyến mãi mới.</p>
                    <Link to="/" className="btn-premium px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest inline-flex items-center gap-2 group">
                        Về trang chủ <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
