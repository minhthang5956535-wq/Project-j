// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import 2 cái nhà kho mình vừa xây
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>,
)