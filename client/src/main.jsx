import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'

const appearance = {
  variables: {
    colorPrimary: '#2A65F5', // main brand color
    colorText: '#111827',     // text color
    colorBackground: 'white', // background of sections
  },
  elements: {
    card: 'rounded-lg shadow-lg', // add custom classes
    button: 'bg-green-500 hover:bg-green-600',
  },
};

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={appearance}>
  <BrowserRouter>
    <App />
  </ BrowserRouter>,
  </ClerkProvider>
)
