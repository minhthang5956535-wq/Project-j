import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserRank } from '../../utils/userStats';

function CustomSelect({ options, value, onChange, placeholder, disabled, emptyMessage }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }} 
        className={`w-full bg-white dark:bg-[#111111] border border-gray-300 dark:border-white/10 rounded px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-gray-500 dark:focus:border-white/30 transition-all text-sm flex justify-between items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 dark:hover:border-white/20'}`}
      >
        <span className={val => !value ? 'text-gray-500' : ''}>{value || placeholder}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
         <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a1c28] border border-gray-200 dark:border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-lg max-h-56 overflow-y-auto z-50 animate-fade-in custom-scrollbar">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 italic text-center">{emptyMessage}</div>
            ) : (
              options.map(o => (
                 <div key={o.value} onClick={() => handleSelect(o.value)} className="px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer text-sm text-gray-900 dark:text-gray-200 transition-colors">
                    {o.label}
                 </div>
              ))
            )}
         </div>
      )}
    </div>
  );
}

export default function Checkout({ cart, username }) {
  const navigate = useNavigate();
  const { rank, discount } = getUserRank(username);
  
  // Dữ liệu form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [agreeTos, setAgreeTos] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  // Dữ liệu Tỉnh/Thành & Quận/Huyện từ API
  const [provincesList, setProvincesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=2')
      .then(res => res.json())
      .then(data => {
        setProvincesList(data);
        setIsLoadingProvinces(false);
      })
      .catch(err => {
        console.error("Lỗi tải dữ liệu tỉnh thành:", err);
        setIsLoadingProvinces(false);
      });
  }, []);

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    setDistrict(''); // Reset quận huyện khi tỉnh thay đổi
    
    const foundProv = provincesList.find(p => p.name === selectedCity);
    if (foundProv && foundProv.districts) {
      setDistrictsList(foundProv.districts);
    } else {
      setDistrictsList([]);
    }
  };

  // Tính toán tiền
  const originalTotal = cart.reduce((total, item) => total + item.price, 0);
  const discountAmount = originalTotal * discount;
  const finalTotal = originalTotal - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center">
        <h2 className="text-2xl text-white font-black uppercase mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link to="/" className="text-[#f59e0b] hover:underline hover:text-yellow-400 font-bold transition-all">← Tiếp tục mua sắm</Link>
      </div>
    );
  }

  const handleProceed = (e) => {
    e.preventDefault();
    if (!city) {
      alert("Vui lòng chọn Tỉnh/Thành phố!");
      return;
    }
    if (!district) {
      alert("Vui lòng chọn Quận/Huyện!");
      return;
    }
    if (phone.length !== 10) {
      alert("Số điện thoại phải bao gồm đúng 10 chữ số!");
      return;
    }
    if (!agreeTos) {
      alert("Bạn cần đồng ý với Điều khoản & Điều kiện trước khi đặt hàng!");
      return;
    }
    navigate('/payment', { 
      state: { 
        billingDetails: { firstName, lastName, address, district, city, phone, email } 
      } 
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f6f8] dark:bg-[#0a0a0c] py-12 px-4 transition-colors font-sans">
      {/* CSS For custom scrollbar inside the select dropdown */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #555; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #888; }
      `}</style>
      <div className="max-w-[1200px] mx-auto">
        
        {/* MÃ ƯU ĐÃI */}
        <div className="mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Bạn có mã ưu đãi? <button type="button" onClick={() => setShowCoupon(!showCoupon)} className="font-bold underline hover:text-[#f59e0b] transition-colors">Ấn vào đây để nhập mã</button>
          </p>
          {showCoupon && (
            <div className="flex gap-2 max-w-sm mt-3 animate-fade-in border border-gray-200 dark:border-white/10 p-3 rounded-lg bg-white dark:bg-[#111] shadow-sm">
              <input type="text" placeholder="Mã ưu đãi" className="flex-1 border border-gray-300 dark:border-white/10 rounded px-3 py-1.5 outline-none bg-transparent text-gray-900 dark:text-white text-sm focus:border-gray-400 dark:focus:border-white/30" />
              <button type="button" className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-1.5 rounded text-sm font-bold hover:opacity-80 transition-opacity">Áp dụng</button>
            </div>
          )}
        </div>

        <form onSubmit={handleProceed} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
          <div className="lg:col-span-7">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-6 pb-2 border-b-2 border-transparent border-b-gray-200 dark:border-b-white/10">Thông tin thanh toán</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 block">Tên <span className="text-red-500">*</span></label>
                <input required type="text" value={firstName} onChange={e=>setFirstName(e.target.value.replace(/[^a-zA-ZÀ-ỹ\s]/g, ''))} className="w-full bg-white dark:bg-[#111111] border border-gray-300 dark:border-white/10 rounded px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-gray-500 dark:focus:border-white/30 transition-all text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 block">Họ <span className="text-red-500">*</span></label>
                <input required type="text" value={lastName} onChange={e=>setLastName(e.target.value.replace(/[^a-zA-ZÀ-ỹ\s]/g, ''))} className="w-full bg-white dark:bg-[#111111] border border-gray-300 dark:border-white/10 rounded px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-gray-500 dark:focus:border-white/30 transition-all text-sm" />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 block">Địa chỉ <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Số nhà, tên đường..." value={address} onChange={e=>setAddress(e.target.value.replace(/[^a-zA-Z0-9À-ỹ\s,\.\-\/]/g, ''))} className="w-full bg-white dark:bg-[#111111] border border-gray-300 dark:border-white/10 rounded px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-gray-500 dark:focus:border-white/30 transition-all text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 block">Tỉnh thành <span className="text-red-500">*</span></label>
                <CustomSelect 
                  disabled={isLoadingProvinces}
                  value={city}
                  onChange={handleCityChange}
                  placeholder={isLoadingProvinces ? "Đang tải dữ liệu..." : "Chọn Tỉnh/Thành phố..."}
                  options={provincesList.map(p => ({ label: p.name, value: p.name }))}
                  emptyMessage="Không có dữ liệu"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 block">Quận huyện <span className="text-red-500">*</span></label>
                <CustomSelect 
                  disabled={!city}
                  value={district}
                  onChange={setDistrict}
                  placeholder="Chọn Quận/Huyện..."
                  options={districtsList.map(d => ({ label: d.name, value: d.name }))}
                  emptyMessage="Vui lòng chọn Tỉnh/Thành phố trước"
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 block">Số điện thoại <span className="text-red-500">*</span></label>
                <input 
                  id="phone"
                  required 
                  type="text" 
                  value={phone} 
                  placeholder="0xxxxxxxxx"
                  onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 11))} 
                  className="w-full bg-white dark:bg-[#111111] border border-gray-300 dark:border-white/10 rounded px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-gray-500 dark:focus:border-white/30 transition-all text-sm" 
                />
              </div>
              <div>
                <label htmlFor="email" className="text-xs font-bold text-gray-700 dark:text-gray-400 mb-2 block">Địa chỉ email <span className="text-red-500">*</span></label>
                <input 
                  id="email"
                  required 
                  type="email" 
                  value={email} 
                  placeholder="vidu@gmail.com"
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full bg-white dark:bg-[#111111] border border-gray-300 dark:border-white/10 rounded px-4 py-2.5 text-gray-900 dark:text-white outline-none focus:border-gray-500 dark:focus:border-white/30 transition-all text-sm" 
                />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BILL (BOX) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="border-[2px] border-gray-800 dark:border-white/10 p-6 sm:p-8 bg-white dark:bg-[#1a1c28] sticky top-24 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase mb-6 tracking-wide">Đơn hàng của bạn</h2>
              
              <div className="flex justify-between items-center mb-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-white/5 pb-2">
                <span>Sản phẩm</span>
                <span>Tạm tính</span>
              </div>

              <div className="flex flex-col gap-3 py-2 text-sm border-b border-gray-200 dark:border-white/5 pb-4 mb-4">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4 text-gray-700 dark:text-gray-300">
                    <span className="flex-1 pr-4">{item.name} <strong className="text-gray-900 dark:text-white">× 1</strong></span>
                    <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">{item.price.toLocaleString()}₫</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-white/5 pb-3">
                <span>Tạm tính</span>
                <span className="text-gray-900 dark:text-white">{originalTotal.toLocaleString()}₫</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b border-gray-200 dark:border-white/5 pb-3">
                  <span>Ưu đãi hạng thẻ</span>
                  <span className="text-green-600 dark:text-green-400">-{discountAmount.toLocaleString()}₫</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm font-black mb-6">
                <span className="text-gray-900 dark:text-white uppercase">Tổng</span>
                <span className="text-gray-900 dark:text-white">{finalTotal.toLocaleString()}₫</span>
              </div>

              <div className="bg-gray-50 dark:bg-black/30 p-4 rounded mb-6 text-sm">
                <p className="font-bold text-gray-900 dark:text-white mb-2 font-sans">Chuyển khoản ngân hàng</p>
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                  Hãy điền MoodFPV + Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.
                </p>
              </div>

              <div className="flex items-start gap-3 mb-6">
                <input 
                  type="checkbox" 
                  id="tos" 
                  checked={agreeTos}
                  onChange={(e) => setAgreeTos(e.target.checked)}
                  className="mt-1 flex-shrink-0 w-4 h-4 text-gray-800 dark:text-primary rounded border border-gray-300 dark:border-white/20 focus:ring-gray-800 dark:focus:ring-primary accent-gray-900 dark:accent-primary"
                />
                <label htmlFor="tos" className="text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                  Tôi đã đọc và đồng ý với <span className="font-black">Điều khoản & Điều kiện</span> của website <span className="text-red-500">*</span>
                </label>
              </div>

              <button type="submit" className="w-full bg-[#f5c242] hover:bg-[#e0b030] text-black font-black uppercase text-sm py-4 tracking-widest transition-colors mb-6 shadow-sm">
                Đặt hàng
              </button>

              <p className="text-[10px] text-gray-500 dark:text-gray-500 leading-relaxed">
                Thông tin cá nhân của bạn sẽ được sử dụng để xử lý đơn hàng, tăng trải nghiệm sử dụng website, và cho các mục đích cụ thể khác đã được mô tả trong Chính sách bảo mật.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}