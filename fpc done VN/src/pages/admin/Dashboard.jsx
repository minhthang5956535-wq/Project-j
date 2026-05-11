// src/pages/admin/Dashboard.jsx
import { useState } from 'react';

export default function Dashboard({ products, setProducts }) {
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newMaxPrice, setNewMaxPrice] = useState('');
  const [newCategory, setNewCategory] = useState('FPV DRONES');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Hàm hỗ trợ dán (paste) trực tiếp file ảnh từ Clipboard
  const handleImagePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setNewImage(event.target.result); // Lưu dưới dạng chuỗi Base64
        };
        reader.readAsDataURL(file);
        e.preventDefault(); // Ngăn hành vi paste default (chỉ nhận text)
        break;
      }
    }
  };

  const handleDelete = (id, name) => {
    const confirm = window.confirm(`Sếp có chắc chắn muốn cho món [${name}] bay màu khỏi kho không?`);
    if (confirm) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice || !newImage) {
      return alert("Sếp điền thiếu thông tin rồi, sao mà bán!");
    }

    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      name: newName,
      price: parseInt(newPrice),
      maxPrice: newMaxPrice ? parseInt(newMaxPrice) : null,
      category: newCategory,
      image: newImage,
      description: newDescription,
      highlights: { status: "Hàng mới nhập", warranty: "1 đổi 1 nếu lỗi" }
    };

    setProducts([...products, newProduct]);
    setShowAddModal(false);
    setNewName(''); setNewPrice(''); setNewMaxPrice(''); setNewImage(''); setNewDescription('');
    alert("🎉 Đã nhập kho thành công!");
  };

  return (
    <div className="w-full relative animate-fade-up">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-primary font-tech tracking-wider text-xs mb-2">QUẢN LÝ DỮ LIỆU</h3>
          <h2 className="text-4xl font-black font-display uppercase text-white tracking-widest text-shadow-sm flex items-center gap-3">
            <span className="w-2 h-10 bg-primary rounded-full inline-block"></span>
            Kho Linh Kiện
          </h2>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-tech font-bold uppercase text-xs tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(245,194,66,0.3)] active:scale-95 flex items-center gap-3 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nhập hàng mới
        </button>
      </div>

      {/* BẢNG DANH SÁCH LƯU KHO */}
      <div className="bg-dark-card/40 border border-dark-border/60 rounded-2xl overflow-hidden glass shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        
        <div className="overflow-x-auto relative z-10 w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-black/40 text-gray-400 font-tech text-[10px] uppercase tracking-[0.2em] border-b border-dark-border">
                <th className="p-6 font-bold w-16">ID</th>
                <th className="p-6 font-bold w-24">Hình ảnh</th>
                <th className="p-6 font-bold">Tên linh kiện</th>
                <th className="p-6 font-bold">Phân loại</th>
                <th className="p-6 font-bold">Giá bán (VNĐ)</th>
                <th className="p-6 font-bold text-right w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center text-gray-500 font-tech tracking-widest uppercase text-sm">Kho đang trống, gọi lái buôn nhập hàng đi Sếp!</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="p-6 text-xs font-tech font-bold text-gray-500">#{p.id}</td>
                    <td className="p-6">
                      <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center p-2 relative overflow-hidden group-hover:border-primary/50 transition-colors">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'block';
                          }}
                        />
                        {/* Fallback Icon if image fails to load */}
                        <div className="hidden absolute text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-gray-200 line-clamp-2 max-w-xs group-hover:text-primary transition-colors">{p.name}</p>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-tech font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded border border-primary/20">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-6 text-base font-black font-display tracking-wide text-white">
                      {p.price.toLocaleString()}₫{p.maxPrice ? ` - ${p.maxPrice.toLocaleString()}₫` : ''}
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDelete(p.id, p.name)}
                        className="text-[11px] font-tech font-bold uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg border border-red-500/30 hover:border-red-600 transition-all shadow-sm"
                      >
                        Bỏ đi
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* KHUNG NHẬP HÀNG MỚI (MODAL) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000] flex items-start justify-center p-4 pt-16 md:pt-24 animate-fade-up" style={{animationDuration: '0.3s'}}>
          <div className="bg-dark-card p-6 md:p-8 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col border border-dark-border shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-primary transition-colors bg-black/50 p-2 rounded-full border border-dark-border z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex-shrink-0 mb-6 pr-8">
              <h3 className="text-2xl font-black font-display text-white uppercase tracking-wider flex items-center gap-3">
                <span className="text-primary text-3xl">📦</span> Khai báo hạm đội
              </h3>
            </div>
            
            <div className="overflow-y-auto pr-2 flex-1">
              <form onSubmit={handleAddProduct} className="flex flex-col gap-5 pb-2">
              <div>
                <label className="text-[10px] font-tech text-gray-400 tracking-widest uppercase font-bold block mb-2">Tên định danh (Tên sản phẩm)</label>
                <input required type="text" placeholder="VD: Khung MARK5 Frame Kit..." value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-black/50 border border-dark-border rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-primary focus:bg-black transition-colors" />
              </div>
              
              <div className="mb-5">
                <label className="text-[10px] font-tech text-gray-400 tracking-widest uppercase font-bold block mb-2">Phân loại đơn vị</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/50 border border-dark-border rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-primary focus:bg-black transition-colors appearance-none">
                  <option value="FPV DRONES">FPV DRONES</option>
                  <option value="BỘ KHUNG FRAME KIT">BỘ KHUNG FRAME KIT</option>
                  <option value="MẠCH ĐIỀU KHIỂN FC">MẠCH ĐIỀU KHIỂN FC</option>
                  <option value="ĐỘNG CƠ MOTOR">ĐỘNG CƠ MOTOR</option>
                  <option value="PIN LIPO FPV">PIN LIPO FPV</option>
                  <option value="BỘ PHÁT HÌNH VTX">BỘ PHÁT HÌNH VTX</option>
                  <option value="KÍNH FPV GOGGLES">KÍNH FPV GOGGLES</option>
                  <option value="CAMERA FPV">CAMERA FPV</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="text-[10px] font-tech text-gray-400 tracking-widest uppercase font-bold block mb-2">Giá Tối Thiểu (VNĐ)</label>
                  <input required type="number" placeholder="VD: 550000" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-black/50 border border-dark-border rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-primary focus:bg-black transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-tech text-gray-400 tracking-widest uppercase font-bold block mb-2">Giá Tối Đa (Bỏ trống nếu không có)</label>
                  <input type="number" placeholder="VD: 760000" value={newMaxPrice} onChange={(e) => setNewMaxPrice(e.target.value)}
                    className="w-full bg-black/50 border border-dark-border rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-primary focus:bg-black transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-tech text-gray-400 tracking-widest uppercase font-bold block mb-2">Tín hiệu hình ảnh (Link Hình HOẶC Dán Ảnh Trực Tiếp Tại Đây)</label>
                <div className="relative">
                  <input required type="text" placeholder="Dán link ảnh HOẶC Ctrl+V hình ảnh vào đây" value={newImage} 
                    onChange={(e) => setNewImage(e.target.value)}
                    onPaste={handleImagePaste}
                    className="w-full bg-black/50 border border-dark-border rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-primary focus:bg-black transition-colors font-mono text-xs pr-12" />
                  
                  {/* Hiển thị icon tick xanh nếu đang chứa Base64 */}
                  {newImage && newImage.length > 500 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary bg-primary/20 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-tech text-gray-400 tracking-widest uppercase font-bold block mb-2">Thông số chi tiết / Mô tả (Tùy chọn)</label>
                <textarea 
                  placeholder="Sếp có thể nhập thông tin chi tiết, linh kiện, độ bền, v.v. vào đây..." 
                  value={newDescription} 
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-black/50 border border-dark-border rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-primary focus:bg-black transition-colors resize-none"
                ></textarea>
              </div>

              <button type="submit" className="w-full mt-6 bg-primary text-black py-4 rounded-xl font-tech font-bold uppercase tracking-[0.2em] text-sm hover:bg-yellow-400 shadow-[0_0_20px_rgba(245,194,66,0.3)] active:scale-95 transition-all">
                Đưa lên kệ bán 🚀
              </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}