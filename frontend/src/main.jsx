import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ApiProvider } from './context/ApiContext.jsx'
import { MissionProvider } from './context/MissionContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <MissionProvider>
            <App />
          </MissionProvider>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
