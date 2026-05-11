// src/pages/public/ProductDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ProductDetail({ products, cart, setCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  
  // Tìm món hàng có id khớp với url
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <div className="p-20 text-center text-white">Ủa, linh kiện này bay màu rồi cụ ơi! 🛸</div>;
  }

  const handleAddToCart = () => {
    setCart([...cart, product]);
    alert(`Đã ném [${product.name}] vào giỏ hàng! 🛒`);
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0c] p-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <button onClick={() => navigate(-1)} className="text-[#f59e0b] font-black uppercase tracking-widest text-xs mb-8 hover:underline">
          ← Quay lại Xưởng
        </button>

        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row gap-12">
          {/* CỘT ẢNH */}
          <div className="w-full md:w-1/2 bg-[#1a1c28] rounded-2xl p-8 flex items-center justify-center relative group">
            <div className="absolute top-4 left-4 bg-[#f59e0b] text-black text-[10px] font-black uppercase px-3 py-1 rounded-full">
              {product.category}
            </div>
            <img src={product.image} alt={product.name} className="max-h-[400px] object-contain group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* CỘT THÔNG TIN */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">{product.name}</h1>
            <p className="text-3xl font-black text-[#f59e0b] mb-8">{product.price.toLocaleString()}₫</p>

            <div className="bg-[#1a1c28] border border-white/5 rounded-2xl p-6 mb-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Thông số bay (Specs)</h3>
              <ul className="flex flex-col gap-3">
                {Object.entries(product.highlights || {}).map(([key, value]) => (
                  <li key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500 uppercase font-bold">{key}:</span>
                    <span className="text-white font-black">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#f59e0b] text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#d97706] shadow-lg shadow-[#f59e0b]/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="text-xl">🛒</span> Ném vào giỏ hàng
            </button>
          </div>
        </div>

        {/* THÔNG TIN CHI TIẾT SẢN PHẨM & ĐÁNH GIÁ (BẢN CŨ) */}
        <div className="mt-12 flex flex-col lg:flex-row gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* CỘT TRÁI: TABS & CONTENT */}
          <div className="flex-1">
            {/* Headers / Tabs */}
            <div className="flex text-sm font-bold uppercase tracking-wider text-white">
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-colors ${activeTab === 'info' ? 'bg-[#3b2a1a]' : 'bg-[#2a1a10] hover:bg-[#3b2a1a]'}`}
              >
                <span className="text-[#f59e0b] text-xl">🏷️</span> Thông tin sản phẩm
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 transition-colors border-l border-white/10 ${activeTab === 'reviews' ? 'bg-[#3b2a1a]' : 'bg-[#2a1a10] hover:bg-[#3b2a1a]'}`}
              >
                <span className="text-[#f59e0b] text-xl">⭐</span> Đánh giá nhận xét
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="bg-white text-black p-8 border border-t-0 border-[#3b2a1a]/20">
              {activeTab === 'info' ? (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Specifications</h3>
                  <div className="mb-6 leading-relaxed whitespace-pre-wrap text-gray-700 text-sm md:text-base">
                    {product.description || (
                      <p>
                        <strong>KV:</strong> 900KV<br/>
                        <strong>Base casing:</strong> Al 7075<br/>
                        <strong>Stator:</strong> 0.2mm Nippon stell silicon steel<br/>
                        <strong>Configuration:</strong> 12N14P<br/>
                        <strong>Prop Adapter Shaft Thread:</strong> M5<br/>
                        <strong>Shaft:</strong> SUS420<br/>
                        <strong>No.of Cells(Lipo):</strong> 6S<br/>
                        <strong>Bolt Pattern:</strong> M3 (19X19mm)<br/>
                        <strong>Bearings:</strong> Japanese NMB 12X6X4<br/>
                        <strong>Rotor:</strong> N52H arc magnets<br/>
                        <strong>Weight:</strong> 125.2g<br/>
                        <strong>Wire AWG:</strong> 16# 30cm length<br/>
                        <strong>Bell cap:</strong> Al 7075
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 py-12 text-center bg-gray-50 border border-dashed border-gray-300">
                  <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: TẠI SAO CHỌN CHÚNG TÔI */}
          <div className="lg:w-[350px] flex-shrink-0">
            <div className="bg-[#2a1a10] text-white py-4 px-6 text-center font-bold uppercase tracking-wider text-sm">
              TẠI SAO BẠN NÊN CHỌN CHÚNG TÔI
            </div>
            <div className="bg-white border border-gray-200 border-t-0 p-6 flex flex-col gap-6">
              <div className="flex justify-center mb-2">
                 <div className="text-4xl font-black text-center leading-none text-gray-800 flex items-center gap-2">
                   <div className="text-right">
                     <div>WHY</div>
                     <div>CHOOSE</div>
                     <div>US</div>
                   </div>
                   <div className="text-8xl text-gray-600">?</div>
                 </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-md">🏆</div>
                <p className="text-sm text-gray-700 leading-snug">Thương hiệu lâu năm, 1 trong những cửa hàng lâu đời nhất còn đang tồn tại và phát triển.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-md">👍</div>
                <p className="text-sm text-gray-700 leading-snug">Sản phẩm chính hãng, đa dạng về chủng loại, giá cả.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-md">👥</div>
                <p className="text-sm text-gray-700 leading-snug">Đội ngũ kỹ thuật giàu kinh nghiệm, trung thực, tận tâm với khách hàng.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-md">🔧</div>
                <p className="text-sm text-gray-700 leading-snug">Chế độ hậu mãi hợp lí, cân bằng lợi ích cả 2 bên.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-md">🚚</div>
                <p className="text-sm text-gray-700 leading-snug">Vận chuyển miễn phí cho khu vực nội thành với đơn hàng trên 2 triệu đồng.</p>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-900 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-md">💵</div>
                <p className="text-sm text-gray-700 leading-snug">Kiểm tra hàng, thanh toán tại nhà khi nhận hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}