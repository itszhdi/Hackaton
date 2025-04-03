import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BudgetsProvider } from './Contexts/BudgetContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BudgetsProvider>
        <App />
    </BudgetsProvider>
  </StrictMode>,
)
