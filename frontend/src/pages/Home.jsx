import React from 'react';
import api from '../utils/api';
import { Star, MapPin, Heart, Search, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const categories = [
  { name: 'Tất cả', icon: '🏠' },
  { name: 'Biển', icon: '🏖️' },
  { name: 'Đồi núi', icon: '⛰️' },
  { name: 'Nông thôn', icon: '🚜' },
  { name: 'Hồ bơi', icon: '🏊' },
  { name: 'Căn hộ', icon: '🏢' },
  { name: 'Rừng nhiệt đới', icon: '🌴' },
  { name: 'Nhà hang động', icon: '🗿' },
];

const PropertyCard = ({ property, index }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <img 
          src={property.images?.[0]?.image_url || property.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"} 
          alt={property.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <button className="absolute top-4 right-4 p-2.5 rounded-full glass hover:bg-white transition-colors z-10">
          <Heart size={20} className="text-gray-900 group-hover:text-[var(--primary)] transition-colors" />
        </button>
        
        {property.tag && (
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass text-[10px] font-bold uppercase tracking-widest text-gray-900">
            {property.tag}
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="glass py-2 px-4 rounded-xl text-center text-xs font-bold text-gray-900 flex items-center justify-center gap-2">
                Xem chi tiết <ChevronRight size={14} />
            </div>
        </div>
      </div>
      
      <div className="px-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{property.title}</h3>
          <div className="flex items-center gap-1.5 text-sm font-bold">
            <Star size={14} className="fill-[var(--primary)] text-[var(--primary)]" />
            {property.rating || "4.8"}
          </div>
        </div>
        <p className="text-[var(--gray-light)] text-sm flex items-center gap-1 mb-2">
          <MapPin size={14} className="opacity-60" /> {property.address || property.location}
        </p>
        <p className="flex items-baseline gap-1">
          <span className="font-extrabold text-lg">{(property.price_per_night || property.price).toLocaleString('vi-VN')} ₫</span>
          <span className="text-[var(--gray-light)] text-sm">/ đêm</span>
        </p>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [properties, setProperties] = React.useState([]);
  const [filteredProperties, setFilteredProperties] = React.useState([]);
  const [activeCategory, setActiveCategory] = React.useState('Tất cả');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const location = useLocation();

  React.useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const search = queryParams.get('search');
        
        let url = '/properties';
        if (search) {
            url += `?search=${encodeURIComponent(search)}`;
        }

        const response = await api.get(url);
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [location.search]);

  React.useEffect(() => {
    if (activeCategory === 'Tất cả') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, properties]);

  return (
    <div className="pb-32 bg-[var(--bg-light)] min-h-screen">
      {/* Category Filter - Fixed/Sticky on Scroll */}
      <div className="sticky top-[80px] z-40 bg-white/80 backdrop-blur-md border-b mb-12">
        <div className="container py-4 flex gap-10 overflow-x-auto no-scrollbar items-center">
            {categories.map((cat, i) => (
            <button 
                key={i} 
                onClick={() => setActiveCategory(cat.name)}
                className={`flex flex-col items-center gap-2.5 min-w-fit transition-all relative pb-3 group ${
                activeCategory === cat.name ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                }`}
            >
                <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className={`text-xs font-bold tracking-tight ${activeCategory === cat.name ? 'text-black' : 'text-gray-500'}`}>
                    {cat.name}
                </span>
                {activeCategory === cat.name && (
                    <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
            </button>
            ))}
        </div>
      </div>

      {/* Hero / Promo Section */}
      <section className="container mb-20 animate-slide-up">
        <div className="relative h-[600px] rounded-[40px] overflow-hidden shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            alt="Hero Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent flex flex-col justify-center p-16 text-white">
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="inline-block px-4 py-1.5 rounded-full border border-white/30 glass-dark text-xs font-bold uppercase tracking-widest mb-6">
                    Mùa hè rực rỡ 2026
                </div>
                <h1 className="text-7xl font-extrabold mb-6 leading-[1.1] font-['Outfit']">
                    Khám phá <br /> 
                    <span className="gradient-text">thiên đường</span> <br /> 
                    của riêng bạn.
                </h1>
                <p className="text-xl opacity-80 mb-10 max-w-xl leading-relaxed">
                    Trải nghiệm những căn hộ mang phong cách thượng lưu, view biển tuyệt mỹ và dịch vụ hàng đầu chỉ có tại onghai.
                </p>
                <div className="flex gap-4">
                    <button className="btn-premium flex items-center gap-3">
                        Bắt đầu khám phá <ArrowRight size={20} />
                    </button>
                    <button className="glass-dark px-8 py-4 rounded-[var(--radius-md)] font-bold hover:bg-white/10 transition-all border border-white/20">
                        Xem video
                    </button>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="container">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-4xl font-extrabold mb-2 font-['Outfit']">Điểm đến hàng đầu</h2>
                <p className="text-[var(--gray-light)] font-medium">Được cộng đồng onghai đánh giá cao nhất trong tháng này</p>
            </div>
            <button className="px-6 py-2.5 rounded-full border border-gray-200 font-bold hover:bg-white hover:shadow-md transition-all text-sm">
                Xem tất cả
            </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="flex flex-col gap-4">
                    <div className="aspect-[4/5] rounded-[24px] bg-gray-200 animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass p-12 text-center rounded-[32px] text-red-600 shadow-lg">
             <div className="text-5xl mb-4">⚠️</div>
             <p className="text-xl font-bold mb-2">Không thể tải dữ liệu phòng</p>
             <p className="opacity-70 text-sm">Hãy kiểm tra lại kết nối server tại <code>http://localhost:5000</code></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((prop, i) => (
                <PropertyCard key={prop.id} property={prop} index={i} />
              ))
            ) : (
              <div className="col-span-full py-32 text-center glass rounded-[40px] border-dashed border-2">
                <div className="text-6xl mb-6">🏝️</div>
                <h3 className="text-2xl font-bold mb-2">Chưa có kết quả</h3>
                <p className="text-[var(--gray-light)]">Chúng tôi chưa có phòng nào trong danh mục này tại khu vực này.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const ArrowRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
)

export default Home;
