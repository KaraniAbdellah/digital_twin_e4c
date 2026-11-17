import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RiadProvider } from './global/context/RiadContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RiadProvider>
      <App />
    </RiadProvider>
  </React.StrictMode>,
)
