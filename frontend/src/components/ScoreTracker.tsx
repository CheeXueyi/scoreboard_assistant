import { useState, useEffect } from 'react'
import { 
  connectSocket, 
  onScoreUpdate, 
  emitScoreUpdate, 
  disconnectSocket,
  isSocketConnected,
  getSessionCode 
} from '../services/socket'
import '../styles/app.css'

interface ScoreTrackerProps {
  sessionCode: string
}

export default function ScoreTracker({ sessionCode }: ScoreTrackerProps) {
  const [teamAScore, setTeamAScore] = useState(0)
  const [teamBScore, setTeamBScore] = useState(0)
  const [loading, setLoading] = useState(true)

  // Connect to WebSocket on mount
  useEffect(() => {
    const init = async () => {
      try {
        await connectSocket(sessionCode)
        
        // Listen for score updates from server
        onScoreUpdate((scores) => {
          setTeamAScore(scores.teamA)
          setTeamBScore(scores.teamB)
        })
      } catch (error) {
        console.error('Failed to connect:', error)
      } finally {
        setLoading(false)
      }
    }

    init()

    // Cleanup on unmount
    return () => {
      disconnectSocket()
    }
  }, [sessionCode])

  const handleTeamAScore = () => {
    const newScore = teamAScore + 1
    setTeamAScore(newScore)
    emitScoreUpdate(newScore, teamBScore)
  }

  const handleTeamBScore = () => {
    const newScore = teamBScore + 1
    setTeamBScore(newScore)
    emitScoreUpdate(teamAScore, newScore)
  }

  const handleTeamADecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newScore = Math.max(0, teamAScore - 1)
    setTeamAScore(newScore)
    emitScoreUpdate(newScore, teamBScore)
  }

  const handleTeamBDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newScore = Math.max(0, teamBScore - 1)
    setTeamBScore(newScore)
    emitScoreUpdate(teamAScore, newScore)
  }

  const handleReset = () => {
    setTeamAScore(0)
    setTeamBScore(0)
    emitScoreUpdate(0, 0)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '2em' }}>
        {isSocketConnected() ? `Connected: ${getSessionCode()}` : 'Connecting...'}
      </div>
    )
  }

  return (
    <div className="scoreboard">
      <div className="team team-red" onClick={handleTeamAScore}>
        <div className="score">{teamAScore}</div>
        <div className="controls">
          <button onClick={handleTeamADecrement}>−</button>
        </div>
      </div>

      <div className="team team-blue" onClick={handleTeamBScore}>
        <div className="score">{teamBScore}</div>
        <div className="controls">
          <button onClick={handleTeamBDecrement}>−</button>
        </div>
      </div>

      <button className="reset-btn" onClick={handleReset}>Reset</button>
    </div>
  )
}
