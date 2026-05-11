// src/contexts/CartContext.jsx
import { createContext, useState, useEffect } from 'react';
import { getStorage, setStorage } from '../services/localStorage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => getStorage('mood_fpv_cart', []));
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setStorage('mood_fpv_cart', cart);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};