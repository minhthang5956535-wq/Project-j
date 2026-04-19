import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRoute from './components/Auth/AdminRoute';
import Bookings from './pages/Bookings';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Checkout from './pages/Checkout';
import Footer from './components/Layout/Footer';
import { useLocation } from 'react-router-dom';

const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app-wrapper">
      {!isAdminPage && <Navbar />}
      <main className={!isAdminPage ? "pt-[100px]" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
