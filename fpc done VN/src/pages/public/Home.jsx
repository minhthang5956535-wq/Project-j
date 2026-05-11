// src/pages/public/Home.jsx
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import HeroSlider from '../../components/home/HeroSlider';
import BrandMarquee from '../../components/home/BrandMarquee';
import CategoryGrid from '../../components/home/CategoryGrid';
import FlashSale from '../../components/home/FlashSale';
import ProductCard from '../../components/product/ProductCard';

export default function Home({ products, cart, setCart, searchTerm }) {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [productTab, setProductTab] = useState('MỚI VỀ');
  const [showAll, setShowAll] = useState(false);
  const location = useLocation();
  const prevSearchTerm = useRef('');

  // Reset showAll khi đổi danh mục
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  // Chỉ reset về "Tất cả" một lần khi bắt đầu gõ tìm kiếm (không scroll)
  useEffect(() => {
    const wasEmpty = prevSearchTerm.current.trim() === '';
    const isNowFilled = searchTerm.trim().length > 0;
    if (wasEmpty && isNowFilled) {
      setActiveCategory('Tất cả');
    }
    prevSearchTerm.current = searchTerm;
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory('Tất cả');
    }

    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    setCart([...cart, product]);
    toast.success(`Đã thêm ${product.name} vào giỏ!`, {
      style: { background: '#333', color: '#f5c242' },
      iconTheme: { primary: '#f5c242', secondary: '#333' }
    });
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tự động chuyển đổi các danh mục cũ kỹ sang chuẩn danh mục mới
    let normCat = p.category;
    if (normCat === 'FPV Drones') normCat = 'FPV DRONES';
    else if (normCat === 'Phụ kiện FPV') normCat = 'BỘ KHUNG FRAME KIT';
    else if (normCat === 'Đồ điện FPV') normCat = 'MẠCH ĐIỀU KHIỂN FC';
    else if (normCat === 'Pin Lipo') normCat = 'PIN LIPO FPV';

    const matchCategory = activeCategory === 'Tất cả' || normCat === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="w-full bg-dark pb-20">
      {/* 1. HERO BANNER */}
      <HeroSlider />

      {/* 2. Brand Marquee */}
      <BrandMarquee />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        
        {/* 3. FLASH SALE */}
        <div className="mt-12 scroll-mt-24" id="flash-sale">
          <FlashSale products={products} onAddToCart={handleAddToCart} />
        </div>

        {/* 4. DANH MỤC SẢN PHẨM */}
        <div id="products" className="scroll-mt-24">
          <CategoryGrid activeCategory={activeCategory} setActiveCategory={setActiveCategory} products={products} />
        </div>

        {/* 5. SẢN PHẨM MỚI & BÁN CHẠY (Featured Products) */}
        <div className="mb-20 animate-fade-up">
          <div className="flex flex-col items-center justify-center mb-10">
            <h3 className="text-3xl font-black font-display text-white uppercase mb-6 tracking-wide">
              Sản phẩm nổi bật
            </h3>
            <div className="flex gap-8 text-sm font-tech font-bold">
              {['MỚI VỀ', 'BÁN CHẠY'].map((tab) => (
                <span 
                  key={tab}
                  onClick={() => setProductTab(tab)}
                  className={`cursor-pointer pb-2 transition-all duration-300 relative ${
                    productTab === tab 
                      ? 'text-primary' 
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                  {productTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_8px_rgba(245,194,66,0.8)]"></span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* THÔNG BÁO KẾT QUẢ TÌM KIẾM */}
          {searchTerm && (
            <div className="mb-6 flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-xl px-5 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-primary flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span className="text-sm text-gray-300">
                Kết quả cho <span className="text-primary font-bold">"{searchTerm}"</span>: tìm thấy <span className="text-white font-bold">{filteredProducts.length}</span> sản phẩm
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {(showAll ? filteredProducts : filteredProducts.slice(0, 10)).map((p) => (
              <ProductCard key={p.id} p={{...p, isNew: productTab === 'MỚI VỀ'}} onAddToCart={handleAddToCart} />
            ))}
          </div>

          {/* KHÔNG TÌM THẤY */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500 text-sm max-w-xs">
                {searchTerm ? `Không có kết quả nào cho "${searchTerm}". Thử tìm với từ khóa khác nhé!` : 'Danh mục này chưa có sản phẩm.'}
              </p>
            </div>
          )}
          
          {!showAll && filteredProducts.length > 10 && (
            <div className="mt-12 flex justify-center">
              <button 
                onClick={() => setShowAll(true)}
                className="bg-transparent border border-primary text-primary px-10 py-3 font-tech font-bold text-sm hover:bg-primary hover:text-black transition-all duration-300 rounded hover:shadow-[0_0_15px_rgba(245,194,66,0.3)] uppercase tracking-widest"
              >
                Xem toàn bộ sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. BANNER TƯ VẤN - PARALLAX EFFECT TẠM */}
      <div className="w-full relative py-20 animate-fade-up border-y border-dark-border mt-10 overflow-hidden">
        {/* Background Image with blur & dark overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579822602737-12df600bb919?q=80&w=2000')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-left">
            <h3 className="text-primary font-tech text-sm mb-2 tracking-widest">#MOOD_FPV_SUPPORT</h3>
            <h2 className="text-3xl md:text-5xl font-black font-display uppercase mb-4 text-white leading-tight">
              MIỄN PHÍ TƯ VẤN <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">LẮP ĐẶT & DỰNG MỚI</span>
            </h2>
            <p className="text-sm text-gray-400 mb-8 max-w-lg leading-relaxed">
              Mỗi sản phẩm chúng tôi bán ra đều được kiểm tra kĩ lưỡng, cài đặt & cân đối cấu hình chuyên nghiệp. Sẵn sàng gỡ rối, nâng cấp để bạn có một trải nghiệm bay FPV chân thực và bùng nổ nhất!
            </p>
            <div className="flex gap-4">
              <button className="bg-primary text-black px-8 py-3 font-tech font-bold text-sm hover:bg-yellow-400 transition-colors rounded shadow-[0_0_15px_rgba(245,194,66,0.4)]">
                BUILD DRONE CHUYÊN HIỆP
              </button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            {/* Vòng tròn neon trang trí siêu đẹp (Premium UI) */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group z-10 cursor-pointer">
              {/* Ánh sáng nền lan toả */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>
              
              {/* Các vòng radar công nghệ */}
              <div className="absolute inset-0 rounded-full border border-primary/20 border-r-primary drop-shadow-[0_0_15px_rgba(245,194,66,0.3)] animate-[spin_8s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border border-white/10 border-l-white/50 animate-[spin_12s_linear_infinite_reverse]"></div>
              <div className="absolute inset-8 rounded-full border border-primary/30 border-dashed animate-[spin_25s_linear_infinite]"></div>
              <div className="absolute inset-12 rounded-full border-t-2 border-primary/70 blur-[1px] animate-[spin_3s_ease-in-out_infinite_alternate]"></div>
              
              {/* Lưới ngắm (Crosshair HUD) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none transition-transform duration-700 group-hover:scale-110">
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent"></div>
                {/* 4 góc ngắm */}
                <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-primary/50"></div>
                <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-primary/50"></div>
                <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-primary/50"></div>
                <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-primary/50"></div>
              </div>

              {/* Tâm năng lượng (Lõi Tool/Build) */}
              <div className="w-36 h-36 bg-gradient-to-br from-yellow-300 via-primary to-yellow-600 flex items-center justify-center rounded-full shadow-[0_0_50px_rgba(245,194,66,0.7)] z-10 relative transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_80px_rgba(245,194,66,0.9)] border-[3px] border-black">
                {/* Vòng sáng viền trong */}
                <div className="absolute inset-0 rounded-full border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"></div>
                
                {/* Hiệu ứng pulse sóng lan */}
                <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping opacity-0 group-hover:opacity-100" style={{ animationDuration: '2s' }}></div>

                {/* SVG Icon thay cho Emoji củ chuối */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-16 h-16 text-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] z-10 group-hover:rotate-[15deg] transition-transform duration-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                </svg>
              </div>

              {/* Bay bay xung quanh (Các mảnh vỡ/hạt bụi ma thuật) */}
              <div className="absolute top-10 right-16 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-80" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute bottom-14 left-12 w-2.5 h-2.5 bg-yellow-100 rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_8px_rgba(245,194,66,0.8)]" style={{ animationDelay: '0.8s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}