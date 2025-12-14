// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export interface ScoreData {
  teamA: number
  teamB: number
}

/**
 * Fetch current scores from the API
 */
export async function getScores(): Promise<ScoreData> {
  try {
    const response = await fetch(`${API_URL}/scores`)
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch scores:', error)
    // Return default scores if API fails
    return { teamA: 0, teamB: 0 }
  }
}

/**
 * Update team A score
 */
export async function updateTeamAScore(score: number): Promise<ScoreData> {
  try {
    const response = await fetch(`${API_URL}/scores/teamA`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score }),
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to update team A score:', error)
    throw error
  }
}

/**
 * Update team B score
 */
export async function updateTeamBScore(score: number): Promise<ScoreData> {
  try {
    const response = await fetch(`${API_URL}/scores/teamB`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score }),
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to update team B score:', error)
    throw error
  }
}

/**
 * Reset both scores
 */
export async function resetScores(): Promise<ScoreData> {
  try {
    const response = await fetch(`${API_URL}/scores/reset`, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Failed to reset scores:', error)
    throw error
  }
}
