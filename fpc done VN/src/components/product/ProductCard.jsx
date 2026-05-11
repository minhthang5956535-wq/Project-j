import { Link } from 'react-router-dom';

export default function ProductCard({ p, onAddToCart }) {
  return (
    <Link 
      to={`/product/${p.id}`} 
      className="bg-dark-card border border-dark-border p-4 hover:shadow-[0_0_20px_rgba(245,194,66,0.15)] hover:border-primary/50 transition duration-300 group flex flex-col relative rounded-xl overflow-hidden"
    >
      <div className="aspect-square bg-white/5 flex items-center justify-center mb-4 overflow-hidden rounded-lg relative">
        <img 
          src={p.image} 
          className="w-full h-full object-contain group-hover:scale-110 transition duration-700 ease-in-out p-4" 
          alt={p.name} 
        />
        {/* Nhãn MỚI / SALE */}
        {p.isNew && (
          <span className="absolute top-2 left-2 bg-primary text-black text-[10px] font-black px-2 py-1 uppercase rounded-sm z-10">
            Mới
          </span>
        )}
      </div>
      
      <h4 className="text-xs text-gray-300 font-medium line-clamp-2 h-8 mb-2 group-hover:text-primary transition-colors">
        {p.name}
      </h4>
      
      <div className="mt-auto flex flex-col">
        {p.oldPrice && (
          <span className="text-gray-500 line-through text-[10px] font-tech tracking-wider">
            {p.oldPrice.toLocaleString()}₫
          </span>
        )}
        <span className="text-primary font-bold text-sm tracking-wide">
          {p.price.toLocaleString()}₫
        </span>
      </div>
      
      {/* Nút thêm vào giỏ hàng: Hiện ra mượt mà khi hover */}
      <button 
        onClick={(e) => onAddToCart(e, p)} 
        className="absolute bottom-4 right-4 bg-dark border border-dark-border w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-primary hover:text-black hover:border-primary opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
        title="Thêm vào giỏ"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </Link>
  );
}
