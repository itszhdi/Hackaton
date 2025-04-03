import './App.css'
import Router from './Router/Router'
import ErrorBoundary from './Components/ErrorBoundary'


function App() {
  return (
    <>
    <ErrorBoundary>
      <Router/>
    </ErrorBoundary>
    </>
  )
}

export default App
