export default function CategoryGrid({ activeCategory, setActiveCategory, products = [] }) {
  // Hàm chuẩn hóa tên category (tương tự Home.jsx)
  const normalizeCat = (cat) => {
    if (cat === 'FPV Drones') return 'FPV DRONES';
    if (cat === 'Phụ kiện FPV') return 'BỘ KHUNG FRAME KIT';
    if (cat === 'Đồ điện FPV') return 'MẠCH ĐIỀU KHIỂN FC';
    if (cat === 'Pin Lipo') return 'PIN LIPO FPV';
    return cat;
  };

  const countByCategory = (name) =>
    products.filter(p => normalizeCat(p.category) === name).length;

  const categories = [
    { 
      name: 'Tất cả', 
      count: products.length,
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg> 
    },
    { 
      name: 'FPV DRONES', 
      count: countByCategory('FPV DRONES'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6M12 10a2 2 0 1 0 0 4 2 2 0 1 0 0-4z"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/></svg> 
    }, 
    { 
      name: 'BỘ KHUNG FRAME KIT', 
      count: countByCategory('BỘ KHUNG FRAME KIT'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5 19.5 9.75M4.5 14.25 9.75 19.5M4.5 19.5l15-15M4.5 4.5l15 15" /><circle cx="12" cy="12" r="3" /></svg> 
    },
    { 
      name: 'MẠCH ĐIỀU KHIỂN FC', 
      count: countByCategory('MẠCH ĐIỀU KHIỂN FC'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><rect width="14" height="14" x="5" y="5" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 2v3M16 2v3M8 19v3M16 19v3M2 8h3M2 16h3M19 8h3M19 16h3M9 9h6v6H9z" /></svg> 
    }, 
    { 
      name: 'ĐỘNG CƠ MOTOR', 
      count: countByCategory('ĐỘNG CƠ MOTOR'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><ellipse cx="12" cy="5" rx="8" ry="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M6 10c2.5 1 9.5 1 12 0M6 15c2.5 1 9.5 1 12 0M10 5V2m4 3V2" /></svg> 
    },
    { 
      name: 'PIN LIPO FPV', 
      count: countByCategory('PIN LIPO FPV'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5h6.75V15H4.5v-4.5zM3 7.5h15c.828 0 1.5.672 1.5 1.5v6c0 .828-.672 1.5-1.5 1.5H3c-.828 0-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5z" /></svg> 
    }, 
    { 
      name: 'BỘ PHÁT HÌNH VTX', 
      count: countByCategory('BỘ PHÁT HÌNH VTX'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M8.464 8.464a5 5 0 1 0 7.072 0M12 11.5v9M12 11.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /></svg> 
    },
    { 
      name: 'KÍNH FPV GOGGLES', 
      count: countByCategory('KÍNH FPV GOGGLES'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
    },
    { 
      name: 'CAMERA FPV', 
      count: countByCategory('CAMERA FPV'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
    },
  ];

  return (
    <div className="py-16 animate-fade-up">
      <div className="flex items-center gap-4 mb-10 justify-center">
        <div className="h-[2px] w-16 bg-primary"></div>
        <h3 className="text-center text-3xl font-black font-display text-white uppercase tracking-wider">
          Danh mục sản phẩm
        </h3>
        <div className="h-[2px] w-16 bg-primary"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.name;
          return (
            <div 
              key={idx} 
              onClick={() => setActiveCategory(cat.name)} 
              className={`bg-dark-card border p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group rounded-xl relative overflow-hidden ${
                isActive 
                  ? 'border-primary shadow-[0_0_20px_rgba(245,194,66,0.2)] bg-black' 
                  : 'border-dark-border hover:border-primary/50 hover:bg-[#151515]'
              }`}
            >
              {isActive && <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>}
              
              <div className={`mb-4 group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-500 z-10 ${isActive ? 'scale-110 drop-shadow-[0_0_12px_rgba(245,194,66,0.8)] text-primary' : 'text-gray-400 group-hover:text-primary'}`}>
                {cat.icon}
              </div>
              
              <h4 className={`text-[11px] font-bold uppercase mb-1 z-10 transition-colors ${isActive ? 'text-primary' : 'text-gray-300 group-hover:text-white'}`}>
                {cat.name}
              </h4>
              
              <p className="text-[10px] text-gray-500 font-tech z-10">
                {cat.name === 'Tất cả' ? `${cat.count} sản phẩm` : `${cat.count} items`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
