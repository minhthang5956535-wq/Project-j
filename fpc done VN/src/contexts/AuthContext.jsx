// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getStorage, setStorage } from '../services/localStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => getStorage('isLoggedIn', false));
  const [isAdmin, setIsAdmin] = useState(() => getStorage('isAdmin', false));
  const [username, setUsername] = useState(() => getStorage('username', ''));

  useEffect(() => {
    setStorage('isLoggedIn', isLoggedIn);
    setStorage('isAdmin', isAdmin);
    setStorage('username', username);
  }, [isLoggedIn, isAdmin, username]);

  // Hàm tiện ích để đăng nhập
  const login = (userData) => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    setIsAdmin(userData.isAdmin || false);
  };

  // Hàm tiện ích để đăng xuất
  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, setIsLoggedIn, 
      isAdmin, setIsAdmin, 
      username, setUsername,
      login, logout // Export hàm mới
    }}>
      {children}
    </AuthContext.Provider>
  );
};