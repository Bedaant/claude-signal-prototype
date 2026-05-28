import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Demo from './pages/Demo'
import Calibration from './pages/Calibration'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/demo/:scenarioId" element={<Demo />} />
        <Route path="/calibration" element={<Calibration />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
