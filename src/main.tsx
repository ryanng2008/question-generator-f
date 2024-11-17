import React from 'react'
import ReactDOM from 'react-dom/client'
import './init'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

//if (typeof global === 'undefined') {
//  window.global = window;
//}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>,
)
