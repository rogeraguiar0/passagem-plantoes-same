import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@fontsource-variable/inter"
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { AuthGate } from './components/AuthGate.tsx'
import { PackageProvider } from './contexts/PackageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthGate>
        <PackageProvider>
          <App />
        </PackageProvider>
      </AuthGate>
    </AuthProvider>
  </StrictMode>,
)
