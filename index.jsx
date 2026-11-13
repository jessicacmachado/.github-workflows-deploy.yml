import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => {
      console.error('Não foi possível ativar o modo offline:', error)
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
