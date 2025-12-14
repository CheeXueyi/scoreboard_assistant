/**
 * Home Page - Session Creation
 * 
 * Users can create a new session and get a shareable code
 */

import { useNavigate } from 'react-router-dom'
import { generateSessionCode } from '../utils/session'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()
  const sessionCode = generateSessionCode()

  const handleStartScoreboard = () => {
    navigate(`/scoreboard/${sessionCode}`)
  }

  const handleJoinSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const input = (e.currentTarget.elements.namedItem('sessionCode') as HTMLInputElement).value.toUpperCase()
    if (input.length === 7) { // XXX-XXX
      navigate(`/scoreboard/${input}`)
    }
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Scoreboard Assistant</h1>
        
        <div className="session-section create-section">
          <h2>Create New Session</h2>
          <p>Start a new scoreboard session</p>
          <div className="session-code-display">{sessionCode}</div>
          <p className="session-hint">Share this code with others to join</p>
          <button onClick={handleStartScoreboard} className="btn-create">
            Start Scoreboard
          </button>
        </div>

        <div className="divider">OR</div>

        <div className="session-section join-section">
          <h2>Join Existing Session</h2>
          <p>Enter a session code to join</p>
          <form onSubmit={handleJoinSession}>
            <input
              type="text"
              name="sessionCode"
              placeholder="e.g., ABC-123"
              maxLength={7}
              autoComplete="off"
              className="session-input"
            />
            <button type="submit" className="btn-join">
              Join Session
            </button>
          </form>
        </div>

        <div className="info-section">
          <h3>How It Works</h3>
          <ol>
            <li>Create a new session or join an existing one</li>
            <li>Share the session code with other displays</li>
            <li>All scoreboards with the same code sync in real-time</li>
            <li>Later, use the code to configure input devices</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
