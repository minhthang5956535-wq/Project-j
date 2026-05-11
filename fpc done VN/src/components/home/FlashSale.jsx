import { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';

export default function FlashSale({ products, onAddToCart }) {
  // Trạng thái đếm ngược (đặt mặc định 2 tiếng 45 phút 12 giây)
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 12);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Flash sale giảm thật 10%
  const flashSaleItems = products.filter(p => p.price > 1000000).slice(0, 5).map(p => ({
    ...p,
    oldPrice: p.price,
    price: p.price * 0.9,
    isNew: true
  }));

  if (flashSaleItems.length === 0) return null;

  // Tính toán chuỗi giờ phút giây
  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="py-12 animate-fade-up">
      <div className="bg-gradient-to-r from-red-900/40 via-black to-red-900/40 border border-red-500/30 rounded-2xl p-6 md:p-10 shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full height-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 relative z-10 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl animate-pulse">⚡</span>
            <div>
              <h3 className="text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-primary uppercase italic tracking-wider filter drop-shadow-md">
                Flash Sale FPV
              </h3>
              <p className="text-gray-400 text-sm font-tech">Chốt đơn ngay kẻo hết!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-black/60 px-4 py-3 rounded-lg border border-red-500/50 backdrop-blur-sm">
            <span className="text-gray-300 text-sm font-bold mr-2">KẾT THÚC TRONG</span>
            <div className="flex gap-2 font-tech font-bold text-lg">
              <span className="bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                {h}
              </span>
              <span className="text-red-500 font-black animate-pulse flex items-center justify-center">:</span>
              <span className="bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                {m}
              </span>
              <span className="text-red-500 font-black animate-pulse flex items-center justify-center">:</span>
              <span className="bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                {s}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
          {flashSaleItems.map((p) => (
            <div key={p.id} className="relative group">
              {/* Fake SALE Tag */}
              <div className="absolute -top-3 -right-3 bg-red-600 text-white w-12 h-12 rounded-full flex flex-col items-center justify-center z-20 font-bold border-2 border-black rotate-12 shadow-lg group-hover:scale-110 transition-transform">
                <span className="text-[10px] leading-tight">GIẢM</span>
                <span className="text-sm leading-none">-10%</span>
              </div>
              <ProductCard p={p} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
