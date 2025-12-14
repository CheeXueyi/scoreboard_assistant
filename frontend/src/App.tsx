import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ScoreboardPage from './pages/ScoreboardPage'
import './styles/app.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scoreboard/:sessionCode" element={<ScoreboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
