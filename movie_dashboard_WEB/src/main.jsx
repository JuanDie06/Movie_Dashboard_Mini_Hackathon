import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import './styles/components.css'
import './styles/pages/home.css'
import './styles/pages/movies.css'
import './styles/pages/movie-detail.css'
import './styles/pages/watchlist.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
