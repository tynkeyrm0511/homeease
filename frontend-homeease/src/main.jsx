import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
// Import Tailwind first, then component styles
import './index.css'
// antd-mobile global styles (v6+) - imports reset and design tokens
import 'antd-mobile/es/global'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
