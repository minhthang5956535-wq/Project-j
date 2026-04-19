import React from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    return (
        <div className="pb-32 bg-[var(--bg-light)] min-h-screen">
            <div className="container py-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-black mb-4 font-['Outfit'] tracking-tighter">Danh sách yêu thích</h1>
                    <p className="text-[var(--gray-light)] font-medium text-lg">Lưu lại những căn hộ bạn yêu thích để dễ dàng đặt phòng sau này.</p>
                </header>

                <div className="text-center py-32 glass rounded-[40px] border-dashed border-2 max-w-4xl mx-auto bg-white/50">
                    <div className="text-8xl mb-8">💖</div>
                    <h2 className="text-3xl font-black mb-4 font-['Outfit']">Danh sách trống</h2>
                    <p className="text-[var(--gray-light)] font-medium mb-10 max-w-md mx-auto">Hãy bấm vào biểu tượng trái tim ở các căn hộ để thêm vào danh sách yêu thích của bạn.</p>
                    <Link to="/" className="btn-premium px-12 py-4 rounded-full font-black text-sm uppercase tracking-widest inline-flex items-center gap-2 group">
                        Khám phá ngay <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
