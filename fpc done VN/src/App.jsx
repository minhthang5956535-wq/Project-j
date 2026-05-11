// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// GỌI HOOKS VÀ SERVICES THAY VÌ VIẾT CODE DÀI THÒNG
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { getStorage, setStorage } from './services/localStorage';

import MainLayout from './layouts/MainLayout';
import Home from './pages/public/Home';
import ProductDetail from './pages/public/ProductDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Checkout from './pages/public/Checkout';
import PaymentQR from './pages/public/PaymentQR';
import OrderHistory from './pages/user/OrderHistory';
import Profile from './pages/user/Profile';

import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import OrderManage from './pages/admin/OrderManage';
import UserManage from './pages/admin/UserManage';

import { initialProducts } from './data';

export default function App() {
  // LẤY DỮ LIỆU TỪ CONTEXT LÊN BẰNG CÁCH DÙNG CUSTOM HOOKS
  const { isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, username, setUsername } = useAuth();
  const { cart, setCart, isCartOpen, setIsCartOpen } = useCart();

  // Dữ liệu sản phẩm mặc định
  const [products, setProducts] = useState(() => getStorage('mood_fpv_products', initialProducts));
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch dữ liệu từ backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Xử lý map lại dữ liệu khớp với frontend
          const formattedData = data.map(item => ({
            ...item,
            category: item.category_name || item.category || 'Chưa phân loại',
            image: item.image_url || item.image || initialProducts[0].image,
            highlights: item.highlights || {}
          }));
          setProducts(formattedData);
        }
      })
      .catch(err => {
        console.error('Không thể kết nối backend, sử dụng mockup data', err);
      });
  }, []);

  // Tự động sửa các sản phẩm bị gán sai category dựa vào tên  
  useEffect(() => {
    const fixedProducts = products.map(p => {
      const name = p.name.toLowerCase();
      let correctCat = p.category;

      if (name.includes('kính') || name.includes('goggles') || name.includes('goggle')) {
        correctCat = 'KÍNH FPV GOGGLES';
      } else if (name.includes('camera') && (name.includes('fpv') || name.includes('cam'))) {
        correctCat = 'CAMERA FPV';
      } else if (name.includes('vtx') || name.includes('video transmitter') || name.includes('phát hình')) {
        correctCat = 'BỘ PHÁT HÌNH VTX';
      } else if (name.includes('pin') || name.includes('lipo') || name.includes('battery')) {
        correctCat = 'PIN LIPO FPV';
      } else if (name.includes('motor') || name.includes('động cơ') || name.includes('brushless')) {
        correctCat = 'ĐỘNG CƠ MOTOR';
      } else if (name.includes('fc') || name.includes('flight controller') || name.includes('mạch điều khiển') || name.includes('mạch điều tốc') || name.includes('4in1') || name.includes('esc')) {
        correctCat = 'MẠCH ĐIỀU KHIỂN FC';
      } else if (name.includes('khung') || name.includes('frame') || name.includes('kit')) {
        correctCat = 'BỘ KHUNG FRAME KIT';
      }

      return correctCat !== p.category ? { ...p, category: correctCat } : p;
    });

    // Chỉ cập nhật nếu có thay đổi
    const hasChanges = fixedProducts.some((p, i) => p.category !== products[i].category);
    if (hasChanges) setProducts(fixedProducts);
  }, []); // Chỉ chạy 1 lần khi app mount

  useEffect(() => {
    setStorage('mood_fpv_products', products);
  }, [products]);

  return (
    <Router>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route element={
          <MainLayout 
            cart={cart} setCart={setCart} 
            isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} 
            username={username} isLoggedIn={isLoggedIn}
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin}
          />
        }>
          <Route path="/" element={<Home products={products} cart={cart} setCart={setCart} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
          <Route path="/product/:id" element={<ProductDetail products={products} cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} username={username} />} />
          <Route path="/payment" element={<PaymentQR cart={cart} setCart={setCart} username={username} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} setUsername={setUsername} />} />
          <Route path="/register" element={<Login initialTab="register" />} />
          <Route path="/profile" element={<Profile username={username} />} />
          <Route path="/orders-history" element={<OrderHistory username={username} />} />
        </Route>

        <Route path="/admin" element={isAdmin ? <AdminLayout setIsAdmin={setIsAdmin} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard products={products} setProducts={setProducts} />} />
          <Route path="orders" element={<OrderManage />} />
          <Route path="users" element={<UserManage />} />
        </Route>
      </Routes>
    </Router>
  );
}