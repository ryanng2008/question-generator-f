import React from 'react'
import ReactDOM from 'react-dom/client'
import './init'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './AuthContext.tsx'
import '@fontsource-variable/inter'; // Default weight 400
// Supports weights 200-800
import '@fontsource-variable/karla';
import '@fontsource/poppins/500.css';
//if (typeof global === 'undefined') {
//  window.global = window;
//}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
