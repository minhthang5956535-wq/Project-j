// src/components/common/CartDrawer.jsx
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CartDrawer({ isOpen, onClose, cart, setCart }) {
  const navigate = useNavigate();
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  // Nhóm các mặt hàng giống nhau lại để hiển thị số lượng
  const groupedCart = cart.reduce((acc, item) => {
    const existingItem = acc.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      acc.push({ ...item, qty: 1 });
    }
    return acc;
  }, []);

  const handleRemove = (id) => {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const handleAdd = (item) => {
    setCart([...cart, item]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      return toast.error("Khoang chứa đồ trống trơn, mua gì đi Pilot ơi!");
    }
    onClose(); 
    navigate('/checkout'); 
  };

  return (
    <>
      {/* Lớp mờ đen khi mở khay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      ></div>

      {/* Khay giỏ hàng nền trắng */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[2001] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Tiêu đề */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-sm font-black uppercase text-gray-800 tracking-wider">Giỏ hàng của Pilot</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-xl transition-colors">✕</button>
        </div>

        {/* Danh sách sản phẩm (Dạng Grid) */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#f9fafb]">
          {groupedCart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <span className="text-6xl mb-4 grayscale">🛒</span>
              <p className="text-xs font-bold text-gray-500 uppercase">Chưa có linh kiện nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {groupedCart.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 p-3 rounded-lg flex flex-col items-center text-center shadow-sm relative group hover:border-[#f5c242] transition-colors">
                  <img src={item.image} className="w-16 h-16 object-contain mb-3" alt={item.name} />
                  <h4 className="text-[10px] font-bold text-gray-700 line-clamp-2 h-7 mb-2">{item.name}</h4>
                  
                  {/* Cụm tăng giảm số lượng */}
                  <div className="flex items-center border border-gray-200 rounded-md overflow-hidden mb-2">
                    <button onClick={() => handleRemove(item.id)} className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs">-</button>
                    <span className="px-3 py-0.5 text-[10px] font-bold border-x border-gray-200">{item.qty}</span>
                    <button onClick={() => handleAdd(item)} className="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs">+</button>
                  </div>
                  
                  <p className="text-[#d12020] font-bold text-xs w-full">{item.price.toLocaleString()}₫</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phần tổng kết và Thanh toán */}
        <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-bold uppercase text-xs">Tổng cộng:</span>
            <span className="text-lg font-black text-[#d12020]">{totalPrice.toLocaleString()}₫</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <button onClick={handleCheckout} className="w-full bg-[#f5c242] text-black py-3.5 rounded-lg font-black uppercase tracking-wider text-sm hover:bg-yellow-400 transition-all shadow-[0_4px_15px_rgba(245,194,66,0.3)]">
              Đặt hàng
            </button>
            <button onClick={() => { onClose(); navigate('/'); }} className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all">
              ← Tiếp tục chọn thêm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}