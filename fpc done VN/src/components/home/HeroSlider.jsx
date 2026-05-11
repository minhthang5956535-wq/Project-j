import { useState, useEffect } from 'react';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [
    {
      id: 1,
      image: "https://cdn.shopify.com/s/files/1/0609/8324/7079/files/01_5cf3b002-08f6-428f-aaa6-78cd30d924c3.jpg?v=1733387028",
      title: "BỘ KHUNG FPV CAO CẤP",
      subtitle: "Khung Carbon Fiber Siêu Nhẹ - Siêu Bền",
      desc: "Thiết kế tối ưu khí động học - Tốc độ tối đa, kiểm soát hoàn hảo trên mọi địa hình",
      tag: "#FRAME_KIT",
      btnText: "MUA NGAY"
    },
    {
      id: 2,
      image: "https://oscarliang.com/wp-content/uploads/2024/10/how-to-build-tiny-whoop-tutorial-from-scratch-ultralight-1170x780.jpg",
      title: "TINY WHOOP - NHỎ GỌN, ĐỈNH CAO",
      subtitle: "Build Tiny Whoop Từ Đầu Cùng Chuyên Gia",
      desc: "Hướng dẫn lắp ráp chi tiết - Linh kiện chính hãng - Hỗ trợ kỹ thuật 24/7",
      tag: "#TINY_WHOOP",
      btnText: "KHÁM PHÁ"
    },
    {
      id: 3,
      image: "https://tse2.mm.bing.net/th/id/OIP.uos4izXgCEdmJ12JwcCazAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
      title: "FPV RACING - ĐẲNG CẤP TỐC ĐỘ",
      subtitle: "Trải Nghiệm Cảm Giác Bay Chân Thực",
      desc: "Drone racing chuyên nghiệp - Góc nhìn góc nhìn đệ nhất nhân xưng - Adrenaline đỉnh cao",
      tag: "#FPV_RACING",
      btnText: "BAY NGAY"
    },
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 6000); // 6s để có thời gian đọc text
    return () => clearInterval(slideInterval);
  }, [banners.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[480px] xl:h-[560px] overflow-hidden group bg-[#0a0a0c]">
      
      {banners.map((banner, idx) => (
        <div 
          key={banner.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          onClick={() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        >
          <img 
            src={banner.image} 
            className="w-full h-full object-contain" 
            style={{ imageRendering: 'auto' }}
            alt={banner.title} 
          />
        </div>
      ))}

      {/* Điều hướng */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 flex items-center justify-center text-white/50 bg-black/40 backdrop-blur-sm hover:text-primary hover:bg-black/80 hover:border-primary border border-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 flex items-center justify-center text-white/50 bg-black/40 backdrop-blur-sm hover:text-primary hover:bg-black/80 hover:border-primary border border-white/10 rounded-full transition-all opacity-0 group-hover:opacity-100 translate-x-full group-hover:translate-x-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5 15.75 12l-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex gap-3">
        {banners.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-primary w-12' : 'bg-white/30 w-2 hover:bg-white/60 hover:w-4'}`}
          />
        ))}
      </div>
    </div>
  );
}
