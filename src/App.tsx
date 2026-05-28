import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Demo from './pages/Demo'
import Playground from './pages/Playground'
import Calibration from './pages/Calibration'
import About from './pages/About'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/demo/:scenarioId" element={<Demo />} />
          <Route path="/demo" element={<Navigate to="/demo/risky" replace />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/calibration" element={<Calibration />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
              <h1 className="text-2xl font-bold text-text-primary mb-2">Page not found</h1>
              <p className="text-text-secondary mb-4">The page you requested does not exist.</p>
              <a href="/" className="px-4 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors">
                Go Home
              </a>
            </div>
          } />
        </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
