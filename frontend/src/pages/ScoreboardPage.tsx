/**
 * Scoreboard Page - Displays scoreboard for a specific session
 */

import { useParams, useNavigate } from 'react-router-dom'
import ScoreTracker from '../components/ScoreTracker'
import '../styles/scoreboard-page.css'

export default function ScoreboardPage() {
  const { sessionCode } = useParams<{ sessionCode: string }>()
  const navigate = useNavigate()

  if (!sessionCode) {
    return <div>Invalid session code</div>
  }

  return (
    <div className="scoreboard-page">
      <ScoreTracker sessionCode={sessionCode} />
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
    </div>
  )
}
